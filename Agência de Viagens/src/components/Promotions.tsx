import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Users, Star, Loader2, Plane } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAgency } from "../context/AgencyContext";
import { motion } from "framer-motion";
import { promotionsAPI } from "../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";





export function Promotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { agencyInfo } = useAgency();


  useEffect(() => {
    loadPromotions();
  }, []);

  const abrirWhatsapp = (titulo: string) => {
    const phoneNumber = agencyInfo?.watsapp;
    const message = "Olá, gostaria de mais informações sobre as promoções de viagens. " + titulo;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };


    const openDetails = (promo: any) => {
      setSelectedPromotion(promo);
      setIsDetailsOpen(true);
    };

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
    <motion.section id= "promotions" className = "py-20" 
     initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
    
    >
      <div className="container mx-auto px-4" >
        <div className="text-center mb-12" >
          <h2 className="text-4xl mb-4" > Promoções Especiais </h2>
            < p className = "text-xl text-gray-600 max-w-2xl mx-auto" >
              Aproveite nossas ofertas exclusivas e realize a viagem dos seus sonhos
                </p>
                </div>

  {
    isLoading ? (
      <div className= "flex items-center justify-center h-64" >
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        ) : promotions.length === 0 ? (
      <div className= "text-center text-gray-500 py-12" >
      <p>Nenhuma promoção disponível no momento.</p>
        < p className = "text-sm mt-2" > Volte em breve para conferir nossas ofertas! </p>
          </div>
        ) : (
      <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
      {
        promotions.map((promo, index) => (
          <Card key= { index } className = "overflow-hidden hover:shadow-xl transition group" >
          <div className="relative h-64 overflow-hidden" >
        <ImageWithFallback
                  src={ promo.image }
                  alt = { promo.title }
                  className = "w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          <Badge className="absolute top-4 right-4 bg-red-600 text-white" >
          { promo.discount }
          </Badge>
          </div>
        < CardContent className = "p-6" >
        <div className="flex items-center gap-2 mb-2" >
        <span className="text-sm text-blue-600" > { promo.destination } </span>
        < div className = "flex items-center gap-1 ml-auto" >
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm" > { promo.rating } </span>
        </div>
        </div>
        < h3 className = "text-xl mb-3" > { promo.title } </h3>
        < div className = "flex items-center gap-4 text-sm text-gray-600 mb-4" >
        <div className="flex items-center gap-1" >
        <Calendar className="w-4 h-4" />
        <span>{ promo.duration } </span>
        </div>
        < div className = "flex items-center gap-1" >
        <Users className="w-4 h-4" />
        <span>{ promo.people } </span>
        </div>
        </div>
        < div className = "flex items-end justify-between mb-4" >
        <div>
        <p className="text-sm text-gray-500 line-through" > { promo.oldPrice } </p>
        < p className = "text-2xl text-blue-600" > { promo.newPrice } </p>
        </div>
        </div>
        < Button className = "w-full" onClick = {() => openDetails(promo)} >
      Ver Detalhes
        </Button>
        </CardContent>
        </Card>
        ))
  }
  </div>
        )
}
</div>
<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    {selectedPromotion && (
      <>
        <DialogHeader>
          <DialogTitle>{selectedPromotion.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ImageWithFallback
            src={selectedPromotion.image}
            alt={selectedPromotion.title}
            className="w-full h-64 object-cover rounded-lg"
          />

          <div className="flex items-center justify-between">
            <Badge className="bg-red-600 text-white">
              {selectedPromotion.discount}
            </Badge>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{selectedPromotion.rating}</span>
            </div>
          </div>

          <p className="text-gray-600">
            📍 <strong>Destino:</strong> {selectedPromotion.destination}
          </p>

          <div className="flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {selectedPromotion.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {selectedPromotion.people}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 line-through">
              {selectedPromotion.oldPrice}
            </p>
            <p className="text-3xl text-blue-600 font-bold">
              {selectedPromotion.newPrice}
            </p>
          </div>

          {selectedPromotion.description && (
            <p className="text-gray-700 leading-relaxed">
              {selectedPromotion.description}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
            Fechar
          </Button>
          <Button onClick={() => abrirWhatsapp(selectedPromotion.title)}>Solicitar reserva</Button>
        </DialogFooter>
      </>
    )}
  </DialogContent>
</Dialog>

  </motion.section>
  
  );

}
