import BasePage from "@/components/admin/common/BasePage";
import PagamentosPendentesRelatorio from "@/components/admin/relatorios/PagamentosPendentesRelatorio";
import { listarPagamentosPendentes } from "@/lib/repositories/relatoriosRepository";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const pagamentos = await listarPagamentosPendentes();

  return (
    <BasePage title="Relatórios" description="Acompanhamento financeiro das apólices da Vettor Seguros.">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0A2F5A]">Pagamentos a dar baixa</h2>
        <p className="mt-1 text-sm text-slate-500">Parcelas que ainda precisam ser conferidas e confirmadas pelo corretor.</p>
      </div>
      <PagamentosPendentesRelatorio pagamentos={pagamentos} />
    </BasePage>
  );
}
