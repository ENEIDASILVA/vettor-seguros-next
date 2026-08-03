"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  criarCliente,
  editarCliente,
  excluirCliente,
  obterCliente,
  restaurarCliente,
} from "@/lib/services/clientesService";



function campo(formData: FormData, nome: string) {
  const valor = formData.get(nome);

  if (typeof valor !== "string") {
    return null;
  }

  const texto = valor.trim();

  return texto === "" ? null : texto;
}

function obterDadosCliente(formData: FormData) {
  return {
    nome: campo(formData, "nome") ?? "",
    cpf: campo(formData, "cpf"),
    telefone: campo(formData, "telefone") ?? "",
    email: campo(formData, "email"),

    data_nascimento: campo(formData, "data_nascimento"),
    estado_civil: campo(formData, "estado_civil"),

    cep: campo(formData, "cep"),
    endereco: campo(formData, "endereco"),
    numero: campo(formData, "numero"),
    complemento: campo(formData, "complemento"),
    bairro: campo(formData, "bairro"),
    cidade: campo(formData, "cidade"),
    uf: campo(formData, "uf"),

    observacoes: campo(formData, "observacoes"),
  };
}

export async function criarClienteAction(formData: FormData) {
  const id = await criarCliente(obterDadosCliente(formData));

  revalidatePath("/admin/clientes");

  redirect(`/admin/clientes/${id}`);
}

export async function editarClienteAction(
  id: string,
  formData: FormData
) {
  await editarCliente(id, obterDadosCliente(formData));

  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);
  revalidatePath(`/admin/clientes/${id}/editar`);

  redirect(`/admin/clientes/${id}`);
}

export async function inativarClienteAction(id: string) {
  await excluirCliente(id);

  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);

  redirect("/admin/clientes");
}

export async function reativarClienteAction(id: string) {
  await restaurarCliente(id);

  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);

  redirect("/admin/clientes");
}