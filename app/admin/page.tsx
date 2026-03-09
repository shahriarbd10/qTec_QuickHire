import { AdminPage } from "@/components/admin-page";
import { getApplicationsByCompanyId, getCompanyById, getJobsByCompanyId } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";
import { redirect } from "next/navigation";

export default async function AdminRoute() {
  const user = await requireCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!user.companyId) {
    redirect("/register");
  }

  const jobs = await getJobsByCompanyId(user.companyId);
  const applications = await getApplicationsByCompanyId(user.companyId);
  const company = await getCompanyById(user.companyId);
  return <AdminPage initialJobs={jobs} initialApplications={applications} currentUser={user} initialCompany={company} />;
}
