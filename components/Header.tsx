"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import Button from "../ui/Button";

const menu = [
  { label: "Início", href: "#inicio" },
  { label: "Seguros", href: "#seguros" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Cotação", href: "#cotacao" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#061B3A]/95 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#inicio"
          onClick={closeMobileMenu}
          aria-label="Ir para o início"
        >
          <Image
            src="/logo/logo.svg"
            alt="VETTOR Seguros"
            width={170}
            height={50}
            priority
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-white transition hover:text-blue-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            href="#cotacao"
            variant="whatsapp"
          >
            Solicitar Cotação
          </Button>
        </div>

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
        <div className="border-t border-white/10 bg-[#061B3A] px-6 pb-6 lg:hidden">
          <nav className="flex flex-col">
            {menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="border-b border-white/10 py-4 font-medium text-white transition hover:text-blue-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#cotacao"
            onClick={closeMobileMenu}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            Solicitar Cotação
          </a>
        </div>
      )}
    </header>
  );
}