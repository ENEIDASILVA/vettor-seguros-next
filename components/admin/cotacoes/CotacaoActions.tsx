import Link from "next/link";

import {
  SquarePen,
} from "lucide-react";

type Props = {
  id: string;
};

export default function CotacaoActions({
  id,
}: Props) {
  return (
    <div className="flex items-center justify-center">

      <Link
        href={`/admin/cotacoes/${id}`}
        title="Abrir cotação"
        aria-label="Abrir cotação"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          text-[#0A2F5A]
          transition
          hover:bg-blue-50
          hover:text-blue-700
        "
      >
        <SquarePen
          size={18}
        />
      </Link>

    </div>
  );
}