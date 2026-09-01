"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { useState, useTransition } from "react";

import { atualizarPagamentoApolice, baixarPagamentoApolice } from "@/app/admin/actions/apolices";
import type { ApolicePagamento } from "@/lib/repositories/apolicesRepository";

type Props = {
  apoliceId: string;
  pagamentos: ApolicePagamento[];
};

const hoje = () => {
  const agora = new Date();
  return [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatarData = (valor: string | null) =>
  valor ? new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR") : "-";

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

function LinhaPagamento({ apoliceId, pagamento }: { apoliceId: string; pagamento: ApolicePagamento }) {
  const [dataPagamento, setDataPagamento] = useState(pagamento.dataPagamento ?? hoje());
  const [dataPrevista, setDataPrevista] = useState(pagamento.dataVencimento);
  const [valor, setValor] = useState(pagamento.valor.toFixed(2));
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function baixar() {
    setMensagem(null);
    iniciarTransicao(async () => {
      const resultado = await baixarPagamentoApolice(apoliceId, pagamento.id, dataPagamento);
      setMensagem(resultado.message);
      if (resultado.success) window.location.reload();
    });
  }

  function salvarParcela() {
    setMensagem(null);
    iniciarTransicao(async () => {
      const resultado = await atualizarPagamentoApolice(
        apoliceId,
        pagamento.id,
        dataPrevista,
        Number(valor),
      );
      setMensagem(resultado.message);
      if (resultado.success) window.location.reload();
    });
  }

  return (
    <div className="grid gap-4 border-t border-slate-200 px-5 py-4 first:border-t-0 lg:grid-cols-[0.65fr_1fr_1fr_1fr_1.5fr] lg:items-center">
      <div>
        <span className="text-xs font-medium uppercase text-slate-500">Parcela</span>
        <p className="font-bold text-slate-800">{pagamento.numeroParcela}/{pagamento.quantidadeParcelas}</p>
      </div>
      <div>
        <label className="text-xs font-medium uppercase text-slate-500">
          Data prevista
          <input type="date" value={dataPrevista} onChange={(event) => setDataPrevista(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700" />
        </label>
      </div>
      <div>
        <label className="text-xs font-medium uppercase text-slate-500">
          Valor
          <input type="number" min="0" step="0.01" value={valor} onChange={(event) => setValor(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700" />
        </label>
        <p className="mt-1 text-xs text-slate-500">{formatarMoeda(Number(valor) || 0)}</p>
      </div>
      <div>
        <span className="text-xs font-medium uppercase text-slate-500">Situação</span>
        <p className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${pagamento.status === "Pago" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {pagamento.status === "Pago" ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
          {pagamento.status}
        </p>
      </div>
      <div>
        <button type="button" onClick={salvarParcela} disabled={pendente || !dataPrevista || valor === ""} className="mb-2 w-full rounded-lg border border-[#0A2F5A] bg-white px-4 py-2 text-sm font-semibold text-[#0A2F5A] transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60">
          {pendente ? "Salvando..." : "Salvar data e valor"}
        </button>
        {pagamento.status === "Pago" ? (
          <div>
            <span className="text-xs font-medium uppercase text-slate-500">Data da baixa</span>
            <p className="font-semibold text-green-700">{formatarData(pagamento.dataPagamento)}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex-1 text-xs font-medium uppercase text-slate-500">
              Data da baixa
              <input type="date" value={dataPagamento} onChange={(event) => setDataPagamento(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700" />
            </label>
            <button type="button" onClick={baixar} disabled={pendente || !dataPagamento} className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60">
              {pendente ? "Salvando..." : "Dar baixa"}
            </button>
          </div>
        )}
        {mensagem && <p className="mt-2 text-xs text-slate-600">{mensagem}</p>}
      </div>
    </div>
  );
}

export default function ApolicePagamentos({ apoliceId, pagamentos }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-lg font-bold text-slate-800">Conferência dos pagamentos</h3>
        <p className="mt-1 text-sm text-slate-500">Informe a data da baixa conforme cada pagamento for confirmado pelo corretor.</p>
      </div>
      {pagamentos.length > 0 ? (
        pagamentos.map((pagamento) => <LinhaPagamento key={pagamento.id} apoliceId={apoliceId} pagamento={pagamento} />)
      ) : (
        <p className="p-6 text-sm text-slate-500">Nenhum pagamento foi gerado para esta apólice.</p>
      )}
    </section>
  );
}
