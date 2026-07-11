"use client";

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

export default function QuoteWizard() {
  const quoteForm = useQuoteForm();
  const { form } = quoteForm;

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

  function sendQuote() {
    const message = formatWhatsAppMessage(form);
    const link = createWhatsAppLink(message);

    window.open(link, "_blank");
  }

  const canGoNext = canProceed(step, form);

  return (
    <QuoteProvider value={quoteForm}>
      <section
        id="cotacao"
        className="bg-[#F5F7FA] px-4 py-16 sm:px-6 sm:py-24"
      >
        <Container>
          <Card
            hover={false}
            className="mx-auto max-w-4xl p-5 sm:p-10"
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
              onNext={isLastStep ? sendQuote : next}
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