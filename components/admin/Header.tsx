type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-3xl bg-white px-8 py-6 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-[#0A2F5A]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}