export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function searchCep(
  cep: string
): Promise<CepResponse | null> {
  const numbers = cep.replace(/\D/g, "");

  if (numbers.length !== 8) {
    return null;
  }

  try {
    const url =
      "https://viacep.com.br/ws/" +
      numbers +
      "/json/";

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as CepResponse;

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao consultar o CEP:", error);
    return null;
  }
}