"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    label: "Início",
    href: "#inicio",
  },
  {
    label: "Como funciona",
    href: "#como-funciona",
  },
  {
    label: "Diferenciais",
    href: "#diferenciais",
  },
  {
    label: "Seguros",
    href: "#seguros",
  },
  {
    label: "Contato",
    href: "#contato",
  },
];

export default function Header() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#061B3A]/95 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#inicio"
          onClick={closeMobileMenu}
          aria-label="Ir para o início da página"
          className="shrink-0"
        >
          <Image
            src="/logo/logo.svg"
            alt="VETTOR Seguros"
            width={170}
            height={50}
            priority
            className="h-auto w-[135px] sm:w-[155px] lg:w-[170px]"
          />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-sm font-semibold text-white transition hover:text-blue-200 xl:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#seguros"
          className="hidden whitespace-nowrap rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 lg:inline-flex"
        >
          Solicitar Cotação
        </a>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          aria-label={
            mobileMenuOpen
              ? "Fechar menu"
              : "Abrir menu"
          }
          aria-expanded={mobileMenuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#061B3A] px-4 pb-5 shadow-xl sm:px-6 lg:hidden">
          <nav className="flex flex-col">
            {menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="border-b border-white/10 py-4 font-semibold text-white transition hover:text-blue-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#seguros"
            onClick={closeMobileMenu}
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
          >
            Solicitar Cotação
          </a>
        </div>
      )}
    </header>
  );
}