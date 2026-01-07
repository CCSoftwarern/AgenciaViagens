import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { promotionsAPI } from "../../utils/api";

interface Promotion {
  id: string;
  destination: string;
  title: string;
  duration: string;
  people: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  rating: number;
  image: string;
}

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    destination: "",
    title: "",
    duration: "",
    people: "2 pessoas",
    oldPrice: "",
    newPrice: "",
    discount: "",
    rating: 5,
    image: "",
  });

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
      toast.error("Erro ao carregar promoções");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData(promotion);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta promoção?")) {
      try {
        await promotionsAPI.delete(id);
        setPromotions(promotions.filter((p) => p.id !== id));
        toast.success("Promoção deletada com sucesso!");
      } catch (error) {
        console.error("Error deleting promotion:", error);
        toast.error("Erro ao deletar promoção");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingPromotion) {
        // Editar promoção existente
        const updated = await promotionsAPI.update(editingPromotion.id, formData);
        setPromotions(
          promotions.map((p) =>
            p.id === editingPromotion.id ? updated.promotion : p
          )
        );
        toast.success("Promoção atualizada com sucesso!");
      } else {
        // Adicionar nova promoção
        const created = await promotionsAPI.create(formData);
        setPromotions([...promotions, created.promotion]);
        toast.success("Promoção adicionada com sucesso!");
      }

      setIsDialogOpen(false);
      setEditingPromotion(null);
      setFormData({
        destination: "",
        title: "",
        duration: "",
        people: "2 pessoas",
        oldPrice: "",
        newPrice: "",
        discount: "",
        rating: 5,
        image: "",
      });
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Erro ao salvar promoção");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Gerenciar Promoções</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPromotion(null);
                setFormData({
                  destination: "",
                  title: "",
                  duration: "",
                  people: "2 pessoas",
                  oldPrice: "",
                  newPrice: "",
                  discount: "",
                  rating: 5,
                  image: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Promoção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Avaliação</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="7 dias / 6 noites"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="people">Pessoas</Label>
                  <Input
                    id="people"
                    value={formData.people}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="oldPrice">Preço Antigo</Label>
                  <Input
                    id="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    placeholder="R$ 8.500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPrice">Preço Novo</Label>
                  <Input
                    id="newPrice"
                    value={formData.newPrice}
                    onChange={handleChange}
                    placeholder="R$ 5.990"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Desconto</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="30% OFF"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destino</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.destination}</TableCell>
                  <TableCell>{promotion.title}</TableCell>
                  <TableCell>{promotion.duration}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="line-through text-gray-500 text-sm">
                        {promotion.oldPrice}
                      </span>
                      <span>{promotion.newPrice}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                      {promotion.discount}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(promotion)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(promotion.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
