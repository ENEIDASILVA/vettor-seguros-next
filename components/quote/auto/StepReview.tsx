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

  const cityAndState =
    form.city && form.state
      ? form.city + " - " + form.state
      : form.city || form.state;

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
          <SummaryField
            label="Nome"
            value={form.name}
          />

          <SummaryField
            label="Telefone"
            value={form.phone}
          />

          {form.email.trim() !== "" && (
            <SummaryField
              label="E-mail"
              value={form.email}
            />
          )}

          <SummaryField
            label="CPF"
            value={form.cpf}
          />
        </SummaryCard>

        <SummaryCard
          title="Veículo"
          onEdit={() => onEdit(3)}
        >
          <SummaryField
            label="Marca"
            value={form.vehicleBrand}
          />

          <SummaryField
            label="Modelo"
            value={form.vehicleModel}
          />

          <SummaryField
            label="Ano / Versão"
            value={form.vehicleYear}
          />

          {form.vehicleFuel.trim() !== "" && (
            <SummaryField
              label="Combustível"
              value={form.vehicleFuel}
            />
          )}

          {form.vehicleFipeCode.trim() !== "" && (
            <SummaryField
              label="Código FIPE"
              value={form.vehicleFipeCode}
            />
          )}

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
          title="Endereço de pernoite"
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
            value={cityAndState}
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
            label="Data de nascimento"
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
            label="É o principal condutor"
            value={form.driverIsMain}
          />

          <SummaryField
            label="Outro condutor frequente"
            value={form.driverHasSecondary}
          />

          <SummaryField
            label="Condutor entre 18 e 25 anos"
            value={form.driverYoung}
          />
        </SummaryCard>

        <SummaryCard
          title="Histórico do seguro"
          onEdit={() => onEdit(5)}
        >
          <SummaryField
            label="Possui seguro atualmente"
            value={form.currentInsurance}
          />

          {form.currentInsurance === "Sim" && (
            <>
              <SummaryField
                label="Seguradora atual"
                value={form.currentInsurer}
              />

              <SummaryField
                label="Classe de bônus"
                value={form.bonusClass}
              />

              <SummaryField
                label="Sinistro na vigência atual"
                value={form.hadClaims}
              />

              {form.hadClaims === "Sim" && (
                <SummaryField
                  label="Quantidade de sinistros"
                  value={form.claimsCount}
                />
              )}
            </>
          )}
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