"use client";


import {
  useState,
} from "react";


import {
  atualizarProposta,
} from "@/app/admin/actions/propostas";



type Props = {

  proposta:any;

  clientes:{
    id:string;
    nome:string;
  }[];

  seguradoras:{
    id:number;
    nome:string;
  }[];

  tiposSeguro:{
    id:number;
    nome:string;
  }[];

};




function formatarMoeda(valor:number|null){

  if(!valor){

    return "R$ 0,00";

  }


  return valor.toLocaleString(
    "pt-BR",
    {
      style:"currency",
      currency:"BRL",
    }
  );

}





export default function PropostaFormEdit({

  proposta,

  clientes,

  seguradoras,

  tiposSeguro,

}:Props){



  const [premioLiquido,setPremioLiquido] =
  useState(
    proposta.premioLiquido
      ? proposta.premioLiquido
          .toLocaleString(
            "pt-BR",
            {
              style:"currency",
              currency:"BRL",
            }
          )
      : ""
  );



  const [percentual,setPercentual] =
    useState(
      String(
        proposta.comissaoPercentual ?? ""
      )
    );




  const premioNumero =
  Number(
    premioLiquido
      .replace(/\D/g,"")
  ) / 100;




  const comissao =
    premioNumero *
    Number(percentual || 0)
    /
    100;




  return (



<form
  action={atualizarProposta}
  className="space-y-6"
>



<input
  type="hidden"
  name="id"
  value={proposta.id}
/>



<div>


<label>
Cliente
</label>


<select

name="cliente_id"

defaultValue={
  proposta.clienteId
}

className="
mt-2
w-full
rounded-lg
border
p-3
"

>


{clientes.map(cliente=>(


<option

key={cliente.id}

value={cliente.id}

>


{cliente.nome}


</option>


))}


</select>


</div>





<div>


<label>
Seguradora
</label>


<select

name="seguradora_id"

defaultValue={
  proposta.seguradoraId
}

className="
mt-2
w-full
rounded-lg
border
p-3
"

>


{seguradoras.map(seg=>(


<option

key={seg.id}

value={seg.id}

>


{seg.nome}


</option>


))}


</select>


</div>





<div>


<label>
Tipo de Seguro
</label>


<select

name="tipo_seguro_id"

defaultValue={
  proposta.tipoSeguroId
}

className="
mt-2
w-full
rounded-lg
border
p-3
"

>


{tiposSeguro.map(tipo=>(


<option

key={tipo.id}

value={tipo.id}

>


{tipo.nome}


</option>


))}


</select>


</div>





<div>


<label>
Número da Proposta
</label>


<input

name="numero_proposta"

defaultValue={
  proposta.numeroProposta
}

className="
mt-2
w-full
rounded-lg
border
p-3
"

/>


</div>






<div>


<label>
Prêmio Líquido
</label>


<input

name="premio_liquido"

value={premioLiquido}

onChange={(e)=>{

  const somenteNumeros =
    e.target.value.replace(/\D/g,"");


  const valor =
    somenteNumeros
      ? Number(somenteNumeros) / 100
      : 0;


  setPremioLiquido(

    somenteNumeros
      ? valor.toLocaleString(
          "pt-BR",
          {
            style:"currency",
            currency:"BRL",
          }
        )
      : ""

  );


}}



className="
mt-2
w-full
rounded-lg
border
p-3
"

/>


</div>






<div>


<label>
Comissão %
</label>


<input

name="comissao_percentual"

value={percentual}

onChange={(e)=>

setPercentual(
e.target.value
)

}

className="
mt-2
w-full
rounded-lg
border
p-3
"

/>


</div>






<div>


<label>
Comissão R$
</label>


<input

readOnly

value={

comissao.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
)

}

className="
mt-2
w-full
rounded-lg
border
bg-slate-100
p-3
"

/>


</div>






<div>


<label>
Status
</label>


<select

name="status"

defaultValue={
proposta.status
}

className="
mt-2
w-full
rounded-lg
border
p-3
"

>


<option>
Em análise
</option>


<option>
Aprovada
</option>


<option>
Recusada
</option>


</select>


</div>






<button

className="
rounded-lg
bg-blue-900
px-6
py-3
text-white
"

>


Salvar Alterações


</button>



</form>


  );

}