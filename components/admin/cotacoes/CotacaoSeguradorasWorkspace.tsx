"use client";

import {
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  useMemo,
  useTransition,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  atualizarRecomendadaCotacaoSeguradoraAction,
} from "@/app/admin/actions/cotacoesSeguradoras";

import {
  salvarSelecaoCotacaoNaPropostaAction,
} from "@/app/admin/actions/propostas";

import {
  useToast,
} from "@/components/ui/ToastProvider";

import type {
  CotacaoSeguradoraLista,
} from "@/lib/repositories/cotacoesSeguradorasRepository";

import type {
  SeguradoraOption,
  SelectOption,
} from "@/lib/services/cotacoesSeguradorasFormService";

import CotacaoSeguradoraModal from "./CotacaoSeguradoraModal";

import CotacaoSeguradorasComparativo from "./CotacaoSeguradorasComparativo";

import SeguradoraCotacaoCard from "./SeguradoraCotacaoCard";

import SeguradoraVaziaCard from "./SeguradoraVaziaCard";

import type {
  CotacaoSeguradoraFormData,
} from "./CotacaoSeguradoraForm";

import useCotacaoWorkspace from "./useCotacaoWorkspace";

type Props = {
  cotacaoId: string;

  seguradoras: SeguradoraOption[];

  cotacoes: CotacaoSeguradoraLista[];

  statusOptions: SelectOption[];

  tiposCotacao: SelectOption[];

  tiposCasco: SelectOption[];

  carroReservaOptions: SelectOption[];

  assistenciaOptions: SelectOption[];
};

function criarFormularioVazio(
  cotacaoId: string,
  seguradoraId: number | null,
): CotacaoSeguradoraFormData {
  return {
    origemCotacao: "",

    consultorNome: "",

    consultorTelefone: "",

    observacaoInterna: "",

    cotacaoId,

    seguradoraId,

    numeroCotacao: "",

    codigoCalculo: "",

    tipoCotacao: "",

    classeBonus: "",

    status: "Solicitada",

    premioLiquido: null,

    premioTotal: null,

    iof: null,

    custoApolice: null,

    franquiaNormal: null,

    franquiaReduzida: null,

    franquiaMajorada: null,

    percentualFipe: null,

    tipoCasco: "",

    danosMateriais: null,

    danosCorporais: null,

    danosMorais: null,

    appMorte: null,

    appInvalidez: null,

    appDespesasMedicas: null,

    comissaoPercentual: null,

    comissaoValor: null,

    formaPagamento: "",

    parcelamento: "",

    parcelaMaxima: null,

    valorParcela: null,

    vencimentoPrimeira: "",

    validade: "",

    assistencia: "",

    assistencia24h: false,

    carroReserva: "",

    quilometragemGuincho: "",

    coberturaVidros: false,

    coberturaFarois: false,

    coberturaLanternas: false,

    coberturaRetrovisores: false,

    chaveiro: false,

    taxi: false,

    hotel: false,

    coberturas: "",

    observacoes: "",

    arquivoPdfPath: "",

    arquivoPdfNome: "",

    arquivoPdfTamanho: null,

    arquivoPdfTipo: "",

    arquivoPdfFile: null,

    recomendada: false,

    ordemExibicao: 0,
  };
}

function converterCotacaoParaFormulario(
  cotacao: CotacaoSeguradoraLista,
): CotacaoSeguradoraFormData {
  return {
    origemCotacao:
      cotacao.origemCotacao ?? "",

    consultorNome:
      cotacao.consultorNome ?? "",

    consultorTelefone:
      cotacao.consultorTelefone ?? "",

    observacaoInterna:
      cotacao.observacaoInterna ?? "",

    id:
      cotacao.id,

    cotacaoId:
      cotacao.cotacaoId,

    seguradoraId:
      cotacao.seguradoraId,

    numeroCotacao:
      cotacao.numeroCotacao ?? "",

    codigoCalculo:
      cotacao.codigoCalculo ?? "",

    tipoCotacao:
      cotacao.tipoCotacao ?? "",

    classeBonus:
      cotacao.classeBonus ?? "",

    status:
      cotacao.status,

    premioLiquido:
      cotacao.premioLiquido,

    premioTotal:
      cotacao.premioTotal,

    iof:
      cotacao.iof,

    custoApolice:
      cotacao.custoApolice,

    franquiaNormal:
      cotacao.franquiaNormal,

    franquiaReduzida:
      cotacao.franquiaReduzida,

    franquiaMajorada:
      cotacao.franquiaMajorada,

    percentualFipe:
      cotacao.percentualFipe,

    tipoCasco:
      cotacao.tipoCasco ?? "",

    danosMateriais:
      cotacao.danosMateriais,

    danosCorporais:
      cotacao.danosCorporais,

    danosMorais:
      cotacao.danosMorais,

    appMorte:
      cotacao.appMorte,

    appInvalidez:
      cotacao.appInvalidez,

    appDespesasMedicas:
      cotacao.appDespesasMedicas,

    comissaoPercentual:
      cotacao.comissaoPercentual,

    comissaoValor:
      cotacao.comissaoValor,

    formaPagamento:
      cotacao.formaPagamento ?? "",

    parcelamento:
      cotacao.parcelamento ?? "",

    parcelaMaxima:
      cotacao.parcelaMaxima,

    valorParcela:
      cotacao.valorParcela,

    vencimentoPrimeira:
      cotacao.vencimentoPrimeira ?? "",

    validade:
      cotacao.validade ?? "",

    assistencia:
      cotacao.assistencia ?? "",

    assistencia24h:
      cotacao.assistencia24h,

    carroReserva:
      cotacao.carroReserva ?? "",

    quilometragemGuincho:
      cotacao.quilometragemGuincho ?? "",

    coberturaVidros:
      cotacao.coberturaVidros,

    coberturaFarois:
      cotacao.coberturaFarois,

    coberturaLanternas:
      cotacao.coberturaLanternas,

    coberturaRetrovisores:
      cotacao.coberturaRetrovisores,

    chaveiro:
      cotacao.chaveiro,

    taxi:
      cotacao.taxi,

    hotel:
      cotacao.hotel,

    coberturas:
      cotacao.coberturas ?? "",

    observacoes:
      cotacao.observacoes ?? "",

    arquivoPdfPath:
      cotacao.arquivoPdfPath ?? "",

    arquivoPdfNome:
      cotacao.arquivoPdfNome ?? "",

    arquivoPdfTamanho:
      cotacao.arquivoPdfTamanho,

    arquivoPdfTipo:
      cotacao.arquivoPdfTipo ?? "",

    arquivoPdfFile:
      null,

    recomendada:
      cotacao.recomendada,

    ordemExibicao:
      cotacao.ordemExibicao,
  };
}

export default function CotacaoSeguradorasWorkspace({
  cotacaoId,
  seguradoras,
  cotacoes,
  statusOptions,
  tiposCotacao,
  tiposCasco,
  carroReservaOptions,
  assistenciaOptions,
}: Props) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const propostaId =
    searchParams.get(
      "propostaId",
    );

  const toast =
    useToast();

  const [
    salvandoProposta,
    startSalvarPropostaTransition,
  ] =
    useTransition();

  const [
    atualizandoSelecao,
    startSelecaoTransition,
  ] =
    useTransition();

  const {
    modalOpen,

    seguradoraSelecionadaId,

    cotacaoSeguradoraSelecionadaId,

    openNew,

    openEdit,

    closeModal,
  } =
    useCotacaoWorkspace({
      cotacaoId,
    });

  const cotacoesPorSeguradora =
    useMemo(
      () =>
        new Map(
          cotacoes.map(
            (cotacao) => [
              cotacao.seguradoraId,
              cotacao,
            ],
          ),
        ),
      [cotacoes],
    );

  const cotacaoSelecionada =
    useMemo(
      () =>
        cotacoes.find(
          (cotacao) =>
            cotacao.id ===
            cotacaoSeguradoraSelecionadaId,
        ) ?? null,
      [
        cotacaoSeguradoraSelecionadaId,
        cotacoes,
      ],
    );

  const initialData =
    useMemo(
      () =>
        cotacaoSelecionada
          ? converterCotacaoParaFormulario(
              cotacaoSelecionada,
            )
          : criarFormularioVazio(
              cotacaoId,
              seguradoraSelecionadaId,
            ),
      [
        cotacaoId,
        cotacaoSelecionada,
        seguradoraSelecionadaId,
      ],
    );

  const premiosValidos =
    cotacoes
      .map(
        (cotacao) =>
          cotacao.premioTotal,
      )
      .filter(
        (
          premio,
        ): premio is number =>
          premio !== null &&
          premio !== undefined,
      );

  const menorPremio =
    premiosValidos.length > 0
      ? Math.min(
          ...premiosValidos,
        )
      : null;

  const quantidadeRecomendadas =
    cotacoes.filter(
      (cotacao) =>
        cotacao.recomendada,
    ).length;

  function alterarSelecaoProposta(
    id: string,
    recomendada: boolean,
  ) {
    startSelecaoTransition(
      async () => {
        const result =
          await atualizarRecomendadaCotacaoSeguradoraAction(
            id,
            cotacaoId,
            recomendada,
          );

        if (!result.success) {
          toast.error(
            result.message,
          );

          return;
        }

        toast.success(
          result.message,
        );

        router.refresh();
      },
    );
  }

  function salvarEVoltarParaProposta() {
    if (!propostaId) {
      return;
    }

    startSalvarPropostaTransition(
      async () => {
        const result =
          await salvarSelecaoCotacaoNaPropostaAction(
            propostaId,
            cotacaoId,
          );

        if (!result.success) {
          toast.error(
            result.message,
          );

          return;
        }

        toast.success(
          result.message,
        );

        router.push(
          `/admin/propostas/${propostaId}/workspace?edit=true`,
        );

        router.refresh();
      },
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Cotações das Seguradoras
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registre, acompanhe e compare as opções
              recebidas das seguradoras.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
              {cotacoes.length} cotada
              {cotacoes.length === 1
                ? ""
                : "s"}
            </span>

            <span className="rounded-full bg-yellow-50 px-3 py-1.5 font-medium text-yellow-700">
              {quantidadeRecomendadas} selecionada
              {quantidadeRecomendadas === 1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        <CotacaoSeguradorasComparativo
          cotacoes={cotacoes}
          seguradoras={seguradoras}
          menorPremio={menorPremio}
          atualizando={
            atualizandoSelecao
          }
          onEditar={openEdit}
          onSelecionar={
            alterarSelecaoProposta
          }
        />

        {seguradoras.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShieldCheck
              size={34}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-medium text-slate-700">
              Nenhuma seguradora ativa cadastrada.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cadastre ou ative uma seguradora para
              iniciar as cotações.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {seguradoras.map(
              (seguradora) => {
                const cotacao =
                  cotacoesPorSeguradora.get(
                    seguradora.value,
                  );

                if (!cotacao) {
                  return (
                    <SeguradoraVaziaCard
                      key={
                        seguradora.value
                      }
                      seguradora={
                        seguradora
                      }
                      onNova={
                        openNew
                      }
                    />
                  );
                }

                return (
                  <SeguradoraCotacaoCard
                    key={
                      seguradora.value
                    }
                    seguradora={
                      seguradora
                    }
                    cotacao={
                      cotacao
                    }
                    menorPremio={
                      menorPremio
                    }
                    onEditar={
                      openEdit
                    }
                  />
                );
              },
            )}
          </div>
        )}

        {cotacoes.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/60 p-5">
            {propostaId ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-700">
                    Edição da proposta em andamento
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Marque ou desmarque as seguradoras acima e,
                    quando terminar, salve para voltar à proposta.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    salvarEVoltarParaProposta
                  }
                  disabled={
                    salvandoProposta ||
                    atualizandoSelecao ||
                    quantidadeRecomendadas === 0
                  }
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-700
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-800
                    disabled:cursor-not-allowed
                    disabled:bg-slate-300
                  "
                >
                  <Save
                    size={18}
                  />

                  {salvandoProposta
                    ? "Salvando..."
                    : "Salvar e voltar para Proposta"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Selecione no comparativo uma ou mais
                cotações para compor a proposta comercial.
              </p>
            )}
          </div>
        )}
      </section>

      <CotacaoSeguradoraModal
        key={
          initialData.id ??
          `nova-${initialData.seguradoraId ?? "sem-seguradora"}`
        }
        open={modalOpen}
        initialData={
          initialData
        }
        seguradoras={
          seguradoras
        }
        statusOptions={
          statusOptions
        }
        tiposCotacao={
          tiposCotacao
        }
        tiposCasco={
          tiposCasco
        }
        carroReservaOptions={
          carroReservaOptions
        }
        assistenciaOptions={
          assistenciaOptions
        }
        onClose={
          closeModal
        }
      />
    </>
  );
}