import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function obterDadosFormularioApolice() {
  const supabase = await createClient();

  const [
    clientes,
    cotacoes,
    seguradoras,
    tiposSeguro,
    propostasResponse,
  ] = await Promise.all([
    supabase
      .from("clientes")
      .select("id,nome")
      .order("nome"),

    supabase
      .from("cotacoes")
      .select("id")
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("seguradoras")
      .select("id,nome")
      .order("nome"),

    supabase
      .from("tipos_seguro")
      .select("id,nome")
      .order("nome"),

    supabase
      .from("propostas")
      .select(`
        id,
        numero_proposta,
        cliente:clientes(nome)
      `)
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (clientes.error) {
    throw new Error(
      `Erro ao carregar clientes: ${clientes.error.message}`,
    );
  }

  if (cotacoes.error) {
    throw new Error(
      `Erro ao carregar cotações: ${cotacoes.error.message}`,
    );
  }

  if (seguradoras.error) {
    throw new Error(
      `Erro ao carregar seguradoras: ${seguradoras.error.message}`,
    );
  }

  if (tiposSeguro.error) {
    throw new Error(
      `Erro ao carregar tipos de seguro: ${tiposSeguro.error.message}`,
    );
  }

  if (propostasResponse.error) {
    throw new Error(
      `Erro ao carregar propostas: ${propostasResponse.error.message}`,
    );
  }

  const propostas = (
    propostasResponse.data ?? []
  ).map((item: any) => {
    const cliente = Array.isArray(item.cliente)
      ? item.cliente[0]?.nome
      : item.cliente?.nome;

    return {
      id: item.id,
      numero_proposta:
        item.numero_proposta ?? null,
      cliente: cliente ?? "Cliente não informado",
    };
  });

  return {
    clientes: clientes.data ?? [],
    cotacoes: cotacoes.data ?? [],
    seguradoras: seguradoras.data ?? [],
    tiposSeguro: tiposSeguro.data ?? [],
    propostas,
  };
}