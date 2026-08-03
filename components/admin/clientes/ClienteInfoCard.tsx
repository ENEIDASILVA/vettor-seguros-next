import {
  CalendarDays,
  HeartHandshake,
  History,
  UserRound,
} from "lucide-react";

type Cliente = {
  data_nascimento: string | null;
  estado_civil: string | null;
  created_at: string;
  updated_at: string;
};

type ClienteInfoCardProps = {
  cliente: Cliente;
};

function valorOuTraco(valor: string | null) {
  return valor?.trim() || "Não informado";
}

function formatarData(valor: string | null) {
  if (!valor) {
    return "Não informado";
  }

  const data = new Date(`${valor}T12:00:00`);

  if (Number.isNaN(data.getTime())) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR").format(data);
}

function formatarDataHora(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

type InfoItemProps = {
  icone: React.ReactNode;
  titulo: string;
  valor: string;
};

function InfoItem({
  icone,
  titulo,
  valor,
}: InfoItemProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A2F5A] shadow-sm">
        {icone}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-500">
          {titulo}
        </p>

        <p className="mt-1 break-words font-medium text-slate-900">
          {valor}
        </p>
      </div>
    </div>
  );
}

export default function ClienteInfoCard({
  cliente,
}: ClienteInfoCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Dados pessoais
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Informações complementares e datas do cadastro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoItem
          icone={<CalendarDays size={20} />}
          titulo="Data de nascimento"
          valor={formatarData(cliente.data_nascimento)}
        />

        <InfoItem
          icone={<HeartHandshake size={20} />}
          titulo="Estado civil"
          valor={valorOuTraco(cliente.estado_civil)}
        />

        <InfoItem
          icone={<UserRound size={20} />}
          titulo="Cliente cadastrado em"
          valor={formatarDataHora(cliente.created_at)}
        />

        <InfoItem
          icone={<History size={20} />}
          titulo="Última atualização"
          valor={formatarDataHora(cliente.updated_at)}
        />
      </div>
    </section>
  );
}