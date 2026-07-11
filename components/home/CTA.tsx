import Button from "../ui/Button";
import Container from "../ui/Container";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-[#0B2E6D] to-[#1565C0] px-6 py-24">
      <Container>
        <Card hover={false} className="rounded-[32px] p-12 text-center">
          <SectionTitle
            badge="FAÇA SUA COTAÇÃO"
            title="Vamos encontrar o seguro ideal para você"
            subtitle="Nossa equipe compara diversas seguradoras para apresentar uma solução personalizada, com excelente custo-benefício e atendimento consultivo."
          />

          <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
            <Button
              href="https://wa.me/5531993539953"
              target="_blank"
              variant="whatsapp"
            >
              Solicitar Cotação
            </Button>

            <Button
              href="#seguros"
              variant="outline"
            >
              Conhecer Seguros
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}