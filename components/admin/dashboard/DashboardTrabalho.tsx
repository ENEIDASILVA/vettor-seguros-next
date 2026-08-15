import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  Hourglass,
  RefreshCw,
} from "lucide-react";

import type {
  DashboardRenovacao,
  DashboardTrabalhoItem,
} from "@/lib/repositories/dashboardRepository";

type Props = {
  emProcessoCotacao: DashboardTrabalhoItem[];
  propostasEmTratamento: DashboardTrabalhoItem[];
  apoliceAEmitir: DashboardTrabalhoItem[];
  renovacoes: DashboardRenovacao[];
};

function formatarData(data: string | null) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

function ListaTrabalho({
  id,
  titulo,
  descricao,
  itens,
  vazio,
  icon: Icon,
}: {
  id: string;
  titulo: string;
  descricao: string;
  itens: DashboardTrabalhoItem[];
  vazio: string;
  icon: typeof ClipboardList;
}) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0A2F5A]">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">{titulo}</h2>
          <p className="text-sm text-slate-500">{descricao}</p>
        </div>
        <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
          {itens.length}
        </span>
      </div>

      {itens.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-500">{vazio}</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {itens.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.tipoSeguro} · {item.detalhe}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-700">{item.status}</p>
                <p className="mt-1 text-xs text-slate-400">{formatarData(item.data)}</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-slate-400" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Renovacoes({ itens }: { itens: DashboardRenovacao[] }) {
  return (
    <section id="vencendo-30-dias" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <RefreshCw size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Seguros vencendo em 30 dias</h2>
          <p className="text-sm text-slate-500">Renovações que precisam ser iniciadas</p>
        </div>
        <span className="ml-auto rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
          {itens.length}
        </span>
      </div>

      {itens.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-500">
          Nenhum seguro vence nos próximos 30 dias.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {itens.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
            >
              <CalendarDays size={19} className="shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">{item.cliente}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.tipoSeguro} · {item.seguradora}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">
                  {formatarData(item.vencimento)}
                </p>
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {item.diasRestantes === 0
                    ? "Vence hoje"
                    : `${item.diasRestantes} dias`}
                </p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-slate-400" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardTrabalho({
  emProcessoCotacao,
  propostasEmTratamento,
  apoliceAEmitir,
  renovacoes,
}: Props) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Trabalho a realizar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Prioridades operacionais da corretora.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ListaTrabalho
          id="em-processo-cotacao"
          titulo="Em processo de cotação"
          descricao="Cotações que ainda precisam ser trabalhadas"
          itens={emProcessoCotacao}
          vazio="Nenhuma cotação em processo."
          icon={ClipboardList}
        />

        <ListaTrabalho
          id="propostas-em-tratamento"
          titulo="Propostas em tratamento"
          descricao="Propostas que ainda não foram convertidas em apólice"
          itens={propostasEmTratamento}
          vazio="Nenhuma proposta em tratamento."
          icon={Hourglass}
        />

        <ListaTrabalho
          id="apolice-a-emitir"
          titulo="Apólice a emitir"
          descricao="Negócios aceitos que precisam ser emitidos"
          itens={apoliceAEmitir}
          vazio="Nenhuma apólice pendente de emissão."
          icon={FileCheck2}
        />

        <Renovacoes itens={renovacoes} />
      </div>
    </div>
  );
}
