import { ReactNode } from "react";

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function StepLayout({
  title,
  subtitle,
  children,
}: StepLayoutProps) {
  return (
    <div>
      <h2 className="mb-3 text-3xl font-bold text-[#0B2E6D]">
        {title}
      </h2>

      {subtitle && (
        <p className="mb-8 text-gray-600">
          {subtitle}
        </p>
      )}

      <div>{children}</div>
    </div>
  );
}