import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "green" | "yellow" | "red";
  href: string;
};

const colorClasses = {
  blue: { background: "bg-blue-50", icon: "text-blue-600" },
  green: { background: "bg-emerald-50", icon: "text-emerald-600" },
  yellow: { background: "bg-amber-50", icon: "text-amber-600" },
  red: { background: "bg-red-50", icon: "text-red-600" },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  color = "blue",
  href,
}: DashboardCardProps) {
  const styles = colorClasses[color];

  return (
    <Link
      href={href}
      className="block rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0A2F5A]/10"
    >
      <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0A2F5A]/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">{title}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
            {description && (
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.background}`}>
            <Icon size={22} className={styles.icon} />
          </div>
        </div>
      </div>
    </Link>
  );
}
