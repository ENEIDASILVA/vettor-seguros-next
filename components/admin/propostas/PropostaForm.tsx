"use client";

import { useState } from "react";

import {
  salvarProposta,
} from "@/app/admin/actions/propostas";


type Props = {
  clientes: {
    id: string;
    nome: string;
  }[];

  cotacoes: {
    id: string;
  }[];

  seguradoras: {
    id: number;
    nome: string;
  }[];

  tiposSeguro: {
    id: number;
    nome: string;
  }[];
};


function formatarMoeda(valor: string) {

  const numero =
    valor.replace(/\D/g, "");


  if (!numero) {

    return "R$ 0,00";

  }


  return (
    Number(numero) / 100
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

}



export default function PropostaForm({

  clientes,
  cotacoes,
  seguradoras,
  tiposSeguro,

}: Props) {


  const [premioLiquido,setPremioLiquido] =
    useState("R$ 0,00");


  const [percentual,setPercentual] =
    useState("");


  const premio =
    Number(
      premioLiquido.replace(/\D/g,"")
    ) / 100;


  const comissao =
    premio *
    Number(percentual || 0)
    /
    100;



  return (

    <form
      action={salvarProposta}
      className="space-y-6"
    >


      <select
        name="cliente_id"
        className="w-full rounded-lg border p-3"
      >

        <option value="">
          Selecione o cliente
        </option>


        {clientes.map(cliente => (

          <option
            key={cliente.id}
            value={cliente.id}
          >
            {cliente.nome}
          </option>

        ))}


      </select>




      <select
        name="cotacao_id"
        className="w-full rounded-lg border p-3"
      >

        <option value="">
          Selecione a cotação
        </option>


        {cotacoes.map(cotacao => (

          <option
            key={cotacao.id}
            value={cotacao.id}
          >
            {cotacao.id}
          </option>

        ))}


      </select>




      <select
        name="seguradora_id"
        className="w-full rounded-lg border p-3"
      >

        <option value="">
          Selecione a seguradora
        </option>


        {seguradoras.map(seg => (

          <option
            key={seg.id}
            value={seg.id}
          >
            {seg.nome}
          </option>

        ))}

      </select>




      <select
        name="tipo_seguro_id"
        className="w-full rounded-lg border p-3"
      >

        <option value="">
          Selecione o seguro
        </option>


        {tiposSeguro.map(tipo => (

          <option
            key={tipo.id}
            value={tipo.id}
          >
            {tipo.nome}
          </option>

        ))}

      </select>



      <input
        name="numero_proposta"
        placeholder="Número da proposta da seguradora"
        className="w-full rounded-lg border p-3"
      />



      <input
        name="premio_liquido"
        value={premioLiquido}
        onChange={(e)=>
          setPremioLiquido(
            formatarMoeda(
              e.target.value
            )
          )
        }
        className="w-full rounded-lg border p-3"
        placeholder="Prêmio líquido"
      />



      <input
        name="comissao_percentual"
        value={percentual}
        onChange={(e)=>
          setPercentual(e.target.value)
        }
        className="w-full rounded-lg border p-3"
        placeholder="Comissão %"
      />



      <input
        readOnly
        value={
          comissao.toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL",
            }
          )
        }
        className="w-full rounded-lg border bg-slate-100 p-3"
      />



      <button
        className="
        rounded-lg
        bg-blue-900
        px-6
        py-3
        text-white
        "
      >
        Salvar Proposta
      </button>


    </form>

  );

}