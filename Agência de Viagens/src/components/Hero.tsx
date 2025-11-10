import { Button } from "./ui/button";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1660315250109-075f6b142ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYyNzg2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl mb-6">
          Descubra o Mundo Conosco
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Experiências únicas e inesquecíveis para tornar sua viagem dos sonhos realidade
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-5 h-5 mr-2" />
            Explorar Destinos
          </Button>
          <Button size="lg" variant="outline" className="bg-white text-gray-900 hover:bg-gray-100" >
            Ver Promoções
          </Button>
        </div>
      </div>
    </section>
  );
}
