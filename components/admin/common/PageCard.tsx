import { ReactNode } from "react";

type PageCardProps = {
  children: ReactNode;
  className?: string;
};

export default function PageCard({
  children,
  className = "",
}: PageCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}