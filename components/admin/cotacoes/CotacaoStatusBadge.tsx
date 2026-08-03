import StatusBadge from "@/components/admin/common/StatusBadge";

type Props = {
  status: string;
};

export default function CotacaoStatusBadge({
  status,
}: Props) {
  const variant = getStatusVariant(status);

  return (
    <StatusBadge
      label={status}
      variant={variant}
    />
  );
}

function getStatusVariant(
  status: string
):
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral" {
  switch (status) {
    case "Novo":
      return "info";

    case "Em Cotação":
      return "warning";

    case "Proposta Enviada":
      return "neutral";

    case "Fechado":
      return "success";

    case "Perdido":
      return "danger";

    default:
      return "neutral";
  }
}