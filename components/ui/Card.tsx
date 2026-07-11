import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-7
        shadow-sm
        transition-all
        duration-300
        ${hover ? "hover:-translate-y-2 hover:shadow-2xl" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}