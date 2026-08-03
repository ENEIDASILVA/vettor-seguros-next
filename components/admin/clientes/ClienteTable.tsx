"use client";

import { useMemo, useState } from "react";

import { type Cliente } from "@/lib/repositories/clientesRepository";

import ClienteActions from "./ClienteActions";
import ClienteStatusBadge from "./ClienteStatusBadge";
import ClienteToolbar from "./ClienteToolbar";

type FiltroStatus = "todos" | "ativos" | "inativos";

interface ClienteTableProps {
  clientes: Cliente[];
}

function normalizarTexto(valor: string | null | undefined) {
  return valor?.toLowerCase().trim() ?? "";
}

export default function ClienteTable({
  clientes,
}: ClienteTableProps) {
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] =
    useState<FiltroStatus>("todos");

  const clientesFiltrados = useMemo(() => {
    const termo = normalizarTexto(pesquisa);
    const termoNumerico = pesquisa.replace(/\D/g, "");

    return clientes.filter((cliente) => {
      const nome = normalizarTexto(cliente.nome);
      const email = normalizarTexto(cliente.email);

      const cpf = cliente.cpf?.replace(/\D/g, "") ?? "";
      const telefone =
        cliente.telefone?.replace(/\D/g, "") ?? "";

      const correspondePesquisa =
        termo === "" ||
        nome.includes(termo) ||
        email.includes(termo) ||
        cpf.includes(termoNumerico) ||
        telefone.includes(termoNumerico);

      const correspondeStatus =
        filtro === "todos" ||
        (filtro === "ativos" && cliente.ativo) ||
        (filtro === "inativos" && !cliente.ativo);

      return correspondePesquisa && correspondeStatus;
    });
  }, [clientes, pesquisa, filtro]);

  const totalClientes = clientes.length;

  const totalAtivos = clientes.filter(
    (cliente) => cliente.ativo
  ).length;

  const totalInativos = totalClientes - totalAtivos;

  return (
    <div className="space-y-4">
      <ClienteToolbar
        pesquisa={pesquisa}
        onPesquisaChange={setPesquisa}
        filtro={filtro}
        onFiltroChange={setFiltro}
      />

      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="font-semibold text-slate-800">
              Total:
            </span>{" "}
            <span className="text-slate-600">
              {totalClientes}
            </span>
          </div>

          <div>
            <span className="font-semibold text-emerald-700">
              Ativos:
            </span>{" "}
            <span className="text-emerald-700">
              {totalAtivos}
            </span>
          </div>

          <div>
            <span className="font-semibold text-slate-600">
              Inativos:
            </span>{" "}
            <span className="text-slate-600">
              {totalInativos}
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {clientesFiltrados.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              Nenhum cliente encontrado
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Tente alterar a pesquisa ou o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Cliente
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    CPF
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Telefone
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Cliente desde
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {cliente.nome}
                      </div>

                      {cliente.email && (
                        <div className="mt-1 text-sm text-slate-500">
                          {cliente.email}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {cliente.cpf || "Não informado"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {cliente.telefone || "Não informado"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {new Date(
                        cliente.created_at
                      ).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <ClienteStatusBadge
                        ativo={cliente.ativo}
                      />
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <ClienteActions cliente={cliente} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}