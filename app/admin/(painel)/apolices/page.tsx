import BasePage from "@/components/admin/common/BasePage";
import ApoliceList from "@/components/admin/apolices/ApoliceList";
import { FilePlus2 } from "lucide-react";

import { obterApolices } from "@/lib/services/apolicesService";

export const dynamic = "force-dynamic";

export default async function ApolicesPage() {
  const apolices = await obterApolices();

  return (
    <BasePage
      title="Apólices"
      description="Gerenciamento das apólices da Vettor Seguros."
      action={{
        label: "Nova Apólice",
        href: "/admin/apolices/nova",
        icon: FilePlus2,
      }}
    >
      <ApoliceList apolices={apolices} />
    </BasePage>
  );
}