import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const DATABASE_URL = process.env.DATABASE_URL;

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
    cache.promise = mongoose.connect(DATABASE_URL, {
      dbName: "quickhire",
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
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
  }
}
