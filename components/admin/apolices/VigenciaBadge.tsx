type Props = {
  fimVigencia: string;
};

export default function VigenciaBadge({
  fimVigencia,
}: Props) {
  const hoje = new Date();

  const vencimento = new Date(fimVigencia);

  const dias = Math.ceil(
    (vencimento.getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (dias < 0) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
        Vencida
      </span>
    );
  }

  if (dias <= 30) {
    return (
      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
        {dias} dias
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
      Vigente
    </span>
  );
}