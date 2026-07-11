import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

const partners = [
  "Porto",
  "Tokio Marine",
  "HDI",
  "Mapfre",
  "Allianz",
  "Bradesco Seguros",
  "Liberty",
  "Suhai",
];

export default function Partners() {
  return (
    <section className="bg-[#F5F7FA] px-6 py-24">
      <Container>
        <SectionTitle
          badge="Seguradoras"
          title="As melhores opções para proteger você"
          subtitle="A Vettor Seguros trabalha para oferecer soluções entre as principais seguradoras do mercado, buscando sempre a proteção mais adequada ao seu perfil."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <Card
              key={partner}
              className="flex h-28 items-center justify-center text-center"
            >
              <span className="text-xl font-bold text-[#0B2E6D]">
                {partner}
              </span>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Em breve, esta seção exibirá os logotipos oficiais das seguradoras parceiras da Vettor Seguros.
        </p>
      </Container>
    </section>
  );
}