import {
  Car,
  Bike,
  Home,
  HeartPulse,
  Building2,
  Stethoscope,
  Tractor,
  Truck,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const services = [
  {
    title: "Seguro Auto",
    icon: Car,
    text: "Proteção completa para seu veículo contra colisão, roubo, furto e terceiros.",
  },
  {
    title: "Seguro Moto",
    icon: Bike,
    text: "Segurança para sua moto com coberturas adaptadas ao seu perfil.",
  },
  {
    title: "Seguro Residencial",
    icon: Home,
    text: "Tranquilidade para sua casa, família e bens patrimoniais.",
  },
  {
    title: "Seguro de Vida",
    icon: HeartPulse,
    text: "Proteção financeira para quem você ama em momentos importantes.",
  },
  {
    title: "Seguro Empresarial",
    icon: Building2,
    text: "Soluções para proteger sua empresa, patrimônio e operação.",
  },
  {
    title: "Seguro Saúde",
    icon: Stethoscope,
    text: "Planos de saúde sob medida para você, sua família ou empresa.",
  },
  {
    title: "Seguro Rural",
    icon: Tractor,
    text: "Proteção para atividades rurais, equipamentos e produção.",
  },
  {
    title: "Seguro Frota",
    icon: Truck,
    text: "Gestão e proteção para veículos empresariais e comerciais.",
  },
];

export default function Services() {
  return (
    <section id="seguros" className="bg-[#F5F7FA] px-6 py-24">
      <Container>
        <SectionTitle
          badge="Nossos Seguros"
          title="Soluções para cada momento da sua vida"
          subtitle="A Vettor Seguros compara opções entre diversas seguradoras para encontrar a melhor proteção para você."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card key={service.title} className="group">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2E6D] text-white transition group-hover:bg-[#1565C0]">
                  <Icon size={28} strokeWidth={2.2} />
                </div>

                <h3 className="text-xl font-bold text-[#0B2E6D]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {service.text}
                </p>

                <Button
                  href="https://wa.me/5531993539953"
                  target="_blank"
                  variant="primary"
                  className="mt-6 w-full"
                >
                  Solicitar Cotação
                </Button>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}