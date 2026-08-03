"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface ConfirmActionButtonProps {
  title: string;
  message: string;
  confirmLabel?: string;
  children: React.ReactNode;
  action: () => Promise<void>;
}

export default function ConfirmActionButton({
  title,
  message,
  confirmLabel = "Confirmar",
  children,
  action,
}: ConfirmActionButtonProps) {
  const [open, setOpen] = useState(false);

  const [pending, startTransition] = useTransition();

  function confirmar() {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <ConfirmDialog
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        loading={pending}
        onCancel={() => setOpen(false)}
        onConfirm={confirmar}
      />
    </>
  );
}