import { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "green" | "yellow" | "red";
};

const colorClasses = {
  blue: {
    background: "bg-blue-50",
    icon: "text-blue-600",
  },
  green: {
    background: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  yellow: {
    background: "bg-amber-50",
    icon: "text-amber-600",
  },
  red: {
    background: "bg-red-50",
    icon: "text-red-600",
  },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  color = "blue",
}: DashboardCardProps) {
  const styles = colorClasses[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.background}`}
        >
          <Icon
            size={24}
            className={styles.icon}
          />
        </div>
      </div>
    </div>
  );
}