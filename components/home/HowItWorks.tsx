import { FileText, Search, ShieldCheck, MessageCircle } from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const steps = [
  {
    title: "Solicite sua cotação",
    text: "Informe seus dados pelo formulário ou WhatsApp.",
    icon: FileText,
  },
  {
    title: "Analisamos seu perfil",
    text: "Buscamos opções entre seguradoras parceiras.",
    icon: Search,
  },
  {
    title: "Você escolhe a melhor proteção",
    text: "Apresentamos coberturas conforme sua necessidade.",
    icon: ShieldCheck,
  },
  {
    title: "Contratação com suporte",
    text: "Acompanhamos você antes, durante e depois da contratação.",
    icon: MessageCircle,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0B2E6D] px-6 py-24 text-white">
      <Container>
        <SectionTitle
          badge="Como funciona"
          title="Cotar seu seguro é simples"
          subtitle="Um processo rápido, consultivo e pensado para facilitar sua decisão."
          theme="dark"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.title}
                className="bg-white/10 text-white backdrop-blur-sm border-white/10 hover:bg-white/15"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0B2E6D]">
                  <Icon size={28} />
                </div>

                <span className="text-sm font-bold text-blue-200">
                  PASSO {index + 1}
                </span>

                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-blue-100">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}