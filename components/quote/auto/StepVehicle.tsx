"use client";

import { useRef } from "react";

import Input from "../../ui/Input";
import RadioGroup from "../../ui/RadioGroup";

import StepLayout from "../common/StepLayout";
import VehicleSelector from "../components/VehicleSelector";

import { useQuote } from "../context/QuoteContext";
import { useCep } from "../hooks/useCep";

export default function StepVehicle() {
  const {
    form,
    updateField,
    updateFields,
  } = useQuote();

  const {
    loading,
    findCep,
  } = useCep();

  const lastSearchedCep = useRef("");

  function handleVehicleTypeChange(
    value: string
  ) {
    updateFields({
      vehicleType: value,

      vehicleBrandCode: "",
      vehicleBrand: "",

      vehicleModelCode: "",
      vehicleModel: "",

      vehicleYearCode: "",
      vehicleYear: "",

      vehicleFuel: "",
      vehicleFipeCode: "",
      vehicleZeroKm: "",
    });
  }

  function handleBrandChange(
    code: string,
    name: string
  ) {
    updateFields({
      vehicleBrandCode: code,
      vehicleBrand: name,

      vehicleModelCode: "",
      vehicleModel: "",

      vehicleYearCode: "",
      vehicleYear: "",

      vehicleFuel: "",
      vehicleFipeCode: "",
      vehicleZeroKm: "",
    });
  }

  function handleModelChange(
    code: string,
    name: string
  ) {
    updateFields({
      vehicleModelCode: code,
      vehicleModel: name,

      vehicleYearCode: "",
      vehicleYear: "",

      vehicleFuel: "",
      vehicleFipeCode: "",
      vehicleZeroKm: "",
    });
  }

  function handleYearChange(
    code: string,
    name: string,
    fuel: string
  ) {
    const isZeroKm =
      name.toLowerCase().startsWith(
        "zero km"
      );

    updateFields({
      vehicleYearCode: code,
      vehicleYear: name,
      vehicleFuel: fuel,
      vehicleZeroKm: isZeroKm
        ? "Sim"
        : "Não",
      vehicleFipeCode: "",
    });
  }

  function handleCepChange(value: string) {
    updateField("vehicleCep", value);

    const numbers = value.replace(
      /\D/g,
      ""
    );

    if (numbers.length < 8) {
      lastSearchedCep.current = "";

      updateFields({
        address: "",
        addressNumber: "",
        addressComplement: "",
        district: "",
        city: "",
        state: "",
      });

      return;
    }

    if (
      numbers === lastSearchedCep.current
    ) {
      return;
    }

    lastSearchedCep.current = numbers;

    void findCep(
      value,
      (addressData) => {
        updateFields({
          address: addressData.address,
          district: addressData.district,
          city: addressData.city,
          state: addressData.state,
        });
      }
    );
  }

  return (
    <StepLayout
      title="Dados do veículo"
      subtitle="Selecione o tipo e os dados do veículo e informe o endereço onde ele permanece durante a noite."
    >
      <RadioGroup
        label="Tipo de veículo"
        value={form.vehicleType}
        onChange={handleVehicleTypeChange}
        options={[
          {
            label: "Carro",
            value: "carros",
          },
          {
            label: "Moto",
            value: "motos",
          },
          {
            label: "Caminhão",
            value: "caminhoes",
          },
        ]}
      />

      <VehicleSelector
        vehicleType={
          form.vehicleType as
            | "carros"
            | "motos"
            | "caminhoes"
            | ""
        }
        brandCode={
          form.vehicleBrandCode
        }
        modelCode={
          form.vehicleModelCode
        }
        yearCode={
          form.vehicleYearCode
        }
        onBrandChange={
          handleBrandChange
        }
        onModelChange={
          handleModelChange
        }
        onYearChange={
          handleYearChange
        }
      />

      {form.vehicleFuel && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-gray-600">
            Combustível identificado
          </p>

          <p className="mt-1 font-semibold text-blue-900">
            {form.vehicleFuel}
          </p>
        </div>
      )}

      <Input
        label="CEP de pernoite"
        value={form.vehicleCep}
        placeholder="00000-000"
        mask="cep"
        required
        onChange={handleCepChange}
      />

      {loading && (
        <p className="-mt-4 mb-6 text-sm text-blue-700">
          Buscando endereço...
        </p>
      )}

      <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="mb-5 text-lg font-bold text-blue-900">
          Endereço de pernoite
        </h3>

        <p className="mb-5 text-sm text-gray-600">
          Confira os dados encontrados e
          complete ou altere as informações
          quando necessário.
        </p>

        <Input
          label="Rua ou logradouro"
          value={form.address}
          placeholder="Digite a rua ou o logradouro"
          required
          onChange={(value) =>
            updateField(
              "address",
              value
            )
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Número"
            value={
              form.addressNumber
            }
            placeholder="Ex.: 125"
            required
            onChange={(value) =>
              updateField(
                "addressNumber",
                value
              )
            }
          />

          <Input
            label="Complemento"
            value={
              form.addressComplement
            }
            placeholder="Apto., bloco, casa, lote..."
            onChange={(value) =>
              updateField(
                "addressComplement",
                value
              )
            }
          />
        </div>

        <Input
          label="Bairro"
          value={form.district}
          placeholder="Digite o bairro"
          required
          onChange={(value) =>
            updateField(
              "district",
              value
            )
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Cidade"
            value={form.city}
            placeholder="Digite a cidade"
            required
            onChange={(value) =>
              updateField(
                "city",
                value
              )
            }
          />

          <Input
            label="Estado"
            value={form.state}
            placeholder="Ex.: MG"
            required
            onChange={(value) =>
              updateField(
                "state",
                value
                  .toUpperCase()
                  .slice(0, 2)
              )
            }
          />
        </div>
      </div>

      <RadioGroup
        label="O veículo permanece em garagem?"
        value={form.vehicleGarage}
        onChange={(value) =>
          updateField(
            "vehicleGarage",
            value
          )
        }
        options={[
          {
            label: "Sim",
            value: "Sim",
          },
          {
            label: "Não",
            value: "Não",
          },
        ]}
      />

      <RadioGroup
        label="Utiliza para aplicativo (Uber/99)?"
        value={form.vehicleApp}
        onChange={(value) =>
          updateField(
            "vehicleApp",
            value
          )
        }
        options={[
          {
            label: "Sim",
            value: "Sim",
          },
          {
            label: "Não",
            value: "Não",
          },
        ]}
      />

      <RadioGroup
        label="Possui rastreador?"
        value={form.vehicleTracker}
        onChange={(value) =>
          updateField(
            "vehicleTracker",
            value
          )
        }
        options={[
          {
            label: "Sim",
            value: "Sim",
          },
          {
            label: "Não",
            value: "Não",
          },
        ]}
      />
    </StepLayout>
  );
}