"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CalendarClock, Check, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { baixarPagamentoApolice } from "@/app/admin/actions/apolices";
import type { PagamentoPendenteRelatorio } from "@/lib/repositories/relatoriosRepository";

type Filtro = "todos" | "atrasados" | "hoje" | "proximos" | "futuros";
type Ordenacao = "dataVencimento" | "cliente" | "cpfCliente" | "seguradora" | "numeroParcela" | "valor";
type Direcao = "asc" | "desc";

const hojeIso = () => {
  const agora = new Date();
  return [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
  ].join("-");
};
const moeda = (valor: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
const data = (valor: string) => new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR");
const normalizar = (valor: string) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const formatarCpf = (valor: string) => {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  return numeros.length === 11
    ? numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : valor || "-";
};

function faixa(dataVencimento: string): Exclude<Filtro, "todos"> {
  const hoje = hojeIso();
  if (dataVencimento < hoje) return "atrasados";
  if (dataVencimento === hoje) return "hoje";
  const limite = new Date(`${hoje}T12:00:00`);
  limite.setDate(limite.getDate() + 7);
  return dataVencimento <= limite.toISOString().slice(0, 10) ? "proximos" : "futuros";
}

function BaixarPagamento({ pagamento }: { pagamento: PagamentoPendenteRelatorio }) {
  const [dataPagamento, setDataPagamento] = useState(hojeIso());
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function baixar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await baixarPagamentoApolice(pagamento.apoliceId, pagamento.id, dataPagamento);
      if (!resultado.success) {
        setErro(resultado.message);
        return;
      }
      window.location.reload();
    });
  }

  return (
    <div className="mx-auto w-full max-w-32">
      <div className="flex flex-col gap-2">
        <input aria-label="Data da baixa" type="date" value={dataPagamento} onChange={(event) => setDataPagamento(event.target.value)} className="w-full min-w-0 rounded-lg border border-slate-300 px-1 py-2 text-[11px] [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:w-3 [&::-webkit-calendar-picker-indicator]:p-0" />
        <button type="button" onClick={baixar} disabled={pendente || !dataPagamento} title="Dar baixa no pagamento" className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-700 px-2 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60">
          <Check size={16} /> {pendente ? "Salvando" : "Baixar"}
        </button>
      </div>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}

function CabecalhoOrdenavel({
  titulo,
  campo,
  ordenacao,
  direcao,
  onOrdenar,
  className = "",
}: {
  titulo: string;
  campo: Ordenacao;
  ordenacao: Ordenacao;
  direcao: Direcao;
  onOrdenar: (campo: Ordenacao) => void;
  className?: string;
}) {
  const ativo = campo === ordenacao;

  return (
    <th className={`px-3 py-3 ${className}`}>
      <button
        type="button"
        onClick={() => onOrdenar(campo)}
        title={`Ordenar por ${titulo}`}
        className="inline-flex items-center gap-1.5 rounded-md font-semibold transition hover:text-[#0A2F5A] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A]/20"
      >
        {titulo}
        {!ativo ? <ArrowUpDown size={14} className="text-slate-400" /> : direcao === "asc" ? <ArrowUp size={14} className="text-[#0A2F5A]" /> : <ArrowDown size={14} className="text-[#0A2F5A]" />}
      </button>
    </th>
  );
}

export default function PagamentosPendentesRelatorio({ pagamentos }: { pagamentos: PagamentoPendenteRelatorio[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("dataVencimento");
  const [direcao, setDirecao] = useState<Direcao>("asc");

  function ordenar(campo: Ordenacao) {
    if (campo === ordenacao) {
      setDirecao((atual) => atual === "asc" ? "desc" : "asc");
      return;
    }
    setOrdenacao(campo);
    setDirecao("asc");
  }

  const contadores = useMemo(() => pagamentos.reduce((total, pagamento) => {
    total[faixa(pagamento.dataVencimento)] += 1;
    return total;
  }, { atrasados: 0, hoje: 0, proximos: 0, futuros: 0 }), [pagamentos]);

  const exibidos = useMemo(() => {
    const termo = normalizar(busca.trim());
    const filtrados = pagamentos.filter((pagamento) =>
      (filtro === "todos" || faixa(pagamento.dataVencimento) === filtro) &&
      (!termo || normalizar(`${pagamento.cliente} ${pagamento.cpfCliente} ${pagamento.seguradora}`).includes(termo)),
    );

    return filtrados.sort((a, b) => {
      let resultado: number;
      if (ordenacao === "numeroParcela" || ordenacao === "valor") {
        resultado = a[ordenacao] - b[ordenacao];
      } else {
        resultado = a[ordenacao].localeCompare(b[ordenacao], "pt-BR", { numeric: true, sensitivity: "base" });
      }
      return direcao === "asc" ? resultado : -resultado;
    });
  }, [busca, direcao, filtro, ordenacao, pagamentos]);

  const filtros: Array<{ chave: Filtro; titulo: string; total: number }> = [
    { chave: "todos", titulo: "Todos", total: pagamentos.length },
    { chave: "atrasados", titulo: "Atrasados", total: contadores.atrasados },
    { chave: "hoje", titulo: "Vencem hoje", total: contadores.hoje },
    { chave: "proximos", titulo: "Próximos 7 dias", total: contadores.proximos },
    { chave: "futuros", titulo: "Futuros", total: contadores.futuros },
  ];
  const totalExibido = exibidos.reduce((total, pagamento) => total + pagamento.valor, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-700">Pagamentos aguardando baixa</p>
          <p className="mt-1 text-3xl font-bold text-amber-900">{pagamentos.length}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-700">Valor exibido</p>
          <p className="mt-1 text-3xl font-bold text-[#0A2F5A]">{moeda(totalExibido)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="relative">
          <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Pesquisar cliente, CPF ou seguradora..." className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filtros.map((item) => <button key={item.chave} type="button" onClick={() => setFiltro(item.chave)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${filtro === item.chave ? "bg-[#0A2F5A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}><span>{item.titulo}</span><span className={`rounded-full px-2 py-0.5 text-xs ${filtro === item.chave ? "bg-white/20" : "bg-white"}`}>{item.total}</span></button>)}
        </div>
      </div>

      {exibidos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          <CalendarClock className="mx-auto mb-3 text-slate-400" />
          <p className="font-semibold">Nenhum pagamento pendente encontrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[19%]" />
                <col className="w-[15%]" />
                <col className="w-[16%]" />
                <col className="w-[8%]" />
                <col className="w-[11%]" />
                <col className="w-[15%]" />
                <col className="w-[4%]" />
              </colgroup>
              <thead className="bg-slate-50 text-left text-xs text-slate-700 xl:text-sm"><tr><CabecalhoOrdenavel titulo="Vencimento" campo="dataVencimento" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} /><CabecalhoOrdenavel titulo="Cliente" campo="cliente" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} /><CabecalhoOrdenavel titulo="CPF" campo="cpfCliente" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} /><CabecalhoOrdenavel titulo="Seguradora" campo="seguradora" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} /><CabecalhoOrdenavel titulo="Parcela" campo="numeroParcela" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} /><CabecalhoOrdenavel titulo="Valor" campo="valor" ordenacao={ordenacao} direcao={direcao} onOrdenar={ordenar} className="text-right" /><th className="px-3 py-3">Baixa</th><th className="px-1 py-3 text-center"><span className="sr-only">Acessar</span></th></tr></thead>
              <tbody className="divide-y divide-slate-200">
                {exibidos.map((pagamento) => <tr key={pagamento.id} className="hover:bg-slate-50"><td className="px-3 py-4 text-sm"><span className={faixa(pagamento.dataVencimento) === "atrasados" ? "font-semibold text-red-700" : "text-slate-700"}>{data(pagamento.dataVencimento)}</span></td><td className="px-3 py-4"><Link href={`/admin/clientes/${pagamento.clienteId}`} className="font-medium leading-snug text-slate-800 hover:text-[#0A2F5A]">{pagamento.cliente}</Link></td><td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">{formatarCpf(pagamento.cpfCliente)}</td><td className="px-3 py-4 leading-snug text-slate-700">{pagamento.seguradora}</td><td className="px-3 py-4 text-sm text-slate-700">{pagamento.numeroParcela}/{pagamento.quantidadeParcelas}</td><td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold text-slate-800">{moeda(pagamento.valor)}</td><td className="px-2 py-4"><BaixarPagamento pagamento={pagamento} /></td><td className="px-1 py-4 text-center"><Link href={`/admin/apolices/${pagamento.apoliceId}`} title="Abrir apólice" aria-label="Abrir apólice" className="inline-flex rounded-lg p-1.5 text-[#0A2F5A] hover:bg-blue-50"><ExternalLink size={17} /></Link></td></tr>)}
              </tbody>
            </table>
        </div>
      )}
      <p className="text-right text-xs text-slate-500">{exibidos.length} pagamento(s) exibido(s)</p>
    </div>
  );
}
