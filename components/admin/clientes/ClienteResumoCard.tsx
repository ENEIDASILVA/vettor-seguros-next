import Link from "next/link";

import {
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
} from "lucide-react";

type Props = {
  clienteId: string;
  cotacoes?: number;
  apolices?: number;
  premioTotal?: number;
  ultimoContato?: string | null;
};

type ItemProps = {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
  href?: string;
};

function Item({
  titulo,
  valor,
  icone,
  href,
}: ItemProps) {
  const conteudo = (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50 p-5 transition ${
        href
          ? "cursor-pointer hover:border-[#0A2F5A]/40 hover:bg-blue-50 hover:shadow-sm"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0A2F5A] shadow-sm">
          {icone}
        </div>

        <div>
          <p className="text-sm text-slate-500">
            {titulo}
          </p>

          <p className="text-xl font-bold text-slate-900">
            {valor}
          </p>

          {href && (
            <p className="mt-1 text-xs font-semibold text-[#0A2F5A]">
              Clique para consultar
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (!href) {
    return conteudo;
  }

  return (
    <Link
      href={href}
      className="block rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0A2F5A]/10"
    >
      {conteudo}
    </Link>
  );
}

export default function ClienteResumoCard({
  clienteId,
  cotacoes = 0,
  apolices = 0,
  premioTotal = 0,
  ultimoContato = null,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Item
        titulo="Cotações"
        valor={String(cotacoes)}
        icone={<ClipboardList size={20} />}
        href={`/admin/clientes/${clienteId}/cotacoes`}
      />

      <Item
        titulo="Apólices"
        valor={String(apolices)}
        icone={<FileText size={20} />}
        href={`/admin/clientes/${clienteId}/apolices`}
      />

      <Item
        titulo="Prêmio Total"
        valor={premioTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        icone={<DollarSign size={20} />}
      />

      <Item
        titulo="Último contato"
        valor={ultimoContato ?? "—"}
        icone={<CalendarDays size={20} />}
      />
    </section>
  );
}
