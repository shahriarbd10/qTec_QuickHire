import { AdminPage } from "@/components/admin-page";
import { getJobsByCompanyId } from "@/lib/data";
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
  return <AdminPage initialJobs={jobs} currentUser={user} />;
}
