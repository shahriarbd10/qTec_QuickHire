"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  UserRoundSearch,
  X,
} from "lucide-react";
import { Application, AuthUser, CompanyProfile, JOB_CATEGORIES, JOB_TYPES, Job } from "@/lib/types";

type Tab = "dashboard" | "applicants" | "jobs" | "settings";
type StatsView = "week" | "month" | "year";

type JobForm = {
  title: string;
  location: string;
  category: Job["category"];
  type: Job["type"];
  summary: string;
  description: string;
  featured: boolean;
  latest: boolean;
};

const emptyJobForm: JobForm = {
  title: "",
  location: "",
  category: "Design",
  type: "Full-Time",
  summary: "",
  description: "",
  featured: false,
  latest: false,
};

function getJobForm(job?: Job): JobForm {
  if (!job) return emptyJobForm;
  return {
    title: job.title,
    location: job.location,
    category: job.category,
    type: job.type,
    summary: job.summary,
    description: job.description,
    featured: Boolean(job.featured),
    latest: Boolean(job.latest),
  };
}

function formatDateRange() {
  return "Jul 19 - Jul 25";
}

function formatShortDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatsSeries(jobs: Job[], view: StatsView) {
  const scale = view === "week" ? 1 : view === "month" ? 2 : 3;
  const labels =
    view === "week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : view === "month"
        ? ["W1", "W2", "W3", "W4"]
        : ["Q1", "Q2", "Q3", "Q4"];

  return labels.map((label, index) => {
    const base = jobs[index % Math.max(jobs.length, 1)];
    return {
      label,
      views: Math.max(2, (jobs.length + index + 2) * scale),
      applied: Math.max(1, (base?.featured ? 3 : 2) + index),
    };
  });
}

export function AdminPage({
  initialJobs,
  initialApplications,
  currentUser,
  initialCompany,
}: {
  initialJobs: Job[];
  initialApplications: Application[];
  currentUser: AuthUser;
  initialCompany: CompanyProfile | null;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [statsView, setStatsView] = useState<StatsView>("week");
  const [jobs, setJobs] = useState(initialJobs);
  const [applications] = useState(initialApplications);
  const [company, setCompany] = useState(initialCompany);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<JobForm>(emptyJobForm);
  const [companyForm, setCompanyForm] = useState({
    name: initialCompany?.name || currentUser.company || "",
    location: initialCompany?.location || "",
    description: initialCompany?.description || "",
  });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", otp: "" });
  const [working, setWorking] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const stats = useMemo(() => {
    const employmentCounts = JOB_TYPES.reduce<Record<string, number>>((acc, type) => {
      const count = jobs.filter((job) => job.type === type).length;
      if (count) acc[type] = count;
      return acc;
    }, {});

    return {
      totalJobs: jobs.length,
      featuredJobs: jobs.filter((job) => job.featured).length,
      latestJobs: jobs.filter((job) => job.latest).length,
      applications: applications.length,
      employmentCounts,
    };
  }, [applications.length, jobs]);

  const statSeries = useMemo(() => getStatsSeries(jobs, statsView), [jobs, statsView]);
  const linkedApplications = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        job: jobs.find((job) => job.id === application.jobId) ?? null,
      })),
    [applications, jobs],
  );

  const clearStatus = () => {
    setMessage(null);
    setError(null);
  };

  const openCreate = () => {
    clearStatus();
    setEditingJobId(null);
    setJobForm(emptyJobForm);
    setModalOpen(true);
  };

  const openEdit = (job: Job) => {
    clearStatus();
    setEditingJobId(job.id);
    setJobForm(getJobForm(job));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJobId(null);
    setJobForm(emptyJobForm);
  };

  const saveJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearStatus();
    setWorking(true);

    try {
      const response = await fetch(editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs", {
        method: editingJobId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save the job.");

      const savedJob = payload.data as Job;
      setJobs((current) =>
        editingJobId ? current.map((job) => (job.id === savedJob.id ? savedJob : job)) : [savedJob, ...current],
      );
      setMessage(editingJobId ? "Job updated successfully." : "Job created successfully.");
      setActiveTab("jobs");
      closeModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the job.");
    } finally {
      setWorking(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    clearStatus();
    setWorking(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not delete the job.");

      setJobs((current) => current.filter((job) => job.id !== jobId));
      setMessage("Job deleted successfully.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the job.");
    } finally {
      setWorking(false);
    }
  };

  const saveCompany = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearStatus();
    setWorking(true);

    try {
      const response = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not update the company.");

      setCompany(payload.data as CompanyProfile);
      setMessage("Company settings updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update the company.");
    } finally {
      setWorking(false);
    }
  };

  const sendOtp = async () => {
    clearStatus();
    setSendingOtp(true);

    try {
      const response = await fetch("/api/auth/change-password/request-otp", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not send OTP.");
      setMessage(payload.message || "OTP sent successfully.");
    } catch (otpError) {
      setError(otpError instanceof Error ? otpError.message : "Could not send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearStatus();
    setChangingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(securityForm),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not change password.");

      setSecurityForm({ currentPassword: "", newPassword: "", otp: "" });
      setMessage(payload.message || "Password updated successfully.");
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Could not change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f5fb] text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col xl:flex-row">
        <aside className="border-b border-border bg-[#f8f8fd] xl:min-h-screen xl:w-[244px] xl:border-b-0 xl:border-r">
          <div className="p-5 xl:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff4ea]">
                {company?.logoUrl ? (
                  <Image src={company.logoUrl} alt={company.name} width={32} height={32} className="h-8 w-8 object-contain" />
                ) : (
                  <Building2 className="h-5 w-5 text-[#56cdad]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-epilogue text-xs text-muted">Company</p>
                <p className="font-clash text-[31px] font-semibold leading-[1.15] text-ink">{company?.name || currentUser.company}</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {[
                { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
                { id: "applicants" as const, label: "All Applicants", icon: UserRoundSearch },
                { id: "jobs" as const, label: "Job Listing", icon: ClipboardList },
                { id: "settings" as const, label: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? "bg-[#ececff] text-brand" : "text-[#7c8493] hover:bg-white"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-epilogue text-base font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-border px-6 py-8">
            <p className="font-epilogue text-xs font-medium uppercase tracking-[0.22em] text-[#a8adb7]">Support</p>
            <div className="mt-4 space-y-2">
              <button type="button" onClick={() => setActiveTab("settings")} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[#7c8493] transition hover:bg-white">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-epilogue text-base font-medium">Security</span>
              </button>
              <button type="button" onClick={() => setActiveTab("settings")} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[#7c8493] transition hover:bg-white">
                <Settings className="h-4 w-4" />
                <span className="font-epilogue text-base font-medium">Help Center</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-border bg-white px-4 py-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3fff7]">
                  {company?.logoUrl ? (
                    <Image src={company.logoUrl} alt={company.name} width={34} height={34} className="h-9 w-9 object-contain" />
                  ) : (
                    <Building2 className="h-5 w-5 text-[#56cdad]" />
                  )}
                </div>
                <div>
                  <p className="font-epilogue text-sm text-muted">Company</p>
                  <p className="font-clash text-[32px] font-semibold leading-none">{company?.name || currentUser.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border text-[#7c8493]">
                  <Bell className="h-4 w-4" />
                </button>
                <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 font-epilogue text-sm font-semibold text-ink">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-epilogue text-sm font-semibold text-white">
                  <Plus className="h-4 w-4" />
                  Post a job
                </button>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8">
            {(message || error) && <div className={`mb-6 rounded-2xl border px-4 py-3 font-epilogue text-sm ${error ? "border-red-200 bg-red-50 text-red-600" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}
            {activeTab === "dashboard" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="font-clash text-[30px] font-semibold tracking-[-0.02em]">Good morning, {currentUser.name.split(" ")[0].toUpperCase()}</h1>
                    <p className="mt-2 max-w-3xl font-epilogue text-[18px] leading-8 text-muted">Here is your job listing statistic report for {company?.name || currentUser.company}.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white px-5 py-3 font-epilogue text-base text-muted">{formatDateRange()}</div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="rounded-[24px] bg-brand px-6 py-5 text-white"><div className="flex items-start justify-between gap-3"><div><p className="font-clash text-5xl font-semibold">{stats.applications}</p><p className="mt-3 font-epilogue text-[16px] leading-7">New candidates to review</p></div><ChevronRight className="mt-2 h-4 w-4" /></div></div>
                  <div className="rounded-[24px] bg-[#56cdad] px-6 py-5 text-white"><div className="flex items-start justify-between gap-3"><div><p className="font-clash text-5xl font-semibold">{stats.featuredJobs}</p><p className="mt-3 font-epilogue text-[16px] leading-7">Priority listings active today</p></div><ChevronRight className="mt-2 h-4 w-4" /></div></div>
                  <div className="rounded-[24px] bg-[#26a4ff] px-6 py-5 text-white"><div className="flex items-start justify-between gap-3"><div><p className="font-clash text-5xl font-semibold">{stats.latestJobs}</p><p className="mt-3 font-epilogue text-[16px] leading-7">Messages received</p></div><ChevronRight className="mt-2 h-4 w-4" /></div></div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_320px]">
                  <div className="rounded-[24px] border border-border bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-clash text-[30px] font-semibold">Job statistics</h2>
                        <p className="mt-2 font-epilogue text-base text-muted">Showing activity from your live listings</p>
                      </div>
                      <div className="inline-flex rounded-2xl bg-[#f7f7fd] p-1">
                        {(["week", "month", "year"] as const).map((item) => (
                          <button key={item} type="button" onClick={() => setStatsView(item)} className={`rounded-xl px-4 py-2 font-epilogue text-sm font-semibold capitalize ${statsView === item ? "bg-white text-brand shadow-sm" : "text-[#7c8493]"}`}>{item}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-[20px] border border-border p-4">
                      <div className="flex h-[250px] items-end gap-4">
                        {statSeries.map((item) => (
                          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                            <div className="flex h-[180px] items-end gap-[6px]">
                              <div className="w-10 rounded-t-lg bg-[#f4b63a]" style={{ height: `${Math.max(42, item.views * 8)}px` }} />
                              <div className="w-10 rounded-t-lg bg-[#7a5af8]" style={{ height: `${Math.max(32, item.applied * 18)}px` }} />
                            </div>
                            <span className="font-epilogue text-sm text-muted">{item.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-5 font-epilogue text-sm text-muted">
                        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#f4b63a]" />Job View</span>
                        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#7a5af8]" />Job Applied</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-border bg-white p-6"><p className="font-clash text-[24px] font-semibold">Job Open</p><div className="mt-4 font-clash text-[72px] font-semibold leading-none">{stats.totalJobs}</div><p className="mt-4 font-epilogue text-base text-muted">Jobs opened</p></div>
                    <div className="rounded-[24px] border border-border bg-white p-6"><p className="font-clash text-[24px] font-semibold">Applicant Summary</p><div className="mt-4 flex items-end gap-3"><span className="font-clash text-[72px] font-semibold leading-none">{stats.applications}</span><span className="mb-2 font-epilogue text-base text-muted">Applications</span></div><div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#eef1f7]">{Object.entries(stats.employmentCounts).slice(0, 4).map(([type, count], index) => <div key={type} className={index === 0 ? "bg-[#7a5af8]" : index === 1 ? "bg-[#56cdad]" : index === 2 ? "bg-[#26a4ff]" : "bg-[#f4b63a]"} style={{ width: `${(count / Math.max(jobs.length, 1)) * 100}%` }} />)}</div><div className="mt-4 space-y-2">{Object.entries(stats.employmentCounts).map(([type, count]) => <div key={type} className="flex items-center justify-between font-epilogue text-sm text-muted"><span>{type}</span><span>{count}</span></div>)}</div></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "applicants" && (
              <section className="rounded-[24px] border border-border bg-white p-6">
                <div>
                  <h2 className="font-clash text-[34px] font-semibold">All applicants</h2>
                  <p className="mt-2 font-epilogue text-base text-muted">Submitted applications from the public job pages.</p>
                </div>
                <div className="mt-6 space-y-4">
                  {linkedApplications.length ? linkedApplications.map((application) => (
                    <article key={application.id} className="rounded-[20px] border border-border p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-clash text-[26px] font-semibold">{application.name}</h3>
                          <p className="mt-2 font-epilogue text-base text-muted">{application.email}</p>
                          <p className="mt-3 font-epilogue text-sm text-muted">Applied for {application.job?.title || "a removed job"} on {formatShortDate(application.createdAt)}</p>
                        </div>
                        <a href={application.resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-2xl border border-brand px-4 py-2 font-epilogue text-sm font-semibold text-brand">View resume</a>
                      </div>
                      <p className="mt-4 font-epilogue text-base leading-7 text-[#4c566a]">{application.coverNote}</p>
                    </article>
                  )) : <div className="rounded-[20px] border border-dashed border-border p-8 text-center font-epilogue text-muted">No applications yet.</div>}
                </div>
              </section>
            )}

            {activeTab === "jobs" && (
              <section className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-clash text-[34px] font-semibold">Current jobs</h2>
                    <p className="mt-2 font-epilogue text-base text-muted">View, edit, and publish the listings belonging to {company?.name || currentUser.company}.</p>
                  </div>
                  <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-epilogue text-sm font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Post a job
                  </button>
                </div>

                <div className="rounded-[24px] border border-border bg-white p-6">
                  <div className="space-y-4">
                    {jobs.length ? jobs.map((job) => (
                      <article key={job.id} className="rounded-[20px] border border-border p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate font-clash text-[26px] font-semibold">{job.title}</h3>
                            <p className="mt-2 font-epilogue text-base text-muted">{job.company} • {job.location} • {job.category} • {job.type}</p>
                            <p className="mt-3 font-epilogue text-base leading-7 text-[#4c566a]">{job.summary}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => openEdit(job)} className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 font-epilogue text-sm font-semibold text-ink"><Pencil className="h-4 w-4" />Edit</button>
                            <button type="button" onClick={() => deleteJob(job.id)} className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 font-epilogue text-sm font-semibold text-red-500"><Trash2 className="h-4 w-4" />Delete</button>
                          </div>
                        </div>
                      </article>
                    )) : <div className="rounded-[20px] border border-dashed border-border p-8 text-center font-epilogue text-muted">No listings yet.</div>}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
                <form onSubmit={saveCompany} className="rounded-[24px] border border-border bg-white p-6">
                  <h2 className="font-clash text-[34px] font-semibold">Company settings</h2>
                  <p className="mt-2 font-epilogue text-base text-muted">Keep your QuickHire company identity accurate across all listings.</p>
                  {company?.logoUrl ? <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-[#f8f8fd]"><Image src={company.logoUrl} alt={company.name} width={52} height={52} className="h-12 w-12 object-contain" /></div> : null}
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <input value={companyForm.name} onChange={(event) => setCompanyForm((current) => ({ ...current, name: event.target.value }))} placeholder="Company name" className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                    <input value={companyForm.location} onChange={(event) => setCompanyForm((current) => ({ ...current, location: event.target.value }))} placeholder="Company location" className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                  </div>
                  <textarea value={companyForm.description} onChange={(event) => setCompanyForm((current) => ({ ...current, description: event.target.value }))} placeholder="Company description" className="mt-4 min-h-[180px] w-full rounded-2xl border border-border bg-[#f7f9ff] px-4 py-4 font-epilogue outline-none" />
                  <button type="submit" disabled={working} className="mt-6 rounded-2xl bg-brand px-6 py-3 font-epilogue text-sm font-semibold text-white disabled:opacity-60">{working ? "Saving..." : "Save company settings"}</button>
                </form>

                <form onSubmit={changePassword} className="rounded-[24px] border border-border bg-white p-6">
                  <h2 className="font-clash text-[34px] font-semibold">Security</h2>
                  <p className="mt-2 font-epilogue text-base text-muted">Enter your current password and new password, then confirm the change with email OTP.</p>
                  <div className="mt-6 space-y-4">
                    <input type="password" value={securityForm.currentPassword} onChange={(event) => setSecurityForm((current) => ({ ...current, currentPassword: event.target.value }))} placeholder="Current password" className="h-14 w-full rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                    <input type="password" value={securityForm.newPassword} onChange={(event) => setSecurityForm((current) => ({ ...current, newPassword: event.target.value }))} placeholder="New password" className="h-14 w-full rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                    <div className="flex gap-3">
                      <input value={securityForm.otp} onChange={(event) => setSecurityForm((current) => ({ ...current, otp: event.target.value }))} placeholder="6-digit OTP" className="h-14 min-w-0 flex-1 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                      <button type="button" onClick={sendOtp} disabled={sendingOtp} className="rounded-2xl border border-brand px-4 py-3 font-epilogue text-sm font-semibold text-brand disabled:opacity-60">{sendingOtp ? "Sending..." : "Send OTP"}</button>
                    </div>
                  </div>
                  <button type="submit" disabled={changingPassword} className="mt-6 rounded-2xl bg-brand px-6 py-3 font-epilogue text-sm font-semibold text-white disabled:opacity-60">{changingPassword ? "Updating..." : "Confirm password change"}</button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14182a]/55 px-4 py-8">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-epilogue text-sm uppercase tracking-[0.2em] text-brand">QuickHire admin</p>
                <h2 className="mt-2 font-clash text-4xl font-semibold text-ink">{editingJobId ? "Edit listing" : "Post a new job"}</h2>
              </div>
              <button type="button" onClick={closeModal} className="rounded-2xl border border-border p-3 text-muted"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={saveJob} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={jobForm.title} onChange={(event) => setJobForm((current) => ({ ...current, title: event.target.value }))} placeholder="Job title" className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
                <input value={jobForm.location} onChange={(event) => setJobForm((current) => ({ ...current, location: event.target.value }))} placeholder="Location" className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <select value={jobForm.category} onChange={(event) => setJobForm((current) => ({ ...current, category: event.target.value as Job["category"] }))} className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none">{JOB_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
                <select value={jobForm.type} onChange={(event) => setJobForm((current) => ({ ...current, type: event.target.value as Job["type"] }))} className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none">{JOB_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
              </div>
              <input value={jobForm.summary} onChange={(event) => setJobForm((current) => ({ ...current, summary: event.target.value }))} placeholder="Short summary" className="h-14 rounded-2xl border border-border bg-[#f7f9ff] px-4 font-epilogue outline-none" />
              <textarea value={jobForm.description} onChange={(event) => setJobForm((current) => ({ ...current, description: event.target.value }))} placeholder="Full description" className="min-h-[180px] rounded-2xl border border-border bg-[#f7f9ff] px-4 py-4 font-epilogue outline-none" />
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-3 rounded-2xl border border-border px-4 py-3 font-epilogue text-sm text-ink"><input type="checkbox" checked={jobForm.featured} onChange={(event) => setJobForm((current) => ({ ...current, featured: event.target.checked }))} />Featured on homepage</label>
                <label className="inline-flex items-center gap-3 rounded-2xl border border-border px-4 py-3 font-epilogue text-sm text-ink"><input type="checkbox" checked={jobForm.latest} onChange={(event) => setJobForm((current) => ({ ...current, latest: event.target.checked }))} />Latest jobs section</label>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="rounded-2xl border border-border px-5 py-3 font-epilogue text-sm font-semibold text-ink">Cancel</button>
                <button type="submit" disabled={working} className="rounded-2xl bg-brand px-6 py-3 font-epilogue text-sm font-semibold text-white disabled:opacity-60">{working ? "Saving..." : editingJobId ? "Save changes" : "Create job"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
