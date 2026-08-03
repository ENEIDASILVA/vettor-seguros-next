import { CheckCircle2, Clock3 } from "lucide-react";

type Props = {
  criadoEm: string;
  atualizadoEm: string;
};

function formatarDataHora(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

type EventoProps = {
  titulo: string;
  descricao: string;
  data: string;
};

function Evento({
  titulo,
  descricao,
  data,
}: EventoProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={20} />
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800">
            {titulo}
          </h3>

          <span className="text-xs text-slate-500">
            {formatarDataHora(data)}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {descricao}
        </p>
      </div>
    </div>
  );
}

export default function ClienteTimeline({
  criadoEm,
  atualizadoEm,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Clock3 className="text-[#0A2F5A]" />

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Histórico
          </h2>

          <p className="text-sm text-slate-500">
            Eventos registrados para este cliente.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Evento
          titulo="Cliente cadastrado"
          descricao="Cadastro realizado no CRM da Vettor Seguros."
          data={criadoEm}
        />

        <Evento
          titulo="Última atualização"
          descricao="Última alteração realizada no cadastro."
          data={atualizadoEm}
        />
      </div>
    </section>
  );
}