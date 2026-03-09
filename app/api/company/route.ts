import { NextResponse } from "next/server";
import { getCompanyById, updateCompanyById } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";

export async function GET() {
  const user = await requireCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!user.companyId) {
    return NextResponse.json({ error: "Admin company is not configured." }, { status: 400 });
  }

  const company = await getCompanyById(user.companyId);
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  return NextResponse.json({ data: company });
}

export async function PATCH(request: Request) {
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

    const body = (await request.json()) as {
      name?: string;
      location?: string;
      description?: string;
      logoUrl?: string;
      logoPublicId?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const company = await updateCompanyById(user.companyId, body);
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    return NextResponse.json({ data: company });
  } catch {
    return NextResponse.json({ error: "Could not update the company." }, { status: 500 });
  }
}
