"use client";

import {
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";


type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";


type ToastItem = {
  id: string;

  type: ToastType;

  message: string;
};


type ToastContextValue = {
  showToast: (
    message: string,
    type?: ToastType,
  ) => void;

  success: (
    message: string,
  ) => void;

  error: (
    message: string,
  ) => void;

  warning: (
    message: string,
  ) => void;

  info: (
    message: string,
  ) => void;
};


const ToastContext =
  createContext<ToastContextValue | null>(
    null,
  );


function gerarId() {
  return (
    Date.now().toString() +
    Math.random()
      .toString(36)
      .slice(2)
  );
}


function classesPorTipo(
  type: ToastType,
) {
  if (type === "success") {
    return {
      container:
        "border-green-200 bg-green-50 text-green-800",

      icon:
        "text-green-600",
    };
  }

  if (type === "error") {
    return {
      container:
        "border-red-200 bg-red-50 text-red-800",

      icon:
        "text-red-600",
    };
  }

  if (type === "warning") {
    return {
      container:
        "border-amber-200 bg-amber-50 text-amber-800",

      icon:
        "text-amber-600",
    };
  }

  return {
    container:
      "border-blue-200 bg-blue-50 text-blue-800",

    icon:
      "text-blue-600",
  };
}


function ToastIcon({
  type,
}: {
  type: ToastType;
}) {
  const classes =
    classesPorTipo(type);

  if (type === "success") {
    return (
      <CheckCircle2
        size={20}
        className={classes.icon}
      />
    );
  }

  if (type === "error") {
    return (
      <XCircle
        size={20}
        className={classes.icon}
      />
    );
  }

  if (type === "warning") {
    return (
      <TriangleAlert
        size={20}
        className={classes.icon}
      />
    );
  }

  return (
    <Info
      size={20}
      className={classes.icon}
    />
  );
}


export default function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    toasts,
    setToasts,
  ] =
    useState<ToastItem[]>([]);


  const removerToast =
    useCallback(
      (
        id: string,
      ) => {
        setToasts(
          (current) =>
            current.filter(
              (toast) =>
                toast.id !== id,
            ),
        );
      },
      [],
    );


  const showToast =
    useCallback(
      (
        message: string,
        type: ToastType =
          "info",
      ) => {
        const id =
          gerarId();

        setToasts(
          (current) => [
            ...current,
            {
              id,
              type,
              message,
            },
          ],
        );

        window.setTimeout(
          () => {
            removerToast(id);
          },
          4000,
        );
      },
      [
        removerToast,
      ],
    );


  const value =
    useMemo<ToastContextValue>(
      () => ({
        showToast,

        success: (
          message: string,
        ) =>
          showToast(
            message,
            "success",
          ),

        error: (
          message: string,
        ) =>
          showToast(
            message,
            "error",
          ),

        warning: (
          message: string,
        ) =>
          showToast(
            message,
            "warning",
          ),

        info: (
          message: string,
        ) =>
          showToast(
            message,
            "info",
          ),
      }),
      [
        showToast,
      ],
    );


  return (
    <ToastContext.Provider
      value={value}
    >
      {children}

      <div
        className="
          fixed
          right-4
          top-4
          z-[100]
          flex
          w-[calc(100%-2rem)]
          max-w-sm
          flex-col
          gap-3
          sm:right-6
          sm:top-6
        "
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(
          (toast) => {
            const classes =
              classesPorTipo(
                toast.type,
              );

            return (
              <div
                key={toast.id}
                className={`
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  py-4
                  shadow-lg
                  backdrop-blur
                  ${classes.container}
                `}
                role={
                  toast.type ===
                  "error"
                    ? "alert"
                    : "status"
                }
              >
                <div className="mt-0.5 shrink-0">
                  <ToastIcon
                    type={
                      toast.type
                    }
                  />
                </div>

                <p className="min-w-0 flex-1 text-sm font-medium leading-5">
                  {toast.message}
                </p>

                <button
                  type="button"
                  aria-label="Fechar notificação"
                  onClick={() =>
                    removerToast(
                      toast.id,
                    )
                  }
                  className="
                    shrink-0
                    rounded-lg
                    p-1
                    text-current
                    opacity-60
                    transition
                    hover:bg-black/5
                    hover:opacity-100
                  "
                >
                  <X size={17} />
                </button>
              </div>
            );
          },
        )}
      </div>
    </ToastContext.Provider>
  );
}


export function useToast() {
  const context =
    useContext(
      ToastContext,
    );

  if (!context) {
    throw new Error(
      "useToast deve ser utilizado dentro de ToastProvider.",
    );
  }

  return context;
}