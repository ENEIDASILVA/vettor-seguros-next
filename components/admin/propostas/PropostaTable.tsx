import type {
  PropostaLista
} from "@/lib/repositories/propostasRepository";

import PropostaActions from "./PropostaActions";


type Props = {
  propostas: PropostaLista[];
};



function moeda(valor: number | null) {

  if (valor === null || valor === undefined) {
    return "R$ 0,00";
  }


  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

}




export default function PropostaTable({
  propostas,
}: Props) {


  if (propostas.length === 0) {

    return (

      <div
        className="
        rounded-xl
        border
        border-dashed
        border-slate-300
        p-10
        text-center
        "
      >

        Nenhuma proposta cadastrada.

      </div>

    );

  }



  return (

    <div
      className="
      w-full
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      "
    >


      <table
        className="
        w-full
        table-fixed
        "
      >


        <thead
          className="bg-slate-50"
        >

          <tr>


            <th
              className="
              w-[18%]
              px-4
              py-4
              text-left
              "
            >
              Cliente
            </th>


            <th
              className="
              w-[18%]
              px-4
              py-4
              text-left
              "
            >
              Seguradora
            </th>


            <th
              className="
              w-[15%]
              px-4
              py-4
              text-left
              "
            >
              Seguro
            </th>


            <th
              className="
              w-[15%]
              px-4
              py-4
              text-left
              "
            >
              Proposta
            </th>


            <th
              className="
              w-[12%]
              px-4
              py-4
              text-left
              "
            >
              Prêmio
            </th>


            <th
              className="
              w-[12%]
              px-4
              py-4
              text-left
              "
            >
              Status
            </th>


            <th
              className="
              w-[10%]
              px-4
              py-4
              text-center
              "
            >
              Ações
            </th>


          </tr>

        </thead>




        <tbody>


          {
            propostas.map((proposta) => (

              <tr
                key={proposta.id}
                className="
                border-t
                border-slate-100
                "
              >



                <td
                  className="
                  px-4
                  py-4
                  truncate
                  "
                >
                  {proposta.cliente}
                </td>



                <td
                  className="
                  px-4
                  py-4
                  truncate
                  "
                >
                  {proposta.seguradora}
                </td>



                <td
                  className="
                  px-4
                  py-4
                  truncate
                  "
                >
                  {proposta.tipoSeguro}
                </td>



                <td
                  className="
                  px-4
                  py-4
                  truncate
                  "
                >
                  {proposta.numeroProposta ?? "-"}
                </td>



                <td
                  className="
                  px-4
                  py-4
                  "
                >
                  {moeda(proposta.premioTotal)}
                </td>



                <td
                  className="
                  px-4
                  py-4
                  "
                >

                  <span
                    className="
                    inline-flex
                    rounded-full
                    bg-yellow-100
                    px-3
                    py-1
                    text-sm
                    text-yellow-700
                    "
                  >

                    {proposta.status}

                  </span>

                </td>



                <td
                  className="
                  px-4
                  py-4
                  "
                >


                  

                  <PropostaActions
                    id={proposta.id}
                    possuiApolice={proposta.possuiApolice}
                    apoliceId={proposta.apoliceId}
                  />

                </td>



              </tr>

            ))
          }


        </tbody>


      </table>


    </div>

  );

}