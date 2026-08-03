import "server-only";

import { createClient } from "@/lib/supabase/server";

export type Cliente = {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string;
  email: string | null;
  data_nascimento: string | null;
  estado_civil: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  observacoes: string | null;
  ativo: boolean;
  inativado_em: string | null;
  created_at: string;
  updated_at: string;
};

export type NovoCliente = {
  nome: string;
  cpf: string | null;
  telefone: string;
  email: string | null;
  data_nascimento: string | null;
  estado_civil: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  observacoes: string | null;
};

export type AtualizarCliente = Omit<NovoCliente, "cpf">;

export async function listarClientes(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  const termo = search?.trim().replaceAll(",", " ");

  if (termo) {
    query = query.or(
      [
        `nome.ilike.%${termo}%`,
        `cpf.ilike.%${termo}%`,
        `telefone.ilike.%${termo}%`,
        `email.ilike.%${termo}%`,
      ].join(",")
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Não foi possível listar os clientes: ${error.message}`);
  }

  return (data ?? []) as Cliente[];
}

export async function buscarCliente(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível buscar o cliente: ${error.message}`);
  }

  return data as Cliente | null;
}

export async function inserirCliente(dados: NovoCliente) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .insert(dados)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe um cliente cadastrado com este CPF.");
    }

    throw new Error(`Não foi possível cadastrar o cliente: ${error.message}`);
  }

  return data.id as string;
}

export async function atualizarCliente(
  id: string,
  dados: AtualizarCliente
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clientes")
    .update(dados)
    .eq("id", id)
    .eq("ativo", true);

  if (error) {
    throw new Error(`Não foi possível atualizar o cliente: ${error.message}`);
  }
}

export async function inativarCliente(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clientes")
    .update({
      ativo: false,
      inativado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível inativar o cliente: ${error.message}`
    );
  }
}

export async function reativarCliente(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clientes")
    .update({
      ativo: true,
      inativado_em: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível reativar o cliente: ${error.message}`
    );
  }
}