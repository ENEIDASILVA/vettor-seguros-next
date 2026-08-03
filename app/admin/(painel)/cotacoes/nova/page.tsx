import { Plus } from "lucide-react";

import BasePage from "@/components/admin/common/BasePage";
import CotacaoForm from "@/components/admin/cotacoes/CotacaoForm";
import { ArrowLeft } from "lucide-react";
import { obterClientes } from "@/lib/services/clientesService";
import {
  obterTiposSeguro,
} from "@/lib/services/cotacoesService";

export default async function NovaCotacaoPage() {
  const [clientes, tiposSeguro] = await Promise.all([
    obterClientes(),
    obterTiposSeguro(),
  ]);

  const clientesAtivos = clientes.filter(
    (cliente) => cliente.ativo
  );

  return (
    <BasePage
      title="Nova Cotação"
      description="Cadastre uma nova cotação."
      action={{
            label: "Voltar",
            href: "/admin/cotacoes",
            icon: ArrowLeft,
        }}
    >
      <CotacaoForm
        clientes={clientesAtivos.map((cliente) => ({
          id: cliente.id,
          nome: cliente.nome,
        }))}
        tiposSeguro={tiposSeguro}
      />
    </BasePage>
  );
}