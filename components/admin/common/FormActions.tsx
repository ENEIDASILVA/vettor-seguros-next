import Link from "next/link";

type Props = {
  cancelHref: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
};

export default function FormActions({
  cancelHref,
  submitLabel = "Salvar",
  submittingLabel = "Salvando...",
  isSubmitting = false,
}: Props) {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <Link
        href={cancelHref}
        className="rounded-xl border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Cancelar
      </Link>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[#0A2F5A] px-5 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}