import {
  ReactNode,
} from "react";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
};

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <article
      className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-4xl font-bold text-[#0A2F5A]">
            {new Intl.NumberFormat(
              "pt-BR"
            ).format(value)}
          </p>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-[#0A2F5A]
            text-white
          "
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}