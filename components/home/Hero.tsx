import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-[#061B3A]"
    >
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
    </section>
  );
}