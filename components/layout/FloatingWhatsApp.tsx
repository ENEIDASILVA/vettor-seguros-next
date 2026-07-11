import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5531993539953"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Vettor Seguros pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition hover:scale-110 hover:bg-green-600"
    >
      <MessageCircle size={32} />
    </a>
  );
}