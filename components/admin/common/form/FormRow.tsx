import type { ReactNode } from "react";

type FormRowProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
};

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

export default function FormRow({
  children,
  columns = 2,
  className = "",
}: FormRowProps) {
  return (
    <div
      className={`grid gap-5 ${columnClasses[columns]} ${className}`}
    >
      {children}
    </div>
  );
}