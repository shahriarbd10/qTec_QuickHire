import { NextResponse } from "next/server";
import { addJob, getJobs } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";
import { jobSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json({ data: await getJobs() });
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid job payload." },
        { status: 400 },
      );
    }

    const job = await addJob({
      ...parsed.data,
      logoText: parsed.data.company.slice(0, 2).toUpperCase(),
      color: "#4f46e5",
    });

    return NextResponse.json({ data: job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not connect to MongoDB. Check DATABASE_URL and network access." },
      { status: 500 },
    );
  }
}
