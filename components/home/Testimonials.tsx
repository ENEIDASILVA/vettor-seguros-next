import { Star } from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const testimonials = [
  {
    name: "Cliente Vettor",
    text: "Atendimento muito claro, rápido e seguro. Recebi orientação para escolher a melhor cobertura para minha família.",
  },
  {
    name: "Cliente Vettor",
    text: "Consegui fazer minha cotação pelo WhatsApp com muita praticidade. Atendimento excelente.",
  },
  {
    name: "Cliente Vettor",
    text: "Gostei da atenção durante todo o processo. A equipe explicou todas as coberturas antes da contratação.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-6 py-24">
      <Container>
        <SectionTitle
          badge="Depoimentos"
          title="A confiança dos nossos clientes"
          subtitle="Nosso compromisso é oferecer atendimento consultivo, transparência e segurança em cada etapa da contratação."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.text}>
              <div className="mb-5 flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="text-gray-600">
                "{item.text}"
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-[#0B2E6D]">
                  {item.name}
                </h3>

                <span className="text-sm text-gray-500">
                  Cliente Vettor Seguros
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}