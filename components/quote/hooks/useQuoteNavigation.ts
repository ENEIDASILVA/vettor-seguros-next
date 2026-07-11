import { useState } from "react";

interface UseQuoteNavigationProps {
  totalSteps: number;
}

export function useQuoteNavigation({
  totalSteps,
}: UseQuoteNavigationProps) {
  const [step, setStep] = useState(1);

  function next() {
    setStep((current) =>
      current < totalSteps ? current + 1 : current
    );
  }

  function back() {
    setStep((current) =>
      current > 1 ? current - 1 : current
    );
  }

  function goToStep(stepNumber: number) {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      setStep(stepNumber);
    }
  }

  function reset() {
    setStep(1);
  }

  return {
    step,
    next,
    back,
    goToStep,
    reset,
    isFirstStep: step === 1,
    isLastStep: step === totalSteps,
  };
}