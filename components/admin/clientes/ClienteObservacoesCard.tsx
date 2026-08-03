import { MessageSquareText } from "lucide-react";

type Cliente = {
  observacoes: string | null;
};

type Props = {
  cliente: Cliente;
};

export default function ClienteObservacoesCard({
  cliente,
}: Props) {
  const observacoes =
    cliente.observacoes?.trim() ||
    "Nenhuma observação cadastrada.";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-[#0A2F5A]">
          <MessageSquareText size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Observações
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informações adicionais sobre o cliente.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-32">
        <p className="whitespace-pre-wrap text-slate-700">
          {observacoes}
        </p>
      </div>
    </section>
  );
}