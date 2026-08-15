import BasePage from "@/components/admin/common/BasePage";
import SeguradorasManager from "@/components/admin/configuracoes/SeguradorasManager";

import {
  listarSeguradoras,
} from "@/lib/repositories/seguradorasRepository";

export default async function ConfiguracoesPage() {
  const seguradoras =
    await listarSeguradoras();

  return (
    <BasePage
      title="Configurações"
      description="Gerencie os cadastros e parâmetros do sistema."
    >
      <SeguradorasManager
        seguradoras={
          seguradoras
        }
      />
    </BasePage>
  );
}
