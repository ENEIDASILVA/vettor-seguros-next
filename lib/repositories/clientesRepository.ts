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
  produtosVigentes: string[];
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

  const hoje = new Date();
  const dataHoje = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  const [
    clientesResponse,
    apolicesResponse,
  ] = await Promise.all([
    query,
    supabase
      .from("apolices")
      .select(`
        cliente_id,
        inicio_vigencia,
        fim_vigencia,
        status,
        tipo_seguro:tipos_seguro!apolices_tipo_seguro_id_fkey(nome)
      `)
      .lte("inicio_vigencia", dataHoje)
      .gte("fim_vigencia", dataHoje),
  ]);

  if (clientesResponse.error) {
    throw new Error(
      `Não foi possível listar os clientes: ${clientesResponse.error.message}`
    );
  }

  if (apolicesResponse.error) {
    throw new Error(
      `Não foi possível consultar os produtos vigentes dos clientes: ${apolicesResponse.error.message}`
    );
  }

  const produtosPorCliente = new Map<
    string,
    Set<string>
  >();

  for (const item of apolicesResponse.data ?? []) {
    const relacionamento =
      item.tipo_seguro as
        | { nome?: string | null }
        | { nome?: string | null }[]
        | null;

    const nomeProduto =
      Array.isArray(relacionamento)
        ? relacionamento[0]?.nome
        : relacionamento?.nome;

    if (!nomeProduto) {
      continue;
    }

    const produtos =
      produtosPorCliente.get(
        item.cliente_id
      ) ?? new Set<string>();

    produtos.add(nomeProduto);

    produtosPorCliente.set(
      item.cliente_id,
      produtos
    );
  }

  return (clientesResponse.data ?? []).map(
    (cliente) => ({
      ...cliente,
      produtosVigentes:
        Array.from(
          produtosPorCliente.get(
            cliente.id
          ) ?? []
        ).sort((a, b) =>
          a.localeCompare(
            b,
            "pt-BR",
            {
              sensitivity: "base",
            }
          )
        ),
    })
  ) as Cliente[];
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

  if (!data) {
    return null;
  }

  return {
    ...data,
    produtosVigentes: [],
  } as Cliente;
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