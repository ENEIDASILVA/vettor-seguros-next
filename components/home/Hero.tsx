import Image from "next/image";

import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="bg-[#061B3A]"
    >
      <div className="relative w-full overflow-hidden">
        <div className="block sm:hidden">
          <Image
            src="/Images/hero/hero-vettor-mobile.png"
            alt="Vettor Seguros - Proteção inteligente"
            width={1024}
            height={1536}
            priority
            unoptimized
            sizes="100vw"
            className="block h-auto w-full"
          />
        </div>

        <div className="hidden sm:block">
          <Image
            src="/Images/hero/hero-vettor.png"
            alt="Vettor Seguros - Proteção inteligente"
            width={1920}
            height={1080}
            priority
            unoptimized
            sizes="100vw"
            className="block h-auto w-full"
          />
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#061B3A] px-4 py-6 sm:px-6 sm:py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Encontre a proteção ideal para você
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-blue-200 sm:text-base">
              Escolha seu seguro e solicite sua cotação de forma rápida e segura.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="#seguros"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-center font-bold text-[#0B2E6D] transition hover:bg-blue-50"
            >
              Fazer Cotação Online

              <ArrowRight
                size={20}
                className="shrink-0"
              />
            </a>

            <a
              href="https://wa.me/5531993539953?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o."
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-center font-bold text-white transition hover:bg-green-600"
            >
              <MessageCircle
                size={20}
                className="shrink-0"
              />

              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}