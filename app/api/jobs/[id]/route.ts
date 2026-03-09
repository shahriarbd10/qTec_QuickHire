import { NextResponse } from "next/server";
import { deleteJob, getJobById, updateJob } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";
import { jobSchema } from "@/lib/validation";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (!user.companyId || !user.company) {
      return NextResponse.json({ error: "Admin company is not configured." }, { status: 400 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid job payload." },
        { status: 400 },
      );
    }

    const updated = await updateJob(
      id,
      {
        ...parsed.data,
        company: user.company,
        logoText: user.company.slice(0, 2).toUpperCase(),
        color: "#4f46e5",
      },
      user.companyId,
    );

    if (!updated) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json(
      { error: "Could not update the job in MongoDB." },
      { status: 500 },
    );
  }
}
