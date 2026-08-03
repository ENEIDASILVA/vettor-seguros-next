import Link from "next/link";
import {
  Eye,
  MessageCircle,
  Pencil,
} from "lucide-react";
import InativarClienteButton from "./InativarClienteButton";
import { Cliente } from "@/lib/repositories/clientesRepository";
import ReativarClienteButton from "./ReativarClienteButton";

type Props = {
  cliente: Cliente;
};

export default function ClienteActions({
  cliente,
}: Props) {
  return (
    <div className="flex justify-center gap-3">

      <Link
        href={`/admin/clientes/${cliente.id}`}
        title="Visualizar"
        className="text-slate-600 transition hover:text-blue-600"
      >
        <Eye size={18} />
      </Link>

      <Link
        href={`/admin/clientes/${cliente.id}/editar`}
        title="Editar"
        className="text-slate-600 transition hover:text-amber-600"
      >
        <Pencil size={18} />
      </Link>

      <a
        href={`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        title="WhatsApp"
        className="text-slate-600 transition hover:text-green-600"
      >
        <MessageCircle size={18} />
      </a>

     {cliente.ativo ? (
  <InativarClienteButton
    id={cliente.id}
    nome={cliente.nome}
  />
) : (
  <ReativarClienteButton
    id={cliente.id}
    nome={cliente.nome}
  />
)}

    </div>
  );
}