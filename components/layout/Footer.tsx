"use client";

import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";

const onlineQuoteServices = [
  {
    label: "Seguro Auto",
    insuranceType: "Seguro Auto",
  },
  {
    label: "Seguro Residencial",
    insuranceType: "Seguro Residencial",
  },
  {
    label: "Seguro de Vida",
    insuranceType: "Seguro de Vida",
  },
];

const whatsappServices = [
  "Seguro Empresarial",
  "Seguro Saúde",
  "Seguro Rural",
  "Seguro Frota",
];

export default function Footer() {
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

  return (
    <footer
      id="contato"
      className="bg-[#061B3A] text-white"
    >
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div>
            <a
              href="#inicio"
              className="inline-block"
            >
              <h2 className="text-3xl font-bold">
                VETTOR
              </h2>

              <p className="mb-6 text-blue-300">
                SEGUROS
              </p>
            </a>

            <p className="leading-relaxed text-gray-300">
              Proteção inteligente para você,
              sua família e seu patrimônio.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Seguros
            </h3>

            <ul className="space-y-3 text-gray-300">
              {onlineQuoteServices.map(
                (service) => (
                  <li key={service.label}>
                    <button
                      type="button"
                      onClick={() =>
                        startOnlineQuote(
                          service.insuranceType
                        )
                      }
                      className="transition hover:text-white"
                    >
                      {service.label}
                    </button>
                  </li>
                )
              )}

              {whatsappServices.map(
                (service) => (
                  <li key={service}>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(service)
                      }
                      className="transition hover:text-white"
                    >
                      {service}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Contato
            </h3>

            <div className="space-y-4">
              <a
                href="tel:+5531993539953"
                className="flex items-center gap-3 text-gray-300 transition hover:text-white"
              >
                <Phone size={18} />

                <span>
                  (31) 99353-9953
                </span>
              </a>

              <a
                href="mailto:contato@vettorseguros.com.br"
                className="flex items-center gap-3 text-gray-300 transition hover:text-white"
              >
                <Mail size={18} />

                <span>
                  contato@vettorseguros.com.br
                </span>
              </a>

              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} />

                <span>
                  Minas Gerais - Brasil
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={32} />

              <h3 className="text-xl font-bold">
                Atendimento
              </h3>
            </div>

            <p className="mt-4 text-gray-300">
              Segunda a Sexta-feira
              <br />
              08:00 às 18:00
            </p>

            <Button
              href="https://wa.me/5531993539953?text=Ol%C3%A1%21%20Gostaria%20de%20falar%20com%20a%20Vettor%20Seguros."
              target="_blank"
              variant="whatsapp"
              className="mt-8"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} VETTOR SEGUROS • Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}