"use client";

import {
  useCallback,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  salvarCotacaoSeguradoraAction,
  type CotacaoSeguradoraActionInput,
} from "@/app/admin/actions/cotacoesSeguradoras";

import {
  useToast,
} from "@/components/ui/ToastProvider";

import type {
  CotacaoSeguradoraFormData,
} from "./CotacaoSeguradoraForm";

type Props = {
  initialData: CotacaoSeguradoraFormData;
  onSaved?: () => void;
};

export default function useCotacaoSeguradoraForm({
  initialData,
  onSaved,
}: Props) {
  const router = useRouter();

  const toast = useToast();

  const [form, setForm] =
    useState<CotacaoSeguradoraFormData>(
      initialData,
    );

  const [loading, setLoading] =
    useState(false);

  function setValue<
    K extends keyof CotacaoSeguradoraFormData,
  >(
    field: K,
    value: CotacaoSeguradoraFormData[K],
  ) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  const reset = useCallback(() => {
    setForm(initialData);
  }, [initialData]);

  function validar(): string {
    if (!form.cotacaoId.trim()) {
      return "Cotação de origem não informada.";
    }

    if (
      form.seguradoraId === null ||
      !Number.isFinite(form.seguradoraId) ||
      form.seguradoraId <= 0
    ) {
      return "Selecione uma seguradora.";
    }

    if (!form.status.trim()) {
      return "Selecione o status da cotação.";
    }

    if (
      form.comissaoPercentual !== null &&
      (
        form.comissaoPercentual < 0 ||
        form.comissaoPercentual > 100
      )
    ) {
      return "A comissão percentual deve estar entre 0 e 100.";
    }

    if (
      form.percentualFipe !== null &&
      form.percentualFipe < 0
    ) {
      return "O percentual FIPE não pode ser negativo.";
    }

    if (
      form.parcelaMaxima !== null &&
      form.parcelaMaxima <= 0
    ) {
      return "A quantidade de parcelas deve ser maior que zero.";
    }

    if (
      form.arquivoPdfFile &&
      form.arquivoPdfFile.type !==
        "application/pdf"
    ) {
      return "O arquivo deve ser um PDF.";
    }

    if (
      form.arquivoPdfFile &&
      form.arquivoPdfFile.size >
        10 * 1024 * 1024
    ) {
      return "O PDF deve possuir no máximo 10 MB.";
    }

    return "";
  }

  function montarInput(
    id?: string,
    arquivoPdfPath:
      string | null =
        form.arquivoPdfPath,
  ): CotacaoSeguradoraActionInput {
    return {
      id,

      cotacaoId:
        form.cotacaoId,

      seguradoraId:
        form.seguradoraId,

      numeroCotacao:
        form.numeroCotacao,

      codigoCalculo:
        form.codigoCalculo,

      tipoCotacao:
        form.tipoCotacao,

      classeBonus:
        form.classeBonus,

      premioLiquido:
        form.premioLiquido,

      premioTotal:
        form.premioTotal,

      iof:
        form.iof,

      custoApolice:
        form.custoApolice,

      franquiaNormal:
        form.franquiaNormal,

      franquiaReduzida:
        form.franquiaReduzida,

      franquiaMajorada:
        form.franquiaMajorada,

      percentualFipe:
        form.percentualFipe,

      tipoCasco:
        form.tipoCasco,

      danosMateriais:
        form.danosMateriais,

      danosCorporais:
        form.danosCorporais,

      danosMorais:
        form.danosMorais,

      appMorte:
        form.appMorte,

      appInvalidez:
        form.appInvalidez,

      appDespesasMedicas:
        form.appDespesasMedicas,

      comissaoPercentual:
        form.comissaoPercentual,

      comissaoValor:
        form.comissaoValor,

      formaPagamento:
        form.formaPagamento,

      parcelamento:
        form.parcelamento,

      parcelaMaxima:
        form.parcelaMaxima,

      valorParcela:
        form.valorParcela,

      vencimentoPrimeira:
        form.vencimentoPrimeira,

      validade:
        form.validade,

      origemCotacao:
        form.origemCotacao,

      consultorNome:
        form.consultorNome,

      consultorTelefone:
        form.consultorTelefone,

      observacaoInterna:
        form.observacaoInterna,

      assistencia:
        form.assistencia,

      assistencia24h:
        form.assistencia24h,

      carroReserva:
        form.carroReserva,

      quilometragemGuincho:
        form.quilometragemGuincho,

      coberturaVidros:
        form.coberturaVidros,

      coberturaFarois:
        form.coberturaFarois,

      coberturaLanternas:
        form.coberturaLanternas,

      coberturaRetrovisores:
        form.coberturaRetrovisores,

      chaveiro:
        form.chaveiro,

      taxi:
        form.taxi,

      hotel:
        form.hotel,

      coberturas:
        form.coberturas,

      observacoes:
        form.observacoes,

      arquivoPdfPath,

      arquivoPdfNome:
        form.arquivoPdfNome,

      arquivoPdfTamanho:
        form.arquivoPdfTamanho,

      arquivoPdfTipo:
        form.arquivoPdfTipo,

      recomendada:
        form.recomendada,

      ordemExibicao:
        form.ordemExibicao,

      status:
        form.status,
    };
  }

    async function salvar() {
    if (loading) {
      return;
    }

    const erroValidacao = validar();

    if (erroValidacao) {
      toast.warning(erroValidacao);
      return;
    }

    setLoading(true);

    try {
      const result =
        await salvarCotacaoSeguradoraAction(
          montarInput(form.id),
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.refresh();

      onSaved?.();
    } catch (exception) {
      const message =
        exception instanceof Error
          ? exception.message
          : "Não foi possível salvar a cotação.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,

    loading,

    setValue,

    reset,

    salvar,
  };
}