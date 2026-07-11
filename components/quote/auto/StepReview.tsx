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
      subtitle="Confira as informações antes de enviar sua cotação."
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
          title="Veículo e endereço de pernoite"
          onEdit={() => onEdit(3)}
        >
          <SummaryField
            label="Veículo"
            value={
              form.vehicleBrand +
              " " +
              form.vehicleModel
            }
          />

          <SummaryField
            label="Ano"
            value={form.vehicleYear}
          />

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
            label="Garagem"
            value={form.vehicleGarage}
          />

          <SummaryField
            label="Uso por aplicativo"
            value={form.vehicleApp}
          />

          <SummaryField
            label="Rastreador"
            value={form.vehicleTracker}
          />
        </SummaryCard>

        <SummaryCard
          title="Condutor principal"
          onEdit={() => onEdit(4)}
        >
          <SummaryField
            label="Nome"
            value={form.driverName}
          />

          <SummaryField
            label="Nascimento"
            value={form.driverBirthDate}
          />

          <SummaryField
            label="Estado civil"
            value={form.driverMaritalStatus}
          />

          <SummaryField
            label="Profissão"
            value={form.driverProfession}
          />

          <SummaryField
            label="Outro condutor frequente"
            value={form.driverHasSecondary}
          />

          <SummaryField
            label="Condutor de 18 a 25 anos"
            value={form.driverYoung}
          />
        </SummaryCard>

        <SummaryCard
          title="Histórico do seguro"
          onEdit={() => onEdit(5)}
        >
          <SummaryField
            label="Possui seguro atual"
            value={form.currentInsurance}
          />

          <SummaryField
            label="Seguradora"
            value={form.currentInsurer}
          />

          <SummaryField
            label="Classe de bônus"
            value={form.bonusClass}
          />

          <SummaryField
            label="Sinistros"
            value={form.hadClaims}
          />

          {form.hadClaims === "Sim" && (
            <SummaryField
              label="Quantidade"
              value={form.claimsCount}
            />
          )}

          <SummaryField
            label="Recusa anterior"
            value={form.insuranceRefused}
          />
        </SummaryCard>

        <SummaryCard
          title="Coberturas desejadas"
          onEdit={() => onEdit(6)}
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