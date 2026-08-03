import Link from "next/link";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type Action = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: Action;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
  children,
}: PageHeaderProps) {
  const Icon = action?.icon;

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {children}

        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2F5A] px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            {Icon && <Icon size={18} />}
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}