"use client";

import { Home } from "lucide-react";
import { useRef } from "react";

import Input from "../../ui/Input";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";
import { useCep } from "../hooks/useCep";

export default function StepResidentialStart() {
  const { form, updateField, updateFields } = useQuote();
  const { loading, findCep } = useCep();
  const lastSearchedCep = useRef("");

  function handleCepChange(value: string) {
    updateField("propertyCep", value);

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
      title="Proteja o seu lar de um jeito simples"
      subtitle="Conte um pouco sobre você para iniciarmos a cotação do seu imóvel."
    >
      <div className="mb-8 grid gap-4 rounded-3xl bg-blue-950 p-6 text-white sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Home aria-hidden="true" size={28} />
        </div>
        <div>
          <p className="text-lg font-bold">Cotação de Seguro Residencial</p>
          <p className="mt-1 text-sm leading-relaxed text-blue-100">
            Leva poucos minutos. Depois, um especialista da Vettor compara as opções para você.
          </p>
        </div>
      </div>

      <div className="grid gap-x-5 md:grid-cols-2">
        <Input label="Nome completo" value={form.name} placeholder="Digite seu nome" required onChange={(value) => updateField("name", value)} />
        <Input label="CPF" value={form.cpf} placeholder="000.000.000-00" mask="cpf" required onChange={(value) => updateField("cpf", value)} />
        <Input label="Telefone" value={form.phone} placeholder="(31) 99999-9999" mask="phone" required onChange={(value) => updateField("phone", value)} />
        <Input label="E-mail" type="email" value={form.email} placeholder="seu@email.com" required onChange={(value) => updateField("email", value)} />
        <div>
          <Input label="CEP do imóvel" value={form.propertyCep} placeholder="00000-000" mask="cep" required onChange={handleCepChange} />
          {loading && (
            <p className="-mt-4 mb-6 text-sm font-medium text-blue-700" role="status">
              Buscando endereço...
            </p>
          )}
        </div>
      </div>

      {!loading && form.city && form.state && (
        <div className="-mt-2 mb-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" aria-live="polite">
          <span className="font-bold">Endereço encontrado: </span>
          {[form.address, form.district, `${form.city} - ${form.state}`]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}

      <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 text-sm leading-relaxed text-gray-700">
        <input
          type="checkbox"
          checked={form.residentialContactConsent === "Sim"}
          onChange={(event) => updateField("residentialContactConsent", event.target.checked ? "Sim" : "")}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-900"
        />
        <span>Autorizo a Vettor Seguros a entrar em contato para dar continuidade a esta cotação.</span>
      </label>
    </StepLayout>
  );
}
