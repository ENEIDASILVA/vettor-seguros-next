"use client";

import { useRef } from "react";

import Input from "../../ui/Input";
import Select from "../../ui/Select";
import RadioGroup from "../../ui/RadioGroup";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";
import { useCep } from "../hooks/useCep";

const years = Array.from({ length: 26 }, (_, index) => {
  const year = new Date().getFullYear() - index;

  return {
    label: year.toString(),
    value: year.toString(),
  };
});

export default function StepVehicle() {
  const { form, updateField, updateFields } = useQuote();
  const { loading, findCep } = useCep();

  const lastSearchedCep = useRef("");

  function handleCepChange(value: string) {
    updateField("vehicleCep", value);

    const numbers = value.replace(/\D/g, "");

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

    if (numbers === lastSearchedCep.current) {
      return;
    }

    lastSearchedCep.current = numbers;

    void findCep(value, (addressData) => {
      updateFields({
        address: addressData.address,
        district: addressData.district,
        city: addressData.city,
        state: addressData.state,
      });
    });
  }

  return (
    <StepLayout
      title="Dados do veículo"
      subtitle="Informe os dados principais para iniciarmos sua cotação."
    >
      <Input
        label="Marca"
        value={form.vehicleBrand}
        placeholder="Ex.: Toyota"
        required
        onChange={(value) => updateField("vehicleBrand", value)}
      />

      <Input
        label="Modelo"
        value={form.vehicleModel}
        placeholder="Ex.: Corolla"
        required
        onChange={(value) => updateField("vehicleModel", value)}
      />

      <Select
        label="Ano do veículo"
        value={form.vehicleYear}
        options={years}
        onChange={(value) => updateField("vehicleYear", value)}
      />

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
          Confira os dados encontrados e complete ou altere as informações
          quando necessário.
        </p>

        <Input
          label="Rua ou logradouro"
          value={form.address}
          placeholder="Digite a rua ou o logradouro"
          required
          onChange={(value) => updateField("address", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Número"
            value={form.addressNumber}
            placeholder="Ex.: 125"
            required
            onChange={(value) => updateField("addressNumber", value)}
          />

          <Input
            label="Complemento"
            value={form.addressComplement}
            placeholder="Apto., bloco, casa, lote..."
            onChange={(value) => updateField("addressComplement", value)}
          />
        </div>

        <Input
          label="Bairro"
          value={form.district}
          placeholder="Digite o bairro"
          required
          onChange={(value) => updateField("district", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Cidade"
            value={form.city}
            placeholder="Digite a cidade"
            required
            onChange={(value) => updateField("city", value)}
          />

          <Input
            label="Estado"
            value={form.state}
            placeholder="Ex.: MG"
            required
            onChange={(value) =>
              updateField("state", value.toUpperCase().slice(0, 2))
            }
          />
        </div>
      </div>

      <RadioGroup
        label="O veículo permanece em garagem?"
        value={form.vehicleGarage}
        onChange={(value) => updateField("vehicleGarage", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <RadioGroup
        label="Utiliza para aplicativo (Uber/99)?"
        value={form.vehicleApp}
        onChange={(value) => updateField("vehicleApp", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <RadioGroup
        label="Possui rastreador?"
        value={form.vehicleTracker}
        onChange={(value) => updateField("vehicleTracker", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />
    </StepLayout>
  );
}