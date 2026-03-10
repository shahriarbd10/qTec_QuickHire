import { NextResponse } from "next/server";
import { addJob, getCompanyById, getJobs } from "@/lib/data";
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
    if (!user.companyId || !user.company) {
      return NextResponse.json({ error: "Admin company is not configured." }, { status: 400 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid job payload." },
        { status: 400 },
      );
    }

    const company = await getCompanyById(user.companyId);
    const logoUrl = parsed.data.logoUrl?.trim() ? parsed.data.logoUrl : company?.logoUrl || "";
    const logoPublicId = parsed.data.logoPublicId?.trim() ? parsed.data.logoPublicId : company?.logoPublicId || "";

    const job = await addJob({
      ...parsed.data,
      companyId: user.companyId,
      company: user.company,
      logoText: user.company.slice(0, 2).toUpperCase(),
      logoUrl,
      logoPublicId,
      color: "#4f46e5",
      createdByUserId: user.id,
    });

    return NextResponse.json({ data: job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not connect to MongoDB. Check DATABASE_URL and network access." },
      { status: 500 },
    );
  }
}
