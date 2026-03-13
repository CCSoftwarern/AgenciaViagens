import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cruisesAPI } from "../../utils/api";

interface Cruise {
  id: string,
  name: string,
  image: string,
  price: string,
  rating: number,
  duration: string,
  parcelas: string,
  description: string,
  expirationDate: Date,
  desconto?: string,
}

export function CruisesManager() {
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCruise, setEditingCruise] = useState<Cruise | null>(null);
  const [formData, setFormData] = useState<Partial<Cruise>>({
    name: "",
    price: "",
    rating: 5,
    duration: "",
    parcelas: "",
    description: "",
    image: "",
    expirationDate: new Date(),
    desconto: "",
  });

  useEffect(() => {
    loadCruises();
  }, []);

  const loadCruises = async () => {
    try {
      setIsLoading(true);
      const data = await cruisesAPI.getAll();
      setCruises(data.cruises || []);
    } catch (error) {
      console.error("Error loading cruises:", error);
      toast.error("Erro ao carregar cruzeiros");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cruise: Cruise) => {
    setEditingCruise(cruise);
    setFormData(cruise);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este cruzeiro?")) {
      try {
        await cruisesAPI.delete(id);
        setCruises(cruises.filter((c) => c.id !== id));
        toast.success("Cruzeiro deletado com sucesso!");
      } catch (error) {
        console.error("Error deleting cruise:", error);
        toast.error("Erro ao deletar cruzeiro");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingCruise) {
        // Editar cruzeiro existente
        const updated = await cruisesAPI.update(editingCruise.id, formData);
        setCruises(
          cruises.map((c) =>
            c.id === editingCruise.id ? updated.cruise : c
          )
        );
        toast.success("Cruzeiro atualizado com sucesso!");
      } else {
        // Adicionar novo cruzeiro
        const created = await cruisesAPI.create(formData);
        setCruises([...cruises, created.cruise]);
        toast.success("Cruzeiro adicionado com sucesso!");
      }

      setIsDialogOpen(false);
      setEditingCruise(null);
      setFormData({
        name: "",
        price: "",
        rating: 5,
        duration: "",
        parcelas: "",
        description: "",
        image: "",
        expirationDate: new Date(),
          desconto: "",
      });
    } catch (error) {
      console.error("Error saving cruise:", error);
      toast.error("Erro ao salvar cruzeiro");
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
                setEditingCruise(null);
                setFormData({
                    name: "",
                    price: "",
                    rating: 5,
                    duration: "",
                    parcelas: "",
                    description: "",
                    image: "",
                    expirationDate: new Date(),
                    desconto: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Cruzeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCruise ? "Editar Cruzeiro" : "Novo Cruzeiro"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Destino</Label>
                  <Input
                    id="name"
                    value={formData.name}
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
                  value={formData.name}
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
                  <Label htmlFor="expirationDate">Data de Expiração</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="R$ 8.500"
                    required
                  />
                </div>
                  <div>
                  <Label htmlFor="desconto">Desconto</Label>
                  <Input
                    id="desconto"
                    value={formData.desconto}
                    onChange={handleChange}
                    placeholder="R$ 2.500"
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
                <TableHead>Nome</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Data de Expiração</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cruises.map((cruise) => (
                <TableRow key={cruise.id}>
                  <TableCell>{cruise.name}</TableCell>
                  <TableCell>{cruise.duration}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="line-through text-gray-500 text-sm">
                        {cruise.price}
                      </span>
                      <span>{cruise.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                      {cruise.desconto}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                      {cruise.expirationDate}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cruise)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cruise.id)}
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
