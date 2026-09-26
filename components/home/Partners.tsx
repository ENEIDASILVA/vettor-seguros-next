import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

const partners = [
  "Aliro",
  "Allianz",
  "Azul",
  "Bradesco Seguros",
  "HDI",
  "Mapfre",
  "Porto Seguro",
  "Suhai",
  "SulAmérica Seguros",
  "Tokio Marine",
  "Yelum"  
];

export default function Partners() {
  return (
    <section
      id="seguradoras"
      className="scroll-mt-24 bg-[#F5F7FA] px-6 py-16"
    >
      <Container>
        <SectionTitle
          badge="Seguradoras"
          title="Trabalhamos com as maiores seguradoras do mercado"
          subtitle="A Vettor Seguros busca alternativas para encontrar a proteção mais adequada ao seu perfil e às suas necessidades."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <Card
              key={partner}
              className="flex h-24 items-center justify-center text-center"
            >
              <span className="text-lg font-bold text-[#0B2E6D]">
                {partner}
              </span>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}