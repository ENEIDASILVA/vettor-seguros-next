import Input from "../../ui/Input";
import StepLayout from "./StepLayout";
import { useQuote } from "../context/QuoteContext";

import { isValidEmail } from "../utils/validators";

export default function StepPersonal() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout
      title="Agora vamos conhecer você"
      subtitle="Precisamos apenas de algumas informações."
    >
      <Input label="Nome completo" required value={form.name} placeholder="Digite seu nome" onChange={(value) => updateField("name", value)} />
      <Input label="Telefone" value={form.phone} placeholder="(31) 99999-9999" onChange={(value) => updateField("phone", value)} mask="phone" required />
      <Input label="E-mail" type="email" error={!isValidEmail(form.email) ? "Confira o e-mail informado." : ""} value={form.email} placeholder="seu@email.com" onChange={(value) => updateField("email", value)} />
      <Input label="CPF" value={form.cpf} placeholder="000.000.000-00" onChange={(value) => updateField("cpf", value)} mask="cpf" required />
    </StepLayout>
  );
}