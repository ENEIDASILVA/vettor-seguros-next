import StepInsurance from "./common/StepInsurance";
import StepPersonal from "./common/StepPersonal";

import StepVehicle from "./auto/StepVehicle";
import StepDriver from "./auto/StepDriver";
import StepHistory from "./auto/StepHistory";
import StepCoverageAuto from "./auto/StepCoverage";
import StepReviewAuto from "./auto/StepReview";

import StepProperty from "./residential/StepProperty";
import StepResidence from "./residential/StepResidence";
import StepCoverageResidential from "./residential/StepCoverage";
import StepReviewResidential from "./residential/StepReview";
import StepResidentialStart from "./residential/StepResidentialStart";

import StepLifeProfile from "./life/StepLifeProfile";
import StepLifeRisk from "./life/StepLifeRisk";
import StepLifeCoverage from "./life/StepLifeCoverage";
import StepBeneficiaries from "./life/StepBeneficiaries";
import StepReviewLife from "./life/StepReviewLife";
import StepProductDetails from "./other/StepProductDetails";
import StepProductNeeds from "./other/StepProductNeeds";
import StepProductCoverage from "./other/StepProductCoverage";
import StepProductReview from "./other/StepProductReview";

import { useQuote } from "./context/QuoteContext";

interface FlowRendererProps {
  step: number;
  goToStep: (stepNumber: number) => void;
}

export default function FlowRenderer({
  step,
  goToStep,
}: FlowRendererProps) {
  const { form, updateInsurance } = useQuote();

  if (form.insuranceType === "" || step === 1) {
    return (
      <StepInsurance
        value={form.insuranceType}
        onSelect={updateInsurance}
      />
    );
  }

  if (form.insuranceType === "Seguro Auto") {
    if (step === 2) {
      return <StepPersonal />;
    }

    if (step === 3) {
      return <StepVehicle />;
    }

    if (step === 4) {
      return <StepDriver />;
    }

    if (step === 5) {
      return <StepHistory />;
    }

    if (step === 6) {
      return <StepCoverageAuto />;
    }

    if (step === 7) {
      return (
        <StepReviewAuto
          onEdit={goToStep}
        />
      );
    }
  }

  if (form.insuranceType === "Seguro Residencial") {
    if (step === 2) {
      return <StepResidentialStart />;
    }

    if (step === 3) {
      return <StepProperty />;
    }

    if (step === 4) {
      return <StepResidence />;
    }

    if (step === 5) {
      return <StepCoverageResidential />;
    }

    if (step === 6) {
      return (
        <StepReviewResidential
          onEdit={goToStep}
        />
      );
    }
  }

  if (form.insuranceType === "Seguro de Vida") {
    if (step === 2) {
      return <StepPersonal />;
    }

    if (step === 3) {
      return <StepLifeProfile />;
    }

    if (step === 4) {
      return <StepLifeRisk />;
    }

    if (step === 5) {
      return <StepLifeCoverage />;
    }

    if (step === 6) {
      return <StepBeneficiaries />;
    }

    if (step === 7) {
      return (
        <StepReviewLife
          onEdit={goToStep}
        />
      );
    }
  }

  if (
    form.insuranceType === "Seguro Empresarial" ||
    form.insuranceType === "Seguro Saúde" ||
    form.insuranceType === "Seguro Rural" ||
    form.insuranceType === "Seguro Viagem"
  ) {
    if (step === 2) return <StepPersonal />;
    if (step === 3) return <StepProductDetails />;
    if (step === 4) return <StepProductNeeds />;
    if (step === 5) return <StepProductCoverage />;
    if (step === 6) return <StepProductReview onEdit={goToStep} />;
  }

  return null;
}
