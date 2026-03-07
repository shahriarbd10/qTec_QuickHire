import { NextResponse } from "next/server";
import { addApplication, getJobById } from "@/lib/data";
import { applicationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid application payload." },
        { status: 400 },
      );
    }

    const job = await getJobById(parsed.data.jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const application = await addApplication({
      ...parsed.data,
    });

    return NextResponse.json({ data: application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not save the application to MongoDB." },
      { status: 500 },
    );
  }
}
