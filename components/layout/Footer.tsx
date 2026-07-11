import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Footer() {
  return (
    <footer id="contato" className="bg-[#061B3A] text-white">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-4">

          <div>
            <h2 className="text-3xl font-bold">
              VETTOR
            </h2>

            <p className="mb-6 text-blue-300">
              SEGUROS
            </p>

            <p className="text-gray-300 leading-relaxed">
              Proteção inteligente para você,
              sua família e seu patrimônio.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Seguros
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>Seguro Auto</li>
              <li>Seguro Moto</li>
              <li>Seguro Residencial</li>
              <li>Seguro Vida</li>
              <li>Seguro Empresarial</li>
              <li>Seguro Saúde</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Contato
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>(31) 99353-9953</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>contato@vettorseguros.com.br</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Minas Gerais - Brasil</span>
              </div>

            </div>
          </div>

          <div>

            <div className="flex items-center gap-3">

              <ShieldCheck size={32} />

              <h3 className="text-xl font-bold">
                Atendimento
              </h3>

            </div>

            <p className="mt-4 text-gray-300">
              Segunda a Sexta-feira
              <br />
              08:00 às 18:00
            </p>

            <Button
              href="https://wa.me/5531993539953"
              target="_blank"
              variant="whatsapp"
              className="mt-8"
            >
              Falar no WhatsApp
            </Button>

          </div>

        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} VETTOR SEGUROS • Todos os direitos reservados.
        </div>

      </Container>
    </footer>
  );
}