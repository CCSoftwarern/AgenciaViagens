// import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Trash2, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { agencyAPI } from "../../utils/api";
import { useEffect, useState } from "react";


/* =======================
   INTERFACE
======================= */
interface Agency {
  id: string;
  name: string;
  slogan: string;
  description: string;
  address: string;
  phone1: string;
  phone2: string;
  watsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youyube: string;
  backgroundImage: string;
  imglogo: string;
  liberado: boolean;
  enderecoCompleto: string;
  createdAt: string;
}

/* =======================
   COMPONENTE
======================= */
export function AgencyManager() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAgency();
  }, []);

  /* =======================
     LOAD
  ======================= */
  const loadAgency = async () => {
    try {
      setIsLoading(true);
      const data = (await agencyAPI.getInfo()) as {
        agencyinfo: Agency;
      };
      setAgency(data.agencyinfo ?? null);
    } catch {
      toast.error("Erro ao carregar agência");
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     DELETE
  ======================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta agência?")) return;

    try {
      setDeletingId(id);
      await agencyAPI.delete(id);
      toast.success("Agência deletada com sucesso");
      loadAgency();
    } catch {
      toast.error("Erro ao deletar agência");
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================
     SAVE EDIT
  ======================= */
  const handleSave = async () => {
    if (!editingAgency) return;

    try {
      setIsSaving(true);
      await agencyAPI.update(editingAgency.id, editingAgency);
      toast.success("Agência atualizada com sucesso");
      setIsEditOpen(false);
      loadAgency();
    } catch {
      toast.error("Erro ao atualizar agência");
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerenciador de Agências</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>

                  <TableHead className="w-28">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {agency ? (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.email}</TableCell>
                    <TableCell>{agency.phone1}</TableCell>
                    <TableCell>{agency.address}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAgency(agency);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(agency.id)}
                        disabled={deletingId === agency.id}
                      >
                        {deletingId === agency.id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma agência encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* =======================
         MODAL EDITAR
      ======================= */}
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
  <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
    <DialogHeader>
      <DialogTitle>Editar Agência</DialogTitle>
    </DialogHeader>

    {editingAgency && (
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid gap-4 py-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={editingAgency.name}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={editingAgency.email}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Telefone 1</Label>
            <Input
              value={editingAgency.phone1}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  phone1: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Telefone 2</Label>
            <Input
              value={editingAgency.phone2}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  phone2: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Slogan</Label>
            <Input
              value={editingAgency.slogan}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  slogan: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Endereço</Label>
            <Input
              value={editingAgency.address}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  address: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Input
              value={editingAgency.description}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>URL Logo</Label>
            <Input
              value={editingAgency.imglogo}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  imglogo: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Twitter</Label>
            <Input
              value={editingAgency.twitter}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  twitter: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Whatsapp</Label>
            <Input
              value={editingAgency.watsapp}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  watsapp: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>YouTube</Label>
            <Input
              value={editingAgency.youyube}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  youyube: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>facebook</Label>
            <Input
              value={editingAgency.facebook}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  facebook: e.target.value,
                })
              }
            />
          </div>

                    <div>
            <Label>linkedin</Label>
            <Input
              value={editingAgency.linkedin}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  linkedin: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>instagram</Label>
            <Input
              value={editingAgency.instagram}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  instagram: e.target.value,
                })
              }
            />
          </div>

                    <div>
            <Label>Imagem principal</Label>
            <Input
              value={editingAgency.backgroundImage}
              onChange={(e) =>
                setEditingAgency({
                  ...editingAgency,
                  backgroundImage: e.target.value,
                })
              }
            />
          </div>


        </div>

        
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditOpen(false)}>
        Cancelar
      </Button>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Salvar
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
