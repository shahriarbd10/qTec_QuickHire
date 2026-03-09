import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const mongoFile = path.resolve(process.cwd(), "mongoLink.txt");
  if (fs.existsSync(mongoFile)) {
    const value = fs.readFileSync(mongoFile, "utf8").trim();
    if (value) {
      process.env.DATABASE_URL = value;
      return value;
    }
  }

  throw new Error("DATABASE_URL is not configured.");
}

const DATABASE_URL = resolveDatabaseUrl();

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const connect = () =>
      mongoose.connect(DATABASE_URL, {
        dbName: "quickhire",
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
      });

    cache.promise = Promise.resolve()
      .then(connect)
      .catch(async (error: unknown) => {
        const message = String(error instanceof Error ? error.message : error);
        const isSrvLookupError = message.includes("querySrv") || message.includes("ECONNREFUSED");

        if (DATABASE_URL.startsWith("mongodb+srv://") && isSrvLookupError) {
          const servers =
            process.env.MONGODB_DNS_SERVERS?.split(",")
              .map((value) => value.trim())
              .filter(Boolean) || ["8.8.8.8", "1.1.1.1"];

          dns.setServers(servers);
          return connect();
        }

        throw error;
      })
      .catch((error) => {
        cache.promise = null;

        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("querysrv econnrefused")
        ) {
          throw new Error(
            "QuickHire could not reach MongoDB Atlas because the SRV DNS lookup failed. Replace DATABASE_URL with the standard mongodb:// driver URI from Atlas or use a DNS/network that allows SRV lookups.",
          );
        }

        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
