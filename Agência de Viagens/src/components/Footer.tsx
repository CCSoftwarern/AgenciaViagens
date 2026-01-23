import { Plane, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useAgency } from "../context/AgencyContext"

export function Footer() {
  const { agencyInfo } = useAgency();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
          <img
            src={agencyInfo?.imglogo}
            alt="Logo da Agência"
            className="w-10 h-10 object-contain"
          />
              <span className="text-xl">{agencyInfo?.name}</span>
            </div>
            <p className="text-gray-400">
              {agencyInfo?.description ||
                "Sua parceira de viagens para destinos incríveis ao redor do mundo. Oferecemos experiências personalizadas para tornar sua viagem inesquecível."}
            </p>
          </div>

          <div>
            <h3 className="mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#home" className="hover:text-white transition">
                  Início
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#promotions" className="hover:text-white transition">
                  Promoções
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Destinos Populares</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Caribe</li>
              <li>Europa</li>
              <li>Ásia</li>
              <li>América do Sul</li>
              <li>África</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href={`${agencyInfo?.facebook || '#'}`}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`${agencyInfo?.instagram || '#'}`}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`${agencyInfo?.twitter || '#'}`}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`${agencyInfo?.youyube  || '#'}`}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 {agencyInfo?.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
