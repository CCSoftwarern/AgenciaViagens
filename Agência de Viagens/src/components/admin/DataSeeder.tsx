import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { promotionsAPI, servicesAPI, agencyAPI, cruisesAPI } from "../../utils/api";

const initialPromotions = [
  {
    destination: "Caribe",
    title: "Praias Paradisíacas",
    duration: "7 dias / 6 noites",
    people: "2 pessoas",
    oldPrice: "R$ 8.500",
    newPrice: "R$ 5.990",
    discount: "30% OFF",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1660315250109-075f6b142ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYyNzg2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    destination: "Europa",
    title: "Cidades Históricas",
    duration: "10 dias / 9 noites",
    people: "2 pessoas",
    oldPrice: "R$ 15.000",
    newPrice: "R$ 11.990",
    discount: "20% OFF",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571662482123-93d989d8f4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGUlMjBjaXR5JTIwdHJhdmVsfGVufDF8fHx8MTc2Mjc5OTM1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    destination: "Alpes Suíços",
    title: "Aventura nas Montanhas",
    duration: "5 dias / 4 noites",
    people: "2 pessoas",
    oldPrice: "R$ 9.800",
    newPrice: "R$ 7.490",
    discount: "25% OFF",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1713959989861-2425c95e9777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHRyYXZlbHxlbnwxfHx8fDE3NjI3ODQxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    destination: "Maldivas",
    title: "Resort All Inclusive",
    duration: "6 dias / 5 noites",
    people: "2 pessoas",
    oldPrice: "R$ 12.000",
    newPrice: "R$ 8.990",
    discount: "25% OFF",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1629711129507-d09c820810b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzYyNzYxNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    destination: "África",
    title: "Safari Exclusivo",
    duration: "8 dias / 7 noites",
    people: "2 pessoas",
    oldPrice: "R$ 18.000",
    newPrice: "R$ 13.990",
    discount: "22% OFF",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1729359035276-189519a4b072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB3aWxkbGlmZSUyMGFmcmljYXxlbnwxfHx8fDE3NjI3OTkzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    destination: "Ásia",
    title: "Culturas Orientais",
    duration: "12 dias / 11 noites",
    people: "2 pessoas",
    oldPrice: "R$ 14.500",
    newPrice: "R$ 10.990",
    discount: "24% OFF",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1718802373553-72f8f94dc860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHdpbmclMjBza3l8ZW58MXx8fHwxNzYyNzU0MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const initialServices = [
  {
    icon: "Plane",
    title: "Passagens Aéreas",
    description: "As melhores tarifas e rotas para seu destino",
  },
  {
    icon: "Hotel",
    title: "Hospedagem",
    description: "Hotéis e resorts selecionados com ótimos preços",
  },
  {
    icon: "MapPin",
    title: "Pacotes Turísticos",
    description: "Pacotes completos com tudo incluído",
  },
  {
    icon: "Calendar",
    title: "Roteiros Personalizados",
    description: "Planejamos sua viagem do jeito que você sonha",
  },
  {
    icon: "Umbrella",
    title: "Seguro Viagem",
    description: "Viaje tranquilo com a melhor cobertura",
  },
  {
    icon: "HeadphonesIcon",
    title: "Suporte 24/7",
    description: "Assistência completa durante toda sua viagem",
  },
];

const initialagencyInfo = [{
  name: "Agência de Viagens Exemplo",
  slogan: "Transformando sonhos em realidade",
  description: "Somos uma agência de viagens dedicada a oferecer as melhores experiências para nossos clientes. Com anos de expertise no mercado, proporcionamos viagens inesquecíveis com atendimento personalizado.",
  address: "Rua das Flores, 123 - São Paulo, SP",
  phone1: "+55 (11) 1234-5678",
  phone2: "+55 (11) 9876-5432",
  watsapp: "+55 (11) 91234-5678",
  email: "contato@agenciaviagens.com.br",
  facebook: "https://www.facebook.com/agenciaviagens",
  instagram: "https://www.instagram.com/agenciaviagens",
  twitter: "https://www.twitter.com/agenciaviagens",
  linkedin: "https://www.linkedin.com/company/agenciaviagens",
  youyube: "https://www.youtube.com/agenciaviagens",
  backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWx8ZW58MXx8fHwxNzYyNzgyNjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  imglogo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWx8ZW58MXx8fHwxNzYyNzgyNjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  liberado: true,
  enderecoCompleto: "Rua das Flores, 123, São Paulo, SP, 01234-567",

}
];

const cruises = [
  {
    name: "Cruzeiro pelo Caribe",
    duration: "7 dias",
    price: "R$ 4.500",
    parcelas: "10x de R$ 450",
    description: "Explore as ilhas paradisíacas do Caribe com conforto e luxo a bordo.",
    rating: 4.8,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7SeJvO64mz4AT__v3kMxK2-WVPjHkpwxg2Q&s",
  
  },
    {
    name: "Cruzeiro pelo Mediterrâneo",
    duration: "10 dias",
    price: "R$ 6.500",
    parcelas: "10x de R$ 450",
    description: "Explore as ilhas paradisíacas do Caribe com conforto e luxo a bordo.",
    rating: 4.8,
    image: "https://triplover.com.br/wp-content/uploads/2019/07/Melhor-Cruzeiro-Mediterraneo.jpg",
  
  },
];

export function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    
    try {
      // Seed promotions
      for (const promo of initialPromotions) {
        await promotionsAPI.create(promo);
      }

      // Seed services
      for (const service of initialServices) {
        await servicesAPI.create(service);
      }

      // Seed agency info
      for (const agency of initialagencyInfo) {
        await agencyAPI.create(agency);
      }
      // Seed cruises
      for (const cruise of cruises) {
        await cruisesAPI.create(cruise);
      }

      toast.success("Dados iniciais carregados com sucesso!");
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Erro ao carregar dados iniciais");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Carregar Dados Iniciais
        </CardTitle>
        <CardDescription>
          Se o banco de dados estiver vazio, clique no botão abaixo para carregar dados de exemplo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedData} disabled={isSeeding}>
          {isSeeding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Carregar Dados
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
