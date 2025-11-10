import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Users, Star, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { promotionsAPI } from "../utils/api";

export function Promotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setIsLoading(true);
      const data = await promotionsAPI.getAll();
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error("Error loading promotions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="promotions" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Promoções Especiais</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas ofertas exclusivas e realize a viagem dos seus sonhos
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>Nenhuma promoção disponível no momento.</p>
            <p className="text-sm mt-2">Volte em breve para conferir nossas ofertas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                  {promo.discount}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-600">{promo.destination}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{promo.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl mb-3">{promo.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{promo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{promo.people}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 line-through">{promo.oldPrice}</p>
                    <p className="text-2xl text-blue-600">{promo.newPrice}</p>
                  </div>
                </div>
                <Button className="w-full">Ver Detalhes</Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
