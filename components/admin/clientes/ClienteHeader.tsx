import Link from "next/link";
import {
  ArrowLeft,
  FilePlus2,
  Pencil,
  UserRoundX,
} from "lucide-react";

type Cliente = {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string;
  email: string | null;
  ativo: boolean;
};

type ClienteHeaderProps = {
  cliente: Cliente;
};

function valorOuTraco(valor: string | null) {
  return valor?.trim() || "Não informado";
}

export default function ClienteHeader({
  cliente,
}: ClienteHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/admin/clientes"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0A2F5A]"
          >
            <ArrowLeft size={18} />
            Voltar para clientes
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/admin/clientes/${cliente.id}/editar`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Pencil size={18} />
              Editar
            </Link>

            <Link
              href={`/admin/cotacoes/nova?cliente=${cliente.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A2F5A] px-4 py-2.5 font-semibold text-white transition hover:bg-[#082648]"
            >
              <FilePlus2 size={18} />
              Nova cotação
            </Link>

            {cliente.ativo && (
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-700 transition hover:bg-red-100"
              >
                <UserRoundX size={18} />
                Inativar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {cliente.nome}
              </h1>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  cliente.ativo
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {cliente.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Ficha completa do cliente
            </p>
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-3 lg:min-w-[620px]">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="font-semibold text-slate-500">
                CPF
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                {valorOuTraco(cliente.cpf)}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="font-semibold text-slate-500">
                Telefone
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                {cliente.telefone}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="font-semibold text-slate-500">
                E-mail
              </dt>

              <dd className="mt-1 break-words font-medium text-slate-900">
                {valorOuTraco(cliente.email)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}