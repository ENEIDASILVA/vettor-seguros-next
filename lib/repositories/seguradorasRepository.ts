import "server-only";

import { createClient } from "@/lib/supabase/server";

export type Seguradora = {
  id: number;
  nome: string;
  codigo: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

type SeguradoraRow = {
  id: number;
  nome: string;
  codigo: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

function mapearSeguradora(
  row: SeguradoraRow,
): Seguradora {
  return {
    id: Number(row.id),
    nome: row.nome,
    codigo: row.codigo,
    ativo: Boolean(row.ativo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listarSeguradoras(): Promise<
  Seguradora[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("seguradoras")
      .select(`
        id,
        nome,
        codigo,
        ativo,
        created_at,
        updated_at
      `)
      .order("nome", {
        ascending: true,
      });

  if (error) {
    throw new Error(
      `Não foi possível listar as seguradoras: ${error.message}`,
    );
  }

  return (data ?? []).map(
    (row) =>
      mapearSeguradora(
        row as SeguradoraRow,
      ),
  );
}

export async function buscarSeguradora(
  id: number,
): Promise<Seguradora | null> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("seguradoras")
      .select(`
        id,
        nome,
        codigo,
        ativo,
        created_at,
        updated_at
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw new Error(
      `Não foi possível buscar a seguradora: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearSeguradora(
    data as SeguradoraRow,
  );
}

export async function inserirSeguradora({
  nome,
  codigo,
}: {
  nome: string;
  codigo: string | null;
}): Promise<number> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("seguradoras")
      .insert({
        nome,
        codigo,
        ativo: true,
      })
      .select("id")
      .single();

  if (error) {
    if (
      error.code === "23505"
    ) {
      throw new Error(
        "Já existe uma seguradora com esse nome ou código.",
      );
    }

    throw new Error(
      `Não foi possível cadastrar a seguradora: ${error.message}`,
    );
  }

  return Number(data.id);
}

export async function atualizarSeguradora({
  id,
  nome,
  codigo,
}: {
  id: number;
  nome: string;
  codigo: string | null;
}): Promise<void> {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("seguradoras")
      .update({
        nome,
        codigo,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    if (
      error.code === "23505"
    ) {
      throw new Error(
        "Já existe uma seguradora com esse nome ou código.",
      );
    }

    throw new Error(
      `Não foi possível atualizar a seguradora: ${error.message}`,
    );
  }
}

export async function alterarStatusSeguradora({
  id,
  ativo,
}: {
  id: number;
  ativo: boolean;
}): Promise<void> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("seguradoras")
      .update({
        ativo,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, ativo",
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `Não foi possível alterar o status da seguradora: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "A seguradora não foi atualizada. O banco não permitiu a alteração ou nenhuma linha foi encontrada.",
    );
  }

  if (
    Boolean(data.ativo) !==
    ativo
  ) {
    throw new Error(
      "O status da seguradora não foi gravado corretamente.",
    );
  }
}

export async function seguradoraPossuiVinculos(
  id: number,
): Promise<boolean> {
  const supabase =
    await createClient();

  const [
    cotacoes,
    propostas,
    apolices,
  ] = await Promise.all([
    supabase
      .from("cotacoes_seguradoras")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "seguradora_id",
        id,
      ),

    supabase
      .from("propostas")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "seguradora_id",
        id,
      ),

    supabase
      .from("apolices")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "seguradora_id",
        id,
      ),
  ]);

  for (
    const resultado
    of [
      cotacoes,
      propostas,
      apolices,
    ]
  ) {
    if (resultado.error) {
      throw new Error(
        `Não foi possível verificar os vínculos da seguradora: ${resultado.error.message}`,
      );
    }
  }

  return (
    (cotacoes.count ?? 0) > 0 ||
    (propostas.count ?? 0) > 0 ||
    (apolices.count ?? 0) > 0
  );
}

export async function excluirSeguradora(
  id: number,
): Promise<void> {
  const possuiVinculos =
    await seguradoraPossuiVinculos(
      id,
    );

  if (possuiVinculos) {
    throw new Error(
      "Esta seguradora já possui vínculos no sistema e não pode ser excluída. Inative-a para manter o histórico.",
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("seguradoras")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível excluir a seguradora: ${error.message}`,
    );
  }
}
