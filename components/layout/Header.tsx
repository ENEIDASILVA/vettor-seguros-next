"use client";

import Image from "next/image";
import Button from "../ui/Button";

const menu = [
  { label: "Início", href: "#inicio" },
  { label: "Seguros", href: "#seguros" },
  { label: "Diferenciais", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#inicio">
          <Image
            src="/logo/logo.svg"
            alt="VETTOR Seguros"
            width={170}
            height={50}
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
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
      </div>
    </header>
  );
}