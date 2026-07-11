import { Handshake, Building2, Clock3, Headphones } from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const benefits = [
  {
    title: "Atendimento humanizado",
    text: "Você fala com especialistas que entendem sua necessidade antes de indicar uma solução.",
    icon: Handshake,
  },
  {
    title: "Diversas seguradoras",
    text: "Comparamos opções entre seguradoras para buscar custo-benefício, cobertura e segurança.",
    icon: Building2,
  },
  {
    title: "Cotação rápida",
    text: "Processo ágil, consultivo e com atendimento facilitado pelo WhatsApp.",
    icon: Clock3,
  },
  {
    title: "Suporte em sinistros",
    text: "Acompanhamento para orientar você nos momentos em que mais precisa.",
    icon: Headphones,
  },
];

export default function Benefits() {
  return (
    <section id="sobre" className="bg-white px-6 py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              badge="Diferenciais"
              title="Segurança, clareza e atendimento próximo em cada etapa."
              subtitle="A Vettor Seguros atua como consultoria para ajudar você a escolher a proteção mais adequada, com transparência e acompanhamento."
              center={false}
            />

            <Button
              href="https://wa.me/5531993539953"
              target="_blank"
              variant="whatsapp"
              className="mt-2"
            >
              Falar com especialista
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="bg-[#F5F7FA] p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2E6D] text-white">
                    <Icon size={28} strokeWidth={2.2} />
                  </div>

                  <h3 className="text-xl font-bold text-[#0B2E6D]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-600">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}