import {
  House,
  MapPin,
  Building2,
  Hash,
} from "lucide-react";

type Cliente = {
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
};

type Props = {
  cliente: Cliente;
};

function valorOuTraco(valor: string | null) {
  return valor?.trim() || "Não informado";
}

type ItemProps = {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
};

function Item({ titulo, valor, icone }: ItemProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0A2F5A] shadow-sm">
        {icone}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500">
          {titulo}
        </p>

        <p className="mt-1 font-medium text-slate-900">
          {valor}
        </p>
      </div>
    </div>
  );
}

export default function ClienteEnderecoCard({
  cliente,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Endereço
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Informações de localização do cliente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Item
          titulo="CEP"
          valor={valorOuTraco(cliente.cep)}
          icone={<MapPin size={20} />}
        />

        <Item
          titulo="Endereço"
          valor={valorOuTraco(cliente.endereco)}
          icone={<House size={20} />}
        />

        <Item
          titulo="Número"
          valor={valorOuTraco(cliente.numero)}
          icone={<Hash size={20} />}
        />

        <Item
          titulo="Complemento"
          valor={valorOuTraco(cliente.complemento)}
          icone={<Building2 size={20} />}
        />

        <Item
          titulo="Bairro"
          valor={valorOuTraco(cliente.bairro)}
          icone={<MapPin size={20} />}
        />

        <Item
          titulo="Cidade / UF"
          valor={`${valorOuTraco(cliente.cidade)}${
            cliente.uf ? ` - ${cliente.uf}` : ""
          }`}
          icone={<Building2 size={20} />}
        />
      </div>
    </section>
  );
}