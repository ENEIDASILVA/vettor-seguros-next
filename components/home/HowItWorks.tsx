import {
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const steps = [
  {
    title: "Escolha seu seguro",
    text: "Selecione a proteção que você procura e inicie sua cotação.",
    icon: FileText,
  },
  {
    title: "Preencha seus dados",
    text: "Informe os dados necessários para analisarmos seu perfil.",
    icon: Search,
  },
  {
    title: "Receba sua cotação",
    text: "A Vettor busca as opções adequadas e orienta você na escolha da proteção.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 bg-[#0B2E6D] px-6 py-20 text-white"
    >
      <Container>
        <SectionTitle
          badge="Como funciona"
          title="Cotar seu seguro é simples"
          subtitle="Um processo rápido e consultivo para ajudar você a encontrar a proteção adequada."
          theme="dark"
        />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.title}
                className="border-white/10 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0B2E6D]">
                  <Icon size={28} />
                </div>

                <span className="text-sm font-bold text-blue-200">
                  PASSO {index + 1}
                </span>

                <h3 className="mt-3 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-blue-100">
                  {step.text}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}