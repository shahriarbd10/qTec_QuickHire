import { AdminPage } from "@/components/admin-page";
import { getJobs } from "@/lib/data";
import { requireCurrentUser } from "@/lib/server-users";
import { redirect } from "next/navigation";

export default async function AdminRoute() {
  const user = await requireCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const jobs = await getJobs();
  return <AdminPage initialJobs={jobs} currentUser={user} />;
}
