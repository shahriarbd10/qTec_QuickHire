import {
  ArrowRight,
  BriefcaseBusiness,
  ChartColumn,
  Code2,
  Landmark,
  Megaphone,
  Monitor,
  Palette,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobCategory } from "@/lib/types";

const icons: Record<JobCategory, React.ComponentType<{ className?: string }>> = {
  Design: Palette,
  Sales: ChartColumn,
  Marketing: Megaphone,
  Finance: Landmark,
  Technology: Monitor,
  Engineering: Code2,
  Business: BriefcaseBusiness,
  "Human Resource": Users,
};

export function CategoryCard({
  name,
  jobsAvailable,
  highlighted,
}: {
  name: JobCategory;
  jobsAvailable: number;
  highlighted?: boolean;
}) {
  const Icon = icons[name];

  return (
    <div
      className={cn(
        "border border-border bg-white p-6 transition hover:-translate-y-1 hover:shadow-card",
        highlighted && "border-brand bg-brand text-white",
      )}
    >
      <Icon className={cn("h-8 w-8", highlighted ? "text-white" : "text-brand")} />
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className={cn("mt-2 text-sm", highlighted ? "text-white/80" : "text-muted")}>
            {jobsAvailable} jobs available
          </p>
        </div>
        <ArrowRight className={cn("h-4 w-4", highlighted ? "text-white" : "text-ink")} />
      </div>
    </div>
  );
}
