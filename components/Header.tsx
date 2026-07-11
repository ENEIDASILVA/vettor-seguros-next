"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Início", href: "#inicio" },
    { label: "Seguros", href: "#seguros" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#0B2E6D]/95 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#inicio" className="flex items-center">
          <Image
            src="/logo/logo.svg"
            alt="Vettor Seguros"
            width={180}
            height={50}
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 font-medium text-white md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-blue-300">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/5531993539953"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600 md:inline-block"
        >
          Cotação
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0B2E6D] px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5 font-medium text-white">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="transition hover:text-blue-300"
              >
                {link.label}
              </a>
            ))}

            <a
              href="https://wa.me/5531993539953"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-white"
            >
              Solicitar Cotação
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}