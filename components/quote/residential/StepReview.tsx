import StepLayout from "../common/StepLayout";
import SummaryCard from "../common/SummaryCard";
import SummaryField from "../common/SummaryField";
import { useQuote } from "../context/QuoteContext";

interface StepReviewProps {
  onEdit: (step: number) => void;
}

export default function StepReview({
  onEdit,
}: StepReviewProps) {
  const { form } = useQuote();

  const fullAddress = [
    form.address,
    form.addressNumber,
    form.addressComplement,
  ]
    .filter((item) => item.trim() !== "")
    .join(", ");

  return (
    <StepLayout
      title="Revise sua solicitação"
      subtitle="Confira os dados do imóvel antes de enviar."
    >
      <div className="space-y-6">
        <SummaryCard
          title="Dados do segurado"
          onEdit={() => onEdit(2)}
        >
          <SummaryField label="Nome" value={form.name} />
          <SummaryField label="Telefone" value={form.phone} />
          <SummaryField label="E-mail" value={form.email} />
          <SummaryField label="CPF" value={form.cpf} />
        </SummaryCard>

        <SummaryCard
          title="Dados do imóvel"
          onEdit={() => onEdit(3)}
        >
          <SummaryField
            label="CEP"
            value={form.vehicleCep}
          />

          <SummaryField
            label="Endereço"
            value={fullAddress}
          />

          <SummaryField
            label="Bairro"
            value={form.district}
          />

          <SummaryField
            label="Cidade/UF"
            value={
              form.city && form.state
                ? form.city + " - " + form.state
                : ""
            }
          />

          <SummaryField
            label="Tipo do imóvel"
            value={form.vehicleBrand}
          />

          <SummaryField
            label="Situação"
            value={form.vehicleModel}
          />

          <SummaryField
            label="Área construída"
            value={
              form.vehicleYear
                ? form.vehicleYear + " m²"
                : ""
            }
          />

          <SummaryField
            label="Valor aproximado"
            value={form.observations}
          />
        </SummaryCard>

        <SummaryCard
          title="Perfil do imóvel"
          onEdit={() => onEdit(4)}
        >
          <SummaryField
            label="Utilização"
            value={form.driverIsMain}
          />

          <SummaryField
            label="Possui alarme"
            value={form.driverHasSecondary}
          />

          <SummaryField
            label="Monitoramento eletrônico"
            value={form.driverYoung}
          />

          <SummaryField
            label="Condomínio fechado"
            value={form.vehicleGarage}
          />
        </SummaryCard>

        <SummaryCard
          title="Coberturas desejadas"
          onEdit={() => onEdit(5)}
          complete={form.coverages.length > 0}
        >
          {form.coverages.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {form.coverages.map((coverage) => (
                <li
                  key={coverage}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-blue-900"
                >
                  ✓ {coverage}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-700">
              Nenhuma cobertura selecionada.
            </p>
          )}
        </SummaryCard>
      </div>
    </StepLayout>
  );
}