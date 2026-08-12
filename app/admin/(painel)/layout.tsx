import { redirect } from "next/navigation";
import { ReactNode } from "react";

import Sidebar from "@/components/admin/Sidebar";
import ToastProvider from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/server";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}