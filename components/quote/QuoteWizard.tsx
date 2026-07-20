"use client";

import {
  useEffect,
  useRef,
} from "react";

import Card from "../ui/Card";
import Container from "../ui/Container";

import ProgressBar from "./ProgressBar";
import Navigation from "./Navigation";
import FlowRenderer from "./FlowRenderer";

import { canProceed } from "./services/validators";
import { formatWhatsAppMessage } from "./services/formatter";
import { createWhatsAppLink } from "./services/whatsapp";
import { getFlow } from "./services/getFlow";

import { useQuoteForm } from "./hooks/useQuoteForm";
import { useQuoteNavigation } from "./hooks/useQuoteNavigation";
import { QuoteProvider } from "./context/QuoteContext";

import { InsuranceType } from "./types";

interface StartQuoteEventDetail {
  insuranceType: InsuranceType;
}

export default function QuoteWizard() {
  const quoteForm = useQuoteForm();

  const {
    form,
    updateInsurance,
  } = quoteForm;

  const flow = getFlow(form.insuranceType);
  const totalSteps = flow.length;

  const {
    step,
    next,
    back,
    goToStep,
    isFirstStep,
    isLastStep,
  } = useQuoteNavigation({
    totalSteps,
  });

  const goToStepRef = useRef(goToStep);

  useEffect(() => {
    goToStepRef.current = goToStep;
  }, [goToStep]);

  useEffect(() => {
    function handleStartQuote(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<StartQuoteEventDetail>;

      const insuranceType =
        customEvent.detail?.insuranceType;

      if (!insuranceType) {
        return;
      }

      updateInsurance(insuranceType);

      goToStepRef.current(2);
    }

    window.addEventListener(
      "vettor:start-quote",
      handleStartQuote
    );

    return () => {
      window.removeEventListener(
        "vettor:start-quote",
        handleStartQuote
      );
    };
  }, [updateInsurance]);

  function sendQuote() {
    const message =
      formatWhatsAppMessage(form);

    const link =
      createWhatsAppLink(message);

    window.open(link, "_blank");
  }

  const canGoNext =
    canProceed(step, form);

  return (
    <QuoteProvider value={quoteForm}>
      <section
        id="cotacao"
        className="scroll-mt-24 bg-white px-4 py-20 sm:px-6"
      >
        <Container>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#0B2E6D]">
              Cotação Online
            </span>

            <h2 className="mt-5 text-3xl font-bold text-[#0B2E6D] sm:text-4xl">
              Sua cotação começa aqui
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600">
              Escolha o seguro que você procura e informe seus dados.
              A Vettor Seguros analisará sua solicitação para buscar
              as opções mais adequadas ao seu perfil.
            </p>
          </div>

          <Card
            hover={false}
            className="mx-auto max-w-4xl border border-gray-100 p-5 shadow-xl sm:p-10"
          >
            <ProgressBar
              step={step}
              totalSteps={totalSteps}
              flow={flow}
            />

            <FlowRenderer
              step={step}
              goToStep={goToStep}
            />

            <Navigation
              canGoBack={!isFirstStep}
              canGoNext={canGoNext}
              onBack={back}
              onNext={
                isLastStep
                  ? sendQuote
                  : next
              }
              nextLabel={
                isLastStep
                  ? "Enviar Cotação"
                  : "Próximo"
              }
            />
          </Card>
        </Container>
      </section>
    </QuoteProvider>
  );
}