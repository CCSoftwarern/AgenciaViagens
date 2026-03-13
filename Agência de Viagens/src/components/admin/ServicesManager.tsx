import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Pencil, Trash2, Save, Plane, Hotel, MapPin, Calendar, Umbrella, HeadphonesIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { servicesAPI } from "../../utils/api";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const iconMap: Record<string, any> = {
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Umbrella,
  HeadphonesIcon,
};

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    icon: "Plane",
    title: "",
    description: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este serviço?")) {
      try {
        await servicesAPI.delete(id);
        setServices(services.filter((s) => s.id !== id));
        toast.success("Serviço deletado com sucesso!");
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Erro ao deletar serviço");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingService) {
        // Editar serviço existente
        const updated = await servicesAPI.update(editingService.id, formData);
        setServices(
          services.map((s:any) =>
            s.id === editingService.id ? updated.service : s
          )
        );
        toast.success("Serviço atualizado com sucesso!");
      } else {
        // Adicionar novo serviço
        const created = await servicesAPI.create(formData);
        setServices([...services, created.service]);
        toast.success("Serviço adicionado com sucesso!");
      }

      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        icon: "Plane",
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Erro ao salvar serviço");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        <div>
        <h1 className="text-3xl">Gerenciar Serviços</h1>
        <h6 className="text-sm text-gray-500">Aqui você pode adicionar, editar ou remover os serviços oferecidos pela agência.</h6>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingService(null);
                setFormData({
                  icon: "Plane",
                  title: "",
                  description: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={handleChange as any}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Plane">Avião</option>
                  <option value="Hotel">Hotel</option>
                  <option value="MapPin">Mapa</option>
                  <option value="Calendar">Calendário</option>
                  <option value="Umbrella">Guarda-chuva</option>
                  <option value="HeadphonesIcon">Fone de ouvido</option>
                </select>
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
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon];
          return (
            <Card key={service.id} className="relative">
              <CardContent className="p-6">
                <IconComponent className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
