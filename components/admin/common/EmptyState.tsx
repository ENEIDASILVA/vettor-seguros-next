import Link from "next/link";
import { ReactNode } from "react";
import { LucideIcon, Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon: Icon = Inbox,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Icon
          size={40}
          className="text-slate-500"
        />
      </div>

      <h2 className="text-xl font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-slate-500">
        {description}
      </p>

      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}

      {!children && actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-xl bg-[#0A2F5A] px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}