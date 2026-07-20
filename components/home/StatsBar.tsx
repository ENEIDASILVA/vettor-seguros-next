import {
  ShieldCheck,
  Handshake,
  Clock3,
  Headphones,
} from "lucide-react";

const stats = [
  {
    title: "Diversas seguradoras",
    text: "Comparação entre opções do mercado",
    icon: ShieldCheck,
  },
  {
    title: "Atendimento consultivo",
    text: "Orientação personalizada para cada perfil",
    icon: Handshake,
  },
  {
    title: "Cotação rápida",
    text: "Agilidade para encontrar boas opções",
    icon: Clock3,
  },
  {
    title: "Suporte em sinistros",
    text: "Acompanhamento quando você precisar",
    icon: Headphones,
  },
];

export default function StatsBar() {
  return (
    <section
      id="diferenciais"
      className="scroll-mt-24 bg-white px-6 py-8 shadow-sm"
    >
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0B2E6D] text-white">
                <Icon size={24} />
              </div>

              <div>
                <h3 className="font-bold text-[#0B2E6D]">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}