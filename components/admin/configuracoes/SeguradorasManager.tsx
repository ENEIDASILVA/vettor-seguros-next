"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Plus,
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Seguradora,
} from "@/lib/repositories/seguradorasRepository";

import SeguradoraActions from "./SeguradoraActions";
import SeguradoraForm from "./SeguradoraForm";

type Props = {
  seguradoras: Seguradora[];
};

type Filtro =
  | "todas"
  | "ativas"
  | "inativas";

type SortKey =
  | "nome"
  | "codigo"
  | "status";

type SortDirection =
  | "asc"
  | "desc";

function normalizar(
  valor:
    | string
    | null
    | undefined,
) {
  return String(
    valor ?? "",
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function Cabecalho({
  titulo,
  chave,
  sortKey,
  direcao,
  onOrdenar,
  className = "",
}: {
  titulo: string;
  chave: SortKey;
  sortKey:
    SortKey | null;
  direcao:
    SortDirection;
  onOrdenar:
    (chave: SortKey) => void;
  className?: string;
}) {
  const ativo =
    sortKey === chave;

  return (
    <th
      className={`px-4 py-4 text-left text-sm font-semibold text-slate-700 ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          onOrdenar(
            chave,
          )
        }
        className="inline-flex items-center gap-1.5 transition hover:text-[#0A2F5A]"
      >
        {titulo}

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

export default function SeguradorasManager({
  seguradoras,
}: Props) {
  const router =
    useRouter();

  const [
    busca,
    setBusca,
  ] = useState("");

  const [
    filtro,
    setFiltro,
  ] =
    useState<Filtro>(
      "todas",
    );

  const [
    sortKey,
    setSortKey,
  ] =
    useState<
      SortKey | null
    >("nome");

  const [
    direcao,
    setDirecao,
  ] =
    useState<SortDirection>(
      "asc",
    );

  const [
    formularioAberto,
    setFormularioAberto,
  ] = useState(false);

  const [
    seguradoraEditando,
    setSeguradoraEditando,
  ] =
    useState<
      Seguradora | null
    >(null);

  const contadores =
    useMemo(
      () => ({
        todas:
          seguradoras.length,
        ativas:
          seguradoras.filter(
            (item) =>
              item.ativo,
          ).length,
        inativas:
          seguradoras.filter(
            (item) =>
              !item.ativo,
          ).length,
      }),
      [seguradoras],
    );

  const exibidas =
    useMemo(() => {
      const termo =
        normalizar(
          busca,
        );

      const filtradas =
        seguradoras.filter(
          (item) => {
            const correspondeBusca =
              !termo ||
              normalizar(
                item.nome,
              ).includes(
                termo,
              ) ||
              normalizar(
                item.codigo,
              ).includes(
                termo,
              );

            const correspondeFiltro =
              filtro ===
                "todas" ||
              (
                filtro ===
                  "ativas" &&
                item.ativo
              ) ||
              (
                filtro ===
                  "inativas" &&
                !item.ativo
              );

            return (
              correspondeBusca &&
              correspondeFiltro
            );
          },
        );

      if (!sortKey) {
        return filtradas;
      }

      return [
        ...filtradas,
      ].sort(
        (a, b) => {
          let valorA = "";
          let valorB = "";

          if (
            sortKey ===
            "nome"
          ) {
            valorA =
              a.nome;
            valorB =
              b.nome;
          }

          if (
            sortKey ===
            "codigo"
          ) {
            valorA =
              a.codigo ?? "";
            valorB =
              b.codigo ?? "";
          }

          if (
            sortKey ===
            "status"
          ) {
            valorA =
              a.ativo
                ? "Ativa"
                : "Inativa";
            valorB =
              b.ativo
                ? "Ativa"
                : "Inativa";
          }

          const resultado =
            valorA.localeCompare(
              valorB,
              "pt-BR",
              {
                sensitivity:
                  "base",
                numeric:
                  true,
              },
            );

          return direcao ===
            "asc"
            ? resultado
            : -resultado;
        },
      );
    }, [
      busca,
      direcao,
      filtro,
      seguradoras,
      sortKey,
    ]);

  function ordenar(
    chave: SortKey,
  ) {
    if (
      sortKey === chave
    ) {
      setDirecao(
        (atual) =>
          atual === "asc"
            ? "desc"
            : "asc",
      );

      return;
    }

    setSortKey(
      chave,
    );
    setDirecao(
      "asc",
    );
  }

  function nova() {
    setSeguradoraEditando(
      null,
    );
    setFormularioAberto(
      true,
    );
  }

  function editar(
    seguradora:
      Seguradora,
  ) {
    setSeguradoraEditando(
      seguradora,
    );
    setFormularioAberto(
      true,
    );
  }

  function atualizar() {
    setFormularioAberto(
      false,
    );
    setSeguradoraEditando(
      null,
    );
    router.refresh();
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Seguradoras
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cadastre e mantenha as seguradoras disponíveis no sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={
              nova
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
          >
            <Plus size={18} />
            Nova Seguradora
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-xl">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={
                  busca
                }
                onChange={(
                  event,
                ) =>
                  setBusca(
                    event.target
                      .value,
                  )
                }
                placeholder="Pesquisar seguradora ou código..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-slate-700 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  chave:
                    "todas" as const,
                  titulo:
                    "Todas",
                  total:
                    contadores.todas,
                },
                {
                  chave:
                    "ativas" as const,
                  titulo:
                    "Ativas",
                  total:
                    contadores.ativas,
                },
                {
                  chave:
                    "inativas" as const,
                  titulo:
                    "Inativas",
                  total:
                    contadores.inativas,
                },
              ].map(
                (item) => {
                  const ativo =
                    filtro ===
                    item.chave;

                  return (
                    <button
                      key={
                        item.chave
                      }
                      type="button"
                      onClick={() =>
                        setFiltro(
                          item.chave,
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        ativo
                          ? "bg-[#0A2F5A] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item.titulo}

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          ativo
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-600"
                        }`}
                      >
                        {
                          item.total
                        }
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {exibidas.length ===
          0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="font-semibold text-slate-700">
                Nenhuma seguradora encontrada
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Altere a pesquisa ou o filtro selecionado.
              </p>
            </div>
          ) : (
            <table className="w-full table-fixed">
              <thead className="bg-slate-50">
                <tr>
                  <Cabecalho
                    titulo="Seguradora"
                    chave="nome"
                    sortKey={
                      sortKey
                    }
                    direcao={
                      direcao
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[45%]"
                  />

                  <Cabecalho
                    titulo="Código"
                    chave="codigo"
                    sortKey={
                      sortKey
                    }
                    direcao={
                      direcao
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[20%]"
                  />

                  <Cabecalho
                    titulo="Status"
                    chave="status"
                    sortKey={
                      sortKey
                    }
                    direcao={
                      direcao
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[15%]"
                  />

                  <th className="w-[20%] px-4 py-4 text-center text-sm font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {exibidas.map(
                  (
                    seguradora,
                  ) => (
                    <tr
                      key={
                        seguradora.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="truncate font-semibold text-slate-900">
                          {
                            seguradora.nome
                          }
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        <span className="block truncate">
                          {seguradora.codigo ||
                            "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            seguradora.ativo
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {seguradora.ativo
                            ? "Ativa"
                            : "Inativa"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <SeguradoraActions
                          seguradora={
                            seguradora
                          }
                          onEdit={
                            editar
                          }
                          onChanged={
                            atualizar
                          }
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {formularioAberto && (
        <SeguradoraForm
          seguradora={
            seguradoraEditando
          }
          onClose={() => {
            setFormularioAberto(
              false,
            );
            setSeguradoraEditando(
              null,
            );
          }}
          onSaved={
            atualizar
          }
        />
      )}
    </>
  );
}
