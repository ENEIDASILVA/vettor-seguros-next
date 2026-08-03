"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function textoOuNull(valor: FormDataEntryValue | null) {
  const texto = String(valor ?? "").trim();

  return texto || null;
}

function numeroOuNull(valor: FormDataEntryValue | null) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const numero = Number(texto);

  return Number.isFinite(numero) ? numero : null;
}

function dadosFormulario(formData: FormData) {
  return {

    proposta_id: textoOuNull(
      formData.get("proposta_id")
    ),

    cliente_id: String(
      formData.get("cliente_id") ?? ""
    ),

    cotacao_id: textoOuNull(
      formData.get("cotacao_id")
    ),

    seguradora_id: Number(
      formData.get("seguradora_id")
    ),

    tipo_seguro_id: Number(
      formData.get("tipo_seguro_id")
    ),

    numero_apolice: String(
      formData.get("numero_apolice") ?? "",
    ).trim(),

    inicio_vigencia: String(
      formData.get("inicio_vigencia") ?? "",
    ),

    fim_vigencia: String(
      formData.get("fim_vigencia") ?? "",
    ),

    premio_liquido: numeroOuNull(
      formData.get("premio_liquido"),
    ),

    premio_total: numeroOuNull(
      formData.get("premio_total"),
    ),

    comissao_percentual: numeroOuNull(
      formData.get("comissao_percentual"),
    ),

    comissao_valor: numeroOuNull(
      formData.get("comissao_valor"),
    ),

    status: String(formData.get("status") ?? "Ativa"),

    observacoes: textoOuNull(
      formData.get("observacoes"),
    ),

    updated_at: new Date().toISOString(),
  };
}

export async function salvarApolice(
  formData: FormData,
) {
  const supabase = await createClient();

  const dados = dadosFormulario(formData);
  if (dados.proposta_id) {

  const { data: existente, error: erroConsulta } =
    await supabase
      .from("apolices")
      .select("id")
      .eq(
        "proposta_id",
        dados.proposta_id,
      )
      .maybeSingle();

  if (erroConsulta) {
    throw new Error(
      `Não foi possível verificar a proposta: ${erroConsulta.message}`,
    );
  }

  if (existente) {
    throw new Error(
      "Esta proposta já possui uma apólice emitida."
    );
  }

}

  const { data: apoliceCriada, error } =
  await supabase
    .from("apolices")
    .insert(dados)
    .select()
    .single();

if (error) {
  throw new Error(
    `Não foi possível salvar a apólice: ${error.message}`,
  );
}

if (dados.proposta_id) {

  const { error: erroProposta } =
    await supabase
      .from("propostas")
      .update({
        status: "Emitida",
      })
      .eq(
        "id",
        dados.proposta_id,
      );

  if (erroProposta) {
    throw new Error(
      `Apólice criada, porém não foi possível atualizar a proposta: ${erroProposta.message}`,
    );
  }
}

  revalidatePath("/admin");
  revalidatePath("/admin/apolices");

  redirect("/admin/apolices");
}

export async function atualizarApolice(
  id: string,
  formData: FormData,
) {
  if (!id) {
    throw new Error("Apólice inválida.");
  }

  const supabase = await createClient();

  const dados = dadosFormulario(formData);

  const { error } = await supabase
    .from("apolices")
    .update(dados)
    .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível atualizar a apólice: ${error.message}`,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/apolices");
  revalidatePath(`/admin/apolices/${id}`);
  revalidatePath(`/admin/apolices/${id}/editar`);

  redirect(`/admin/apolices/${id}`);
}

export async function excluirApolice(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("apolices")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível excluir a apólice: ${error.message}`,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/apolices");

  redirect("/admin/apolices");
}