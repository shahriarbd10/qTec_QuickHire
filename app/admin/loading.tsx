export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5fb] px-4 text-ink">
      <div className="flex flex-col items-center gap-4 rounded-[28px] border border-border bg-white px-10 py-10 shadow-card">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="font-epilogue text-sm text-muted">Loading dashboard…</p>
      </div>
    </div>
  );
}

