"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Informe o e-mail e a senha.");
      return;
    }

    try {
      setIsLoading(true);

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          "Não foi possível entrar. Verifique o e-mail e a senha."
        );
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Erro ao acessar o painel:", error);

      setErrorMessage(
        "Ocorreu um erro ao acessar o painel. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-[#0A2F5A] px-6 py-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
              Vettor Seguros
            </p>

            <h1 className="mt-3 text-2xl font-bold text-white">
              Painel Administrativo
            </h1>

            <p className="mt-2 text-sm text-slate-200">
              Acesse com seu e-mail e senha.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 px-6 py-8 sm:px-8"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#0A2F5A] focus:ring-2 focus:ring-[#0A2F5A]/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-24 text-slate-900 outline-none transition focus:border-[#0A2F5A] focus:ring-2 focus:ring-[#0A2F5A]/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-3 text-sm font-semibold text-[#0A2F5A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#0A2F5A] px-5 py-3.5 font-bold text-white transition hover:bg-[#082648] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-center text-xs text-slate-500">
              Área de acesso restrito da Vettor Seguros.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}