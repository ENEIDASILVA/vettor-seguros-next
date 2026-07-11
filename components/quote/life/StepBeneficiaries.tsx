"use client";

import StepLayout from "../common/StepLayout";
import BeneficiaryList from "./BeneficiaryList";

export default function StepBeneficiaries() {
  return (
    <StepLayout
      title="Beneficiários"
      subtitle="Cadastre quem receberá o capital segurado e distribua os percentuais até totalizar 100%."
    >
      <BeneficiaryList />
    </StepLayout>
  );
}