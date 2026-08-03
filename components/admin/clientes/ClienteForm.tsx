"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Save } from "lucide-react";

import { criarClienteAction } from "@/app/admin/actions/clientes";
import { type Cliente } from "@/lib/repositories/clientesRepository";


function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function mascaraCpf(valor: string) {
  return somenteNumeros(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor: string) {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function mascaraCep(valor: string) {
  return somenteNumeros(valor)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function validarCpf(valor: string) {
  const cpf = somenteNumeros(valor);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let indice = 0; indice < 9; indice += 1) {
    soma += Number(cpf[indice]) * (10 - indice);
  }

  let primeiroDigito = (soma * 10) % 11;

  if (primeiroDigito === 10) {
    primeiroDigito = 0;
  }

  if (primeiroDigito !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let indice = 0; indice < 10; indice += 1) {
    soma += Number(cpf[indice]) * (11 - indice);
  }

  let segundoDigito = (soma * 10) % 11;

  if (segundoDigito === 10) {
    segundoDigito = 0;
  }

  return segundoDigito === Number(cpf[10]);
}

function validarDataNascimento(valor: string) {
  if (!valor) {
    return true;
  }

  const partes = valor.split("-");

  if (partes.length !== 3) {
    return false;
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);

  const dataValida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!dataValida) {
    return false;
  }

  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  if (data > hoje) {
    return false;
  }

  const anoMinimo = hoje.getFullYear() - 120;

  return ano >= anoMinimo;
}

function obterDataMaxima() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function BotaoSalvar({
  label,
}: {
  label: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A2F5A] px-6 py-3 font-semibold text-white transition hover:bg-[#082648] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle size={18} className="animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <Save size={18} />
          {label}
        </>
      )}
    </button>
  );
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10";

const inputErrorClassName =
  "border-red-400 focus:border-red-500 focus:ring-red-500/10";

type ClienteFormProps = {
  cliente?: Cliente;
  action?: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
  cancelHref?: string;
  readOnlyCpf?: boolean;
};


export default function ClienteForm({
  cliente,
  action = criarClienteAction,
  submitLabel = "Salvar cliente",
  cancelHref = "/admin/clientes",
  readOnlyCpf = false,
}: ClienteFormProps) {
  const [cpf, setCpf] = useState(cliente?.cpf ?? "");
  const [erroCpf, setErroCpf] = useState("");

  const [dataNascimento, setDataNascimento] = useState(
  cliente?.data_nascimento ?? ""
);
  const [erroDataNascimento, setErroDataNascimento] =
    useState("");

  const [telefone, setTelefone] = useState(
  cliente?.telefone ?? ""
);

  const [cep, setCep] = useState(cliente?.cep ?? "");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  const [endereco, setEndereco] = useState(
  cliente?.endereco ?? ""
);
  const [bairro, setBairro] = useState(
  cliente?.bairro ?? ""
);
  const [cidade, setCidade] = useState(
  cliente?.cidade ?? ""
);
  const [uf, setUf] = useState(
  cliente?.uf ?? ""
);

  useEffect(() => {
    const numeros = somenteNumeros(cep);

    if (numeros.length !== 8) {
      return;
    }

    let consultaCancelada = false;

    async function buscarCep() {
      setBuscandoCep(true);
      setErroCep("");

      try {
        const resposta = await fetch(
          `https://viacep.com.br/ws/${numeros}/json/`
        );

        if (!resposta.ok) {
          throw new Error("Falha ao consultar o CEP.");
        }

        const dados = await resposta.json();

        if (consultaCancelada) {
          return;
        }

        if (dados.erro) {
          setErroCep("CEP não encontrado.");
          return;
        }

        setEndereco(dados.logradouro ?? "");
        setBairro(dados.bairro ?? "");
        setCidade(dados.localidade ?? "");
        setUf(dados.uf ?? "");
      } catch {
        if (!consultaCancelada) {
          setErroCep(
            "Não foi possível consultar o CEP. Preencha o endereço manualmente."
          );
        }
      } finally {
        if (!consultaCancelada) {
          setBuscandoCep(false);
        }
      }
    }

    buscarCep();

    return () => {
      consultaCancelada = true;
    };
  }, [cep]);

  function alterarCpf(event: ChangeEvent<HTMLInputElement>) {
    const valorFormatado = mascaraCpf(event.target.value);

    setCpf(valorFormatado);
    setErroCpf("");

    const numeros = somenteNumeros(valorFormatado);

    if (numeros.length === 11 && !validarCpf(valorFormatado)) {
      setErroCpf("Informe um CPF válido.");
    }
  }

  function validarCpfAoSair() {
    if (!cpf) {
      setErroCpf("");
      return;
    }

    if (!validarCpf(cpf)) {
      setErroCpf("Informe um CPF válido.");
      return;
    }

    setErroCpf("");
  }

  function alterarDataNascimento(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const valor = event.target.value;

    setDataNascimento(valor);
    setErroDataNascimento("");

    if (valor && !validarDataNascimento(valor)) {
      setErroDataNascimento(
        "Informe uma data de nascimento válida."
      );
    }
  }

  function alterarTelefone(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setTelefone(mascaraTelefone(event.target.value));
  }

  function alterarCep(event: ChangeEvent<HTMLInputElement>) {
    const valorFormatado = mascaraCep(event.target.value);

    setCep(valorFormatado);
    setErroCep("");

    if (somenteNumeros(valorFormatado).length < 8) {
      setEndereco("");
      setBairro("");
      setCidade("");
      setUf("");
    }
  }

  function validarFormulario(event: FormEvent<HTMLFormElement>) {
    let formularioValido = true;

    if (cpf && !validarCpf(cpf)) {
      setErroCpf("Informe um CPF válido.");
      formularioValido = false;
    }

    if (
      dataNascimento &&
      !validarDataNascimento(dataNascimento)
    ) {
      setErroDataNascimento(
        "Informe uma data de nascimento válida."
      );
      formularioValido = false;
    }

    if (!formularioValido) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={action}
      onSubmit={validarFormulario}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Dados pessoais
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informe os dados principais do cliente.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              Nome completo *
            </span>

            <input
              name="nome"
              defaultValue={cliente?.nome ?? ""}
              type="text"
              required
              minLength={3}
              autoComplete="name"
              className={inputClassName}
              placeholder="Ex.: Maria da Silva"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">
              CPF
            </span>

            <input
              name="cpf"
              type="text"
              value={cpf}
              onChange={alterarCpf}
              onBlur={validarCpfAoSair}
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              readOnly={readOnlyCpf}
              aria-invalid={Boolean(erroCpf)}
              className={`${inputClassName} ${
                readOnlyCpf ? "bg-slate-100 cursor-not-allowed" : ""
               } ${
                erroCpf ? inputErrorClassName : ""
              }`}
              placeholder="000.000.000-00"
            />

            {erroCpf && (
              <p
                role="alert"
                className="mt-2 text-sm font-medium text-red-600"
              >
                {erroCpf}
              </p>
            )}
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">
              Data de nascimento
            </span>

            <input
              name="data_nascimento"
              type="date"
              value={dataNascimento}
              onChange={alterarDataNascimento}
              max={obterDataMaxima()}
              aria-invalid={Boolean(erroDataNascimento)}
              className={`${inputClassName} ${
                erroDataNascimento
                  ? inputErrorClassName
                  : ""
              }`}
            />

            {erroDataNascimento && (
              <p
                role="alert"
                className="mt-2 text-sm font-medium text-red-600"
              >
                {erroDataNascimento}
              </p>
            )}
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">
              Telefone *
            </span>

            <input
              name="telefone"
              type="tel"
              required
              value={telefone}
              onChange={alterarTelefone}
              inputMode="tel"
              autoComplete="tel"
              maxLength={15}
              className={inputClassName}
              placeholder="(31) 99999-9999"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">
              E-mail
            </span>

            <input
              name="email"
              defaultValue={cliente?.email ?? ""}
              type="email"
              autoComplete="email"
              className={inputClassName}
              placeholder="cliente@email.com"
            />
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">
              Estado civil
            </span>

            <select
              name="estado_civil"
              defaultValue={cliente?.estado_civil ?? ""}
              className={inputClassName}
            >
              <option value="">Selecione</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">
                Divorciado(a)
              </option>
              <option value="Viúvo(a)">Viúvo(a)</option>
              <option value="União estável">
                União estável
              </option>
              <option value="Outro">Outro</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Endereço
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Digite o CEP para preencher o endereço automaticamente.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-6">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              CEP
            </span>

            <div className="relative">
              <input
                name="cep"
                type="text"
                value={cep}
                onChange={alterarCep}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
                className={inputClassName}
                placeholder="00000-000"
              />

              {buscandoCep && (
                <LoaderCircle
                  size={18}
                  className="absolute right-4 top-1/2 mt-1 animate-spin text-slate-400"
                />
              )}
            </div>

            {erroCep && (
              <p className="mt-2 text-sm text-amber-700">
                {erroCep}
              </p>
            )}
          </label>

          <label className="md:col-span-4">
            <span className="text-sm font-semibold text-slate-700">
              Endereço
            </span>

            <input
              name="endereco"
              type="text"
              value={endereco}
              onChange={(event) =>
                setEndereco(event.target.value)
              }
              autoComplete="street-address"
              className={inputClassName}
              placeholder="Rua, avenida..."
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              Número
            </span>

            <input
                name="numero"
                type="text"
                defaultValue={cliente?.numero ?? ""}
                className={inputClassName}
                placeholder="123"
            />
          </label>

          <label className="md:col-span-4">
            <span className="text-sm font-semibold text-slate-700">
              Complemento
            </span>

            <input
                name="complemento"
                type="text"
                defaultValue={cliente?.complemento ?? ""}
                className={inputClassName}
                placeholder="Apartamento, bloco, referência..."
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              Bairro
            </span>

            <input
              name="bairro"
              type="text"
              value={bairro}
              onChange={(event) =>
                setBairro(event.target.value)
              }
              className={inputClassName}
            />
          </label>

          <label className="md:col-span-3">
            <span className="text-sm font-semibold text-slate-700">
              Cidade
            </span>

            <input
              name="cidade"
              type="text"
              value={cidade}
              onChange={(event) =>
                setCidade(event.target.value)
              }
              className={inputClassName}
            />
          </label>

          <label className="md:col-span-1">
            <span className="text-sm font-semibold text-slate-700">
              UF
            </span>

            <input
              name="uf"
              type="text"
              value={uf}
              onChange={(event) =>
                setUf(
                  event.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "")
                    .slice(0, 2)
                )
              }
              maxLength={2}
              className={inputClassName}
              placeholder="MG"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <label>
          <span className="text-sm font-semibold text-slate-700">
            Observações
          </span>

          <textarea
            name="observacoes"
            rows={5}
            defaultValue={cliente?.observacoes ?? ""}
            className={`${inputClassName} resize-y`}
            placeholder="Informações importantes sobre o cliente..."
            />
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <BotaoSalvar
  label={submitLabel}
/>
      </div>
    </form>
  );
}