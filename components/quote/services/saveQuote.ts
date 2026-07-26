import { QuoteFormData } from "../types";

type SaveQuoteResponse = {
  success: boolean;
  quoteId: string;
};

export async function saveQuote(
  form: QuoteFormData
): Promise<SaveQuoteResponse> {
  const response = await fetch(
    "/api/cotacoes",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(form),
    }
  );

  const data =
    (await response.json()) as {
      success?: boolean;
      quoteId?: string;
      error?: string;
    };

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Não foi possível salvar a cotação."
    );
  }

  if (!data.quoteId) {
    throw new Error(
      "A cotação foi processada sem retornar um identificador."
    );
  }

  return {
    success: true,
    quoteId: data.quoteId,
  };
}