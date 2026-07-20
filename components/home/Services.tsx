"use client";

import {
  Car,
  Home,
  HeartPulse,
  Building2,
  Stethoscope,
  Tractor,
  Truck,
} from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const services = [
  {
    title: "Seguro Auto",
    icon: Car,
    text: "Proteção completa para seu veículo contra colisão, roubo, furto e terceiros.",
    onlineQuote: true,
  },
  {
    title: "Seguro Residencial",
    icon: Home,
    text: "Tranquilidade para sua casa, família e bens patrimoniais.",
    onlineQuote: true,
  },
  {
    title: "Seguro de Vida",
    icon: HeartPulse,
    text: "Proteção financeira para quem você ama em momentos importantes.",
    onlineQuote: true,
  },
  {
    title: "Seguro Empresarial",
    icon: Building2,
    text: "Soluções para proteger sua empresa, patrimônio e operação.",
    onlineQuote: false,
  },
  {
    title: "Seguro Saúde",
    icon: Stethoscope,
    text: "Planos de saúde sob medida para você, sua família ou empresa.",
    onlineQuote: false,
  },
  {
    title: "Seguro Rural",
    icon: Tractor,
    text: "Proteção para atividades rurais, equipamentos e produção.",
    onlineQuote: false,
  },
  {
    title: "Seguro Frota",
    icon: Truck,
    text: "Gestão e proteção para veículos empresariais e comerciais.",
    onlineQuote: false,
  },
];

export default function Services() {
  function startOnlineQuote(
    insuranceType: string
  ) {
    window.dispatchEvent(
      new CustomEvent("vettor:start-quote", {
        detail: {
          insuranceType,
        },
      })
    );

    document
      .getElementById("cotacao")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function openWhatsApp(
    insuranceType: string
  ) {
    const phone = "5531993539953";

    const message =
      "Olá! Gostaria de solicitar uma cotação de " +
      insuranceType +
      ".";

    const link =
      "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent(message);

    window.open(
      link,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const onlineServices =
    services.filter(
      (service) => service.onlineQuote
    );

  const otherServices =
    services.filter(
      (service) => !service.onlineQuote
    );

  return (
    <section
      id="seguros"
      className="scroll-mt-24 bg-[#F5F7FA] px-6 py-20"
    >
      <Container>
        <SectionTitle
          badge="Nossos Seguros"
          title="Escolha a proteção que você precisa"
          subtitle="Faça sua cotação online para Auto, Residencial e Vida, ou fale diretamente com a Vettor Seguros para outros produtos."
        />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {onlineServices.map((service) => {
            const Icon = service.icon;

            return (
              <Card
                key={service.title}
                className="group flex flex-col border-2 border-blue-100 bg-white"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2E6D] text-white transition group-hover:bg-[#1565C0]">
                    <Icon
                      size={28}
                      strokeWidth={2.2}
                    />
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Cotação online
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B2E6D]">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {service.text}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    startOnlineQuote(
                      service.title
                    )
                  }
                  className="mt-6 w-full rounded-xl bg-[#0B2E6D] px-5 py-3 font-semibold text-white transition hover:bg-[#1565C0]"
                >
                  Cotar Online
                </button>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-[#0B2E6D]">
              Outros seguros
            </h3>

            <p className="mt-2 text-gray-600">
              Para outros tipos de seguro, fale com nossa equipe pelo WhatsApp.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  className="group flex flex-col"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2E6D] text-white transition group-hover:bg-[#1565C0]">
                    <Icon
                      size={24}
                      strokeWidth={2.2}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#0B2E6D]">
                    {service.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {service.text}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        service.title
                      )
                    }
                    className="mt-6 w-full rounded-xl border-2 border-[#0B2E6D] px-5 py-3 font-semibold text-[#0B2E6D] transition hover:bg-[#0B2E6D] hover:text-white"
                  >
                    Solicitar Cotação
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}