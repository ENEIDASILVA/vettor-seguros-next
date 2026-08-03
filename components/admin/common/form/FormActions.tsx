"use client";

import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";
import { useFormStatus } from "react-dom";

type FormActionsProps = {
  cancelHref: string;
  submitLabel?: string;
  pendingLabel?: string;
};

export default function FormActions({
  cancelHref,
  submitLabel = "Salvar",
  pendingLabel = "Salvando...",
}: FormActionsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
      <Link
        href={cancelHref}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Cancelar
      </Link>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A2F5A] px-6 py-3 font-semibold text-white transition hover:bg-[#082648] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
            {pendingLabel}
          </>
        ) : (
          <>
            <Save size={18} />
            {submitLabel}
          </>
        )}
      </button>
    </div>
  );
}