"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuoteForm } from "../hooks/useQuoteForm";

type QuoteContextData = ReturnType<typeof useQuoteForm>;

const QuoteContext = createContext<QuoteContextData | null>(null);

interface Props {
  children: ReactNode;
  value: QuoteContextData;
}

export function QuoteProvider({ children, value }: Props) {
  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error("useQuote deve ser usado dentro de QuoteProvider.");
  }

  return context;
}