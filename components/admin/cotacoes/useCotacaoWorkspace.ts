"use client";

import {
  useCallback,
  useState,
} from "react";

export type CotacaoWorkspaceMode =
  | "new"
  | "edit";

type UseCotacaoWorkspaceParams = {
  cotacaoId: string;
};

export default function useCotacaoWorkspace({
  cotacaoId,
}: UseCotacaoWorkspaceParams) {
  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    mode,
    setMode,
  ] =
    useState<CotacaoWorkspaceMode>(
      "new",
    );

  const [
    seguradoraSelecionadaId,
    setSeguradoraSelecionadaId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    cotacaoSeguradoraSelecionadaId,
    setCotacaoSeguradoraSelecionadaId,
  ] =
    useState<string | null>(
      null,
    );

  const openNew =
    useCallback(
      (
        seguradoraId: number,
      ) => {
        setMode("new");

        setSeguradoraSelecionadaId(
          seguradoraId,
        );

        setCotacaoSeguradoraSelecionadaId(
          null,
        );

        setModalOpen(true);
      },
      [],
    );

  const openEdit =
    useCallback(
      (
        cotacaoSeguradoraId: string,
        seguradoraId: number,
      ) => {
        setMode("edit");

        setSeguradoraSelecionadaId(
          seguradoraId,
        );

        setCotacaoSeguradoraSelecionadaId(
          cotacaoSeguradoraId,
        );

        setModalOpen(true);
      },
      [],
    );

  const closeModal =
    useCallback(
      () => {
        setModalOpen(false);

        setMode("new");

        setSeguradoraSelecionadaId(
          null,
        );

        setCotacaoSeguradoraSelecionadaId(
          null,
        );
      },
      [],
    );

  return {
    cotacaoId,

    modalOpen,

    mode,

    seguradoraSelecionadaId,

    cotacaoSeguradoraSelecionadaId,

    openNew,

    openEdit,

    closeModal,
  };
}