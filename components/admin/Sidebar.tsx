"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import LogoutButton from "./LogoutButton";

const menu = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: Users,
  },
  {
    href: "/admin/cotacoes",
    label: "Cotações",
    icon: ClipboardList,
  },
  {
    href: "/admin/apolices",
    label: "Apólices",
    icon: FileCheck2,
  },
  {
    href: "/admin/propostas",
    label: "Propostas",
    icon: FileText,
  },
  {
    href: "/admin/relatorios",
    label: "Relatórios",
    icon: BarChart3,
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col bg-[#0A2F5A] text-white">
      <div className="border-b border-white/10 px-8 py-8">
        <h1 className="text-2xl font-bold">
          VETTOR
        </h1>

        <p className="mt-1 text-sm text-slate-300">
          Corretora de Seguros
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    active
                      ? "bg-[#C9A227] font-semibold text-[#0A2F5A]"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />

                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <LogoutButton />
      </div>
    </aside>
  );
}