"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import type {
  CotacaoSeguradoraFormData,
  CotacaoSeguradoraOption,
  CotacaoSeguradoraSelectOption,
} from "../CotacaoSeguradoraForm";


type Props = {
  form: CotacaoSeguradoraFormData;

  setValue: <
    K extends keyof CotacaoSeguradoraFormData,
  >(
    field: K,
    value: CotacaoSeguradoraFormData[K],
  ) => void;

  seguradoras: CotacaoSeguradoraOption[];

  statusOptions:
    CotacaoSeguradoraSelectOption[];

  tiposCotacao:
    CotacaoSeguradoraSelectOption[];
};


const origemOptions:
  CotacaoSeguradoraSelectOption[] = [
    {
      value: "Portal",
      label: "Portal da Seguradora",
    },
    {
      value: "Multicalculo",
      label: "Multicálculo",
    },
    {
      value: "Email",
      label: "E-mail",
    },
    {
      value: "WhatsApp",
      label: "WhatsApp",
    },
    {
      value: "Manual",
      label: "Manual",
    },
  ];


export default function StepDadosGerais({
  form,
  setValue,
  seguradoras,
  statusOptions,
  tiposCotacao,
}: Props) {
  return (
    <div className="space-y-8">
      <section>
        <h4 className="mb-5 text-lg font-bold text-slate-800">
          Identificação da Proposta
        </h4>

        <div className="grid gap-x-5 md:grid-cols-2">
          <Select
            label="Seguradora"
            value={
              form.seguradoraId?.toString() ??
              ""
            }
            options={seguradoras.map(
              (seguradora) => ({
                value:
                  seguradora.value.toString(),
                label:
                  seguradora.label,
              }),
            )}
            required
            onChange={(value) =>
              setValue(
                "seguradoraId",
                value
                  ? Number(value)
                  : null,
              )
            }
          />

          <Select
            label="Status"
            value={form.status}
            options={statusOptions}
            required
            onChange={(value) =>
              setValue(
                "status",
                value,
              )
            }
          />

          <Select
            label="Tipo de Cotação"
            value={form.tipoCotacao}
            options={tiposCotacao}
            onChange={(value) =>
              setValue(
                "tipoCotacao",
                value,
              )
            }
          />

          <Input
            label="Classe de Bônus"
            value={form.classeBonus}
            placeholder="Ex.: 10"
            onChange={(value) =>
              setValue(
                "classeBonus",
                value,
              )
            }
          />

          <Input
            label="Número da Cotação"
            value={form.numeroCotacao}
            placeholder="Número fornecido pela seguradora"
            onChange={(value) =>
              setValue(
                "numeroCotacao",
                value,
              )
            }
          />

          <Input
            label="Código do Cálculo"
            value={form.codigoCalculo}
            placeholder="Código para reabrir o cálculo"
            onChange={(value) =>
              setValue(
                "codigoCalculo",
                value,
              )
            }
          />

          <Input
            type="date"
            label="Validade"
            value={form.validade}
            onChange={(value) =>
              setValue(
                "validade",
                value,
              )
            }
          />
        </div>
      </section>


      <section className="border-t border-slate-200 pt-7">
        <h4 className="mb-5 text-lg font-bold text-slate-800">
          Informações Operacionais
        </h4>

        <div className="grid gap-x-5 md:grid-cols-2">
          <Select
            label="Origem da Cotação"
            value={form.origemCotacao}
            options={origemOptions}
            onChange={(value) =>
              setValue(
                "origemCotacao",
                value,
              )
            }
          />

          <Input
            label="Consultor da Seguradora"
            value={form.consultorNome}
            placeholder="Nome do consultor ou atendente"
            onChange={(value) =>
              setValue(
                "consultorNome",
                value,
              )
            }
          />

          <Input
            label="Telefone / WhatsApp"
            mask="phone"
            value={form.consultorTelefone}
            placeholder="(00) 00000-0000"
            onChange={(value) =>
              setValue(
                "consultorTelefone",
                value,
              )
            }
          />
        </div>


        <div>
          <label
            htmlFor="observacao-interna"
            className="mb-2 block font-semibold text-blue-900"
          >
            Observação Interna
          </label>

          <textarea
            id="observacao-interna"
            rows={5}
            value={form.observacaoInterna}
            placeholder="Registre informações internas sobre a negociação, condições especiais ou contatos realizados."
            onChange={(event) =>
              setValue(
                "observacaoInterna",
                event.target.value,
              )
            }
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-900
              focus:ring-4
              focus:ring-blue-100
            "
          />
        </div>
      </section>
    </div>
  );
}