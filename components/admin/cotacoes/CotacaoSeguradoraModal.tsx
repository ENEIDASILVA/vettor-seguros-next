"use client";

import Modal from "@/components/ui/Modal";

import CotacaoSeguradoraForm, {
  type CotacaoSeguradoraFormData,
  type CotacaoSeguradoraOption,
  type CotacaoSeguradoraSelectOption,
} from "./CotacaoSeguradoraForm";


type Props = {
  open: boolean;

  title?: string;

  initialData: CotacaoSeguradoraFormData;

  seguradoras: CotacaoSeguradoraOption[];

  statusOptions: CotacaoSeguradoraSelectOption[];

  tiposCotacao: CotacaoSeguradoraSelectOption[];

  tiposCasco: CotacaoSeguradoraSelectOption[];

  carroReservaOptions:
    CotacaoSeguradoraSelectOption[];

  assistenciaOptions:
    CotacaoSeguradoraSelectOption[];

  tipoSeguro: string;

  onClose: () => void;
};


export default function CotacaoSeguradoraModal({
  open,
  title,
  initialData,
  seguradoras,
  statusOptions,
  tiposCotacao,
  tiposCasco,
  carroReservaOptions,
  assistenciaOptions,
  tipoSeguro,
  onClose,
}: Props) {
  const seguradoraNome =
    seguradoras.find(
      (seguradora) =>
        seguradora.value ===
        initialData.seguradoraId,
    )?.label;


  const modalTitle =
    title ??
    (
      initialData.id
        ? `Editar Cotação${
            seguradoraNome
              ? ` — ${seguradoraNome}`
              : ""
          }`
        : `Nova Cotação${
            seguradoraNome
              ? ` — ${seguradoraNome}`
              : ""
          }`
    );


  return (
    <Modal
      open={open}
      title={modalTitle}
      onClose={onClose}
      size="lg"
    >
      <CotacaoSeguradoraForm
        initialData={initialData}
        seguradoras={seguradoras}
        statusOptions={statusOptions}
        tiposCotacao={tiposCotacao}
        tiposCasco={tiposCasco}
        carroReservaOptions={
          carroReservaOptions
        }
        assistenciaOptions={
          assistenciaOptions
        }
        tipoSeguro={tipoSeguro}
        onCancel={onClose}
        onSaved={onClose}
      />
    </Modal>
  );
}