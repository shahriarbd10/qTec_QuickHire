import { NextResponse } from "next/server";
import { deleteJob, getJobById } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ data: job });
  } catch {
    return NextResponse.json(
      { error: "Could not load the job from MongoDB." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (!user.companyId) {
      return NextResponse.json({ error: "Admin company is not configured." }, { status: 400 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { id } = await params;
    const removed = await deleteJob(id, user.companyId);

    if (!removed) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ data: removed });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the job from MongoDB." },
      { status: 500 },
    );
  }
}
