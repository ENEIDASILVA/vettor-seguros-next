import "server-only";

import {
  AtualizarCliente,
  NovoCliente,
  atualizarCliente,
  buscarCliente,
  inativarCliente,
  inserirCliente,
  listarClientes,
  reativarCliente,
} from "@/lib/repositories/clientesRepository";


function somenteNumeros(valor: string | null) {
  return valor?.replace(/\D/g, "") ?? "";
}

function validarCpf(cpf: string) {
  const numeros = somenteNumeros(cpf);

  if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i += 1) {
    soma += Number(numeros[i]) * (10 - i);
  }

  let primeiroDigito = (soma * 10) % 11;

  if (primeiroDigito === 10) {
    primeiroDigito = 0;
  }

  if (primeiroDigito !== Number(numeros[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i += 1) {
    soma += Number(numeros[i]) * (11 - i);
  }

  let segundoDigito = (soma * 10) % 11;

  if (segundoDigito === 10) {
    segundoDigito = 0;
  }

  return segundoDigito === Number(numeros[10]);
}

function validarDataNascimento(valor: string) {
  const data = new Date(`${valor}T12:00:00`);

  if (Number.isNaN(data.getTime())) {
    return false;
  }

  const hoje = new Date();

  if (data > hoje) {
    return false;
  }

  const anoMinimo = hoje.getFullYear() - 120;

  return data.getFullYear() >= anoMinimo;
}


function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizarTexto(valor: string | null) {
  const texto = valor?.trim();
  return texto ? texto : null;
}

function validarCliente(dados: NovoCliente) {
  if (dados.nome.trim().length < 3) {
    throw new Error("Informe o nome completo do cliente.");
  }

  const telefone = somenteNumeros(dados.telefone);

  if (telefone.length < 10 || telefone.length > 11) {
    throw new Error("Informe um telefone válido com DDD.");
  }

  if (dados.cpf && !validarCpf(dados.cpf)) {
    throw new Error("Informe um CPF válido.");
  }

  if (dados.email && !validarEmail(dados.email)) {
    throw new Error("Informe um e-mail válido.");
  }

  if (dados.uf && dados.uf.length !== 2) {
    throw new Error("Informe uma UF válida.");
  }

  if (
  dados.data_nascimento &&
  !validarDataNascimento(dados.data_nascimento)
) {
  throw new Error(
    "Informe uma data de nascimento válida."
  );
}
}

function normalizarCliente(dados: NovoCliente): NovoCliente {
  return {
    nome: dados.nome.trim(),
    cpf: dados.cpf ? somenteNumeros(dados.cpf) : null,
    telefone: somenteNumeros(dados.telefone),
    email: normalizarTexto(dados.email)?.toLowerCase() ?? null,
    data_nascimento: normalizarTexto(dados.data_nascimento),
    estado_civil: normalizarTexto(dados.estado_civil),
    cep: dados.cep ? somenteNumeros(dados.cep) : null,
    endereco: normalizarTexto(dados.endereco),
    numero: normalizarTexto(dados.numero),
    complemento: normalizarTexto(dados.complemento),
    bairro: normalizarTexto(dados.bairro),
    cidade: normalizarTexto(dados.cidade),
    uf: normalizarTexto(dados.uf)?.toUpperCase() ?? null,
    observacoes: normalizarTexto(dados.observacoes),
  };
}

export async function obterClientes(search?: string) {
  return listarClientes(search);
}

export async function obterCliente(id: string) {
  if (!id) {
    return null;
  }

  return buscarCliente(id);
}

export async function criarCliente(dados: NovoCliente) {
  const cliente = normalizarCliente(dados);

  validarCliente(cliente);

  return inserirCliente(cliente);
}

export async function editarCliente(
  id: string,
  dados: AtualizarCliente
) {
  const clienteNormalizado = normalizarCliente({
    ...dados,
    cpf: null,
  });

  validarCliente(clienteNormalizado);

  const { cpf: _cpf, ...dadosPermitidos } = clienteNormalizado;

  return atualizarCliente(id, dadosPermitidos);
}

export async function excluirCliente(id: string) {
  if (!id) {
    throw new Error("Cliente inválido.");
  }

  return inativarCliente(id);
}

export async function restaurarCliente(id: string) {
  if (!id) {
    throw new Error("Cliente inválido.");
  }

  return reativarCliente(id);
}