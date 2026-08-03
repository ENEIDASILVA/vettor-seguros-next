import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardUltimoCliente = {
  id: string;
  nome: string;
  telefone: string | null;
  cidade: string | null;
  created_at: string;
};

export async function obterUltimosClientes(): Promise<
  DashboardUltimoCliente[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .select(`
      id,
      nome,
      telefone,
      cidade,
      created_at
    `)
    .eq("ativo", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (error) {
    console.error(
      "Erro ao buscar últimos clientes:",
      error
    );

    throw new Error(
      `Erro ao buscar últimos clientes: ${
        error.message || "erro não informado"
      }`
    );
  }

  return data ?? [];
}