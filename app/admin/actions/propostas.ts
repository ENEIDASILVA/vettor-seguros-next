"use server";

import { createClient } from "@/lib/supabase/server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";


export async function salvarProposta(
  formData: FormData
) {

  const supabase =
    await createClient();



  const premioLiquido =
    Number(
      String(
        formData.get("premio_liquido")
      )
      .replace(/\D/g,"")
    ) / 100;



  const percentual =
    Number(
      formData.get(
        "comissao_percentual"
      )
    );



  const comissao =
    premioLiquido *
    percentual /
    100;



  const { error } =
    await supabase
      .from("propostas")
      .insert({

        cliente_id:
          formData.get(
            "cliente_id"
          ),


        cotacao_id:
          formData.get(
            "cotacao_id"
          ),


        seguradora_id:
          Number(
            formData.get(
              "seguradora_id"
            )
          ),


        tipo_seguro_id:
          Number(
            formData.get(
              "tipo_seguro_id"
            )
          ),


        numero_proposta:
          formData.get(
            "numero_proposta"
          ),


        premio_liquido:
          premioLiquido,


        premio_total:
          premioLiquido,


        comissao_percentual:
          percentual,


        comissao_valor:
          comissao,


        status:
          "Em análise",

      });



  if(error){

    throw new Error(
      error.message
    );

  }



  revalidatePath(
    "/admin/propostas"
  );


  redirect(
    "/admin/propostas?sucesso=1"
  );


}

export async function excluirProposta(
  id: string
) {

  const supabase =
    await createClient();


  const { error } =
    await supabase
      .from("propostas")
      .delete()
      .eq(
        "id",
        id
      );


  if(error){

    throw new Error(
      error.message
    );

  }


  revalidatePath(
    "/admin/propostas"
  );


  redirect(
    "/admin/propostas?excluido=1"
  );

}
export async function atualizarProposta(
  formData: FormData
) {

  const supabase =
    await createClient();



  const id =
    String(
      formData.get("id")
    );



  const premioLiquido =
    Number(
      String(
        formData.get("premio_liquido")
      )
      .replace(/\D/g,"")
    ) / 100;



  const percentual =
    Number(
      formData.get(
        "comissao_percentual"
      )
    );



  const comissao =
    premioLiquido *
    percentual /
    100;



  const { error } =
    await supabase
      .from("propostas")
      .update({

        cliente_id:
          formData.get(
            "cliente_id"
          ),


        cotacao_id:
          formData.get(
            "cotacao_id"
          ),


        seguradora_id:
          Number(
            formData.get(
              "seguradora_id"
            )
          ),


        tipo_seguro_id:
          Number(
            formData.get(
              "tipo_seguro_id"
            )
          ),


        numero_proposta:
          formData.get(
            "numero_proposta"
          ),


        premio_liquido:
          premioLiquido,


        premio_total:
          premioLiquido,


        comissao_percentual:
          percentual,


        comissao_valor:
          comissao,


        status:
          formData.get(
            "status"
          ),


      })
      .eq(
        "id",
        id
      );




  if(error){

    throw new Error(
      error.message
    );

  }



  revalidatePath(
    "/admin/propostas"
  );


  revalidatePath(
    `/admin/propostas/${id}`
  );


  redirect(
    "/admin/propostas?atualizado=1"
  );

}