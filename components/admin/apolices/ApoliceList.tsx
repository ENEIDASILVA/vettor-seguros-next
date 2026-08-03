"use client";

import { useMemo, useState } from "react";

import ApoliceFilters from "./ApoliceFilters";
import ApoliceTable from "./ApoliceTable";

import type { ApoliceLista } from "@/lib/repositories/apolicesRepository";

type Props = {
  apolices: ApoliceLista[];
};

export default function ApoliceList({
  apolices,
}: Props) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");


  const apolicesFiltradas = useMemo(() => {
    const texto = busca
      .toLowerCase()
      .trim();


    return apolices.filter((apolice) => {

      const correspondeBusca =
        !texto ||
        apolice.cliente
          .toLowerCase()
          .includes(texto) ||
        apolice.seguradora
          .toLowerCase()
          .includes(texto) ||
        apolice.numeroApolice
          .toLowerCase()
          .includes(texto);


      if (!correspondeBusca) {
        return false;
      }


      const hoje = new Date();

      const vencimento =
        new Date(apolice.fimVigencia);


      const dias =
        Math.ceil(
          (
            vencimento.getTime() -
            hoje.getTime()
          ) /
          (1000 * 60 * 60 * 24)
        );


      if (filtro === "ativa") {
        return dias > 30;
      }


      if (filtro === "vencendo") {
        return dias >= 0 && dias <= 30;
      }


      if (filtro === "vencida") {
        return dias < 0;
      }


      return true;
    });

  }, [
    apolices,
    busca,
    filtro,
  ]);


  return (
    <div className="space-y-6">

      <ApoliceFilters
        busca={busca}
        setBusca={setBusca}
        filtro={filtro}
        setFiltro={setFiltro}
      />


      <ApoliceTable
        apolices={apolicesFiltradas}
      />

    </div>
  );
}