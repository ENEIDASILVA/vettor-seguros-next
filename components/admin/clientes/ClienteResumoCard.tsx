import {
  ClipboardList,
  FileText,
  DollarSign,
  CalendarDays,
} from "lucide-react";

type Props = {
  cotacoes?: number;
  apolices?: number;
  premioTotal?: number;
  ultimoContato?: string | null;
};

type ItemProps = {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
};

function Item({ titulo, valor, icone }: ItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
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
        </div>
      </div>
    </div>
  );
}

export default function ClienteResumoCard({
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
      />

      <Item
        titulo="Apólices"
        valor={String(apolices)}
        icone={<FileText size={20} />}
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