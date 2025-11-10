import { Plane, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-blue-600" />
          <span className="text-xl">NewVtour Viagens e Turismo</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-gray-700 hover:text-blue-600 transition">
            Início
          </a>
          <a href="#services" className="text-gray-700 hover:text-blue-600 transition">
            Serviços
          </a>
          <a href="#promotions" className="text-gray-700 hover:text-blue-600 transition">
            Promoções
          </a>
          <a href="#destinations" className="text-gray-700 hover:text-blue-600 transition">
            Destinos
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">
            Contato
          </a>
        </div>

        <div className="hidden md:block">
          <Button>Solicitar Orçamento</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a
              href="#home"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="#services"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#promotions"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Promoções
            </a>
            <a
              href="#destinations"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Destinos
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </a>
            <Button className="w-full">Solicitar Orçamento</Button>
          </div>
        </div>
      )}
    </header>
  );
}
