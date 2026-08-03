import "server-only";

import { createClient } from "@/lib/supabase/server";


export async function carregarFormularioProposta() {

  const supabase = await createClient();


  const [
    clientes,
    cotacoes,
    seguradoras,
    tiposSeguro,
  ] = await Promise.all([


    supabase
      .from("clientes")
      .select("id,nome")
      .order("nome"),


    supabase
      .from("cotacoes")
      .select("id")
      .order("created_at", {
        ascending:false,
      }),


    supabase
      .from("seguradoras")
      .select("id,nome")
      .order("nome"),


    supabase
      .from("tipos_seguro")
      .select("id,nome")
      .order("nome"),


  ]);


  return {

    clientes:
      clientes.data ?? [],

    cotacoes:
      cotacoes.data ?? [],

    seguradoras:
      seguradoras.data ?? [],

    tiposSeguro:
      tiposSeguro.data ?? [],

  };

}