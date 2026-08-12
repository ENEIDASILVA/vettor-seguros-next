import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropostaPage({
  params,
}: Props) {
  const { id } = await params;

  redirect(
    `/admin/propostas/${id}/workspace`,
  );
}