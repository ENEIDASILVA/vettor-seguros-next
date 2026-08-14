"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";

import { useMemo, useState } from "react";

import { type Cliente } from "@/lib/repositories/clientesRepository";

import ClienteActions from "./ClienteActions";
import ClienteStatusBadge from "./ClienteStatusBadge";
import ClienteToolbar from "./ClienteToolbar";

type FiltroStatus = "todos" | "ativos" | "inativos";

type SortKey =
  | "nome"
  | "cpf"
  | "telefone"
  | "produtos"
  | "status";

type SortDirection =
  | "asc"
  | "desc";

interface ClienteTableProps {
  clientes: Cliente[];
}

function normalizarTexto(
  valor: string | null | undefined
) {
  return (
    valor
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim() ?? ""
  );
}

function compararTexto(
  a: string | null | undefined,
  b: string | null | undefined
) {
  return String(a ?? "").localeCompare(
    String(b ?? ""),
    "pt-BR",
    {
      sensitivity: "base",
      numeric: true,
    }
  );
}

function valorOrdenacao(
  cliente: Cliente,
  chave: SortKey
) {
  switch (chave) {
    case "nome":
      return cliente.nome ?? "";

    case "cpf":
      return cliente.cpf?.replace(/\D/g, "") ?? "";

    case "telefone":
      return cliente.telefone?.replace(/\D/g, "") ?? "";

    case "produtos":
      return cliente.produtosVigentes.join(" ");

    case "status":
      return cliente.ativo ? "Ativo" : "Inativo";
  }
}

function CabecalhoOrdenavel({
  titulo,
  chave,
  chaveAtual,
  direcao,
  onOrdenar,
  className = "",
}: {
  titulo: string;
  chave: SortKey;
  chaveAtual: SortKey | null;
  direcao: SortDirection;
  onOrdenar: (chave: SortKey) => void;
  className?: string;
}) {
  const ativo =
    chaveAtual === chave;

  return (
    <th
      className={`whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700 ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          onOrdenar(chave)
        }
        className={`inline-flex items-center gap-1.5 rounded-md transition hover:text-[#0A2F5A] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A]/20 ${
          className.includes("text-center")
            ? "justify-center"
            : ""
        }`}
        title={`Ordenar por ${titulo}`}
      >
        <span>
          {titulo}
        </span>

        {!ativo ? (
          <ArrowUpDown
            size={14}
            className="text-slate-400"
          />
        ) : direcao ===
          "asc" ? (
          <ArrowUp
            size={14}
            className="text-[#0A2F5A]"
          />
        ) : (
          <ArrowDown
            size={14}
            className="text-[#0A2F5A]"
          />
        )}
      </button>
    </th>
  );
}

export default function ClienteTable({
  clientes,
}: ClienteTableProps) {
  const [pesquisa, setPesquisa] =
    useState("");

  const [filtro, setFiltro] =
    useState<FiltroStatus>("todos");

  const [sortKey, setSortKey] =
    useState<SortKey | null>(null);

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>("asc");

  function ordenar(
    chave: SortKey
  ) {
    if (
      sortKey === chave
    ) {
      setSortDirection(
        (atual) =>
          atual === "asc"
            ? "desc"
            : "asc"
      );

      return;
    }

    setSortKey(chave);

    setSortDirection("asc");
  }

  const clientesFiltrados = useMemo(() => {
    const termo =
      normalizarTexto(
        pesquisa
      );

    const termoNumerico =
      pesquisa.replace(/\D/g, "");

    const filtrados =
      clientes.filter((cliente) => {
        const nome =
          normalizarTexto(
            cliente.nome
          );

        const email =
          normalizarTexto(
            cliente.email
          );

        const cpf =
          cliente.cpf?.replace(/\D/g, "") ??
          "";

        const telefone =
          cliente.telefone?.replace(
            /\D/g,
            ""
          ) ?? "";

        const correspondePesquisa =
          termo === "" ||
          nome.includes(termo) ||
          email.includes(termo) ||
          (
            termoNumerico !== "" &&
            (
              cpf.includes(
                termoNumerico
              ) ||
              telefone.includes(
                termoNumerico
              )
            )
          );

        const correspondeStatus =
          filtro === "todos" ||
          (
            filtro === "ativos" &&
            cliente.ativo
          ) ||
          (
            filtro === "inativos" &&
            !cliente.ativo
          );

        return (
          correspondePesquisa &&
          correspondeStatus
        );
      });

    if (
      !sortKey
    ) {
      return filtrados;
    }

    return [
      ...filtrados,
    ].sort(
      (a, b) => {
        const valorA =
          valorOrdenacao(
            a,
            sortKey
          );

        const valorB =
          valorOrdenacao(
            b,
            sortKey
          );

        let resultado = 0;

        if (
          typeof valorA ===
            "number" &&
          typeof valorB ===
            "number"
        ) {
          resultado =
            valorA - valorB;
        } else {
          resultado =
            compararTexto(
              String(
                valorA ?? ""
              ),
              String(
                valorB ?? ""
              )
            );
        }

        return (
          sortDirection ===
            "asc"
            ? resultado
            : -resultado
        );
      }
    );
  }, [
    clientes,
    pesquisa,
    filtro,
    sortKey,
    sortDirection,
  ]);

  const totalClientes =
    clientes.length;

  const totalAtivos =
    clientes.filter(
      (cliente) =>
        cliente.ativo
    ).length;

  const totalInativos =
    totalClientes -
    totalAtivos;

  return (
    <div className="space-y-4">
      <ClienteToolbar
        pesquisa={pesquisa}
        onPesquisaChange={
          setPesquisa
        }
        filtro={filtro}
        onFiltroChange={
          setFiltro
        }
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
        {clientesFiltrados.length ===
        0 ? (
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
                  <CabecalhoOrdenavel
                    titulo="Cliente"
                    chave="nome"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-left"
                  />

                  <CabecalhoOrdenavel
                    titulo="CPF"
                    chave="cpf"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-left"
                  />

                  <CabecalhoOrdenavel
                    titulo="Telefone"
                    chave="telefone"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-left"
                  />

                  <CabecalhoOrdenavel
                    titulo="Produtos vigentes"
                    chave="produtos"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-left"
                  />

                  <CabecalhoOrdenavel
                    titulo="Status"
                    chave="status"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-center"
                  />

                  <th className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {clientesFiltrados.map(
                  (
                    cliente
                  ) => (
                    <tr
                      key={
                        cliente.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {
                            cliente.nome
                          }
                        </div>

                        {cliente.email && (
                          <div className="mt-1 text-sm text-slate-500">
                            {
                              cliente.email
                            }
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {cliente.cpf ||
                          "Não informado"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {cliente.telefone ||
                          "Não informado"}
                      </td>

                      <td className="px-6 py-4">
                        {cliente.produtosVigentes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {cliente.produtosVigentes.map(
                              (produto) => (
                                <span
                                  key={produto}
                                  className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0A2F5A]"
                                >
                                  {produto}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <ClienteStatusBadge
                          ativo={
                            cliente.ativo
                          }
                        />
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <ClienteActions
                          cliente={
                            cliente
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
