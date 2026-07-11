interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  theme?: "light" | "dark";
}

export default function SectionTitle(props: SectionTitleProps) {
  const centerClass = props.center === false ? "" : "text-center";
  const isDark = props.theme === "dark";

  return (
    <div className={`mb-14 ${centerClass}`}>
      {props.badge ? (
        <span
          className={`font-semibold uppercase tracking-[0.25em] ${
            isDark ? "text-blue-200" : "text-[#1565C0]"
          }`}
        >
          {props.badge}
        </span>
      ) : null}

      <h2
        className={`mt-3 text-4xl font-bold md:text-5xl ${
          isDark ? "text-white" : "text-[#0B2E6D]"
        }`}
      >
        {props.title}
      </h2>

      {props.subtitle ? (
        <p
          className={`mx-auto mt-5 max-w-3xl text-lg ${
            isDark ? "text-blue-100" : "text-gray-600"
          }`}
        >
          {props.subtitle}
        </p>
      ) : null}
    </div>
  );
}