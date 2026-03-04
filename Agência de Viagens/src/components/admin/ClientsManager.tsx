import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table";
import { Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Client } from "../../types/client";
import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } from "../../utils/supabase/info";

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);

export function ClientsManager() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);  
  const [formData, setFormData] = useState<Partial<Client>>({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      endereco: "",
  });


  useEffect(() => {
    getClientes();
  }, []);

  

  async function getClientes() {
    const { data } = await supabase.from("clientes").select();
    setClientes(data ?? []);
    setIsLoading(false);
  }

  async function addCliente(formData: any) {
    setIsSaving(true);
    if (editingClientId) {
      try {
        await supabase.from("clientes").update(formData).eq("id", editingClientId);
        setClientes(clientes.map(cliente => cliente.id === editingClientId ? { ...cliente, ...formData } as Client : cliente));
        toast.success("Cliente atualizado com sucesso!");
      } catch (error) {
        console.error("Error updating client:", error);
        toast.error("Erro ao atualizar cliente");
      } finally {
        setIsSaving(false);
        setIsDialogOpen(false);
      }
    } else {
      try {
        const { data } = await supabase.from("clientes").insert(formData).select();
      
      setClientes([...clientes, ...data ?? []]);
      toast.success("Cliente adicionado com sucesso!");
      
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Erro ao adicionar cliente"); 
    } finally {
      setIsSaving(false);
      setIsDialogOpen(false);
    }
    setFormData({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        endereco: "",
    });
    setIsSaving(false);


  }
}

  
  async function deleteCliente(id: string | number) {
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      try {
        await supabase.from("clientes").delete().eq("id", id);
        setClientes(clientes.filter((cliente) => cliente.id !== id));
        toast.success("Cliente deletado com sucesso!");
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Erro ao deletar cliente");
      }
    }

  }


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

  const handleEdit = (cliente: Client) => {
      setEditingClientId(cliente.id);
      setFormData(cliente);
      setIsDialogOpen(true);
    };

  const formatTelefone = (value: string) => {
  value = value.replace(/\D/g, "").slice(0, 11); // só números, máximo 11

  if (value.length <= 10) {
    // Telefone fixo: (84) 3333-3333
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  // Celular: (84) 99999-9999
  return value
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

 return (
  <div>
    {/* HEADER */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl">Gerenciar Clientes</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setEditingClientId(null);
              setFormData({
                nome: "",
                email: "",
                cpf: "",
                telefone: "",
                endereco: "",
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClientId ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); addCliente(formData); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  maxLength={150} 
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  maxLength={254}
                  value={formData.email}
                 onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                    <Input
                  type="text"
                  id="cpf"
                  inputMode="numeric"
                  maxLength={14} // 11 números + 3 pontos + 1 traço
                  value={formData.cpf}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

                    // limita a 11 dígitos
                    value = value.slice(0, 11);

                    // aplica máscara
                    value = value
                      .replace(/^(\d{3})(\d)/, "$1.$2")
                      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                      .replace(/\.(\d{3})(\d)/, ".$1-$2");

                    setFormData({
                      ...formData,
                      cpf: value,
                    });
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                type="text"
                  id="telefone"
                  inputMode="numeric"
                  maxLength={15} // (99) 99999-9999
                  value={formData.telefone}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefone: formatTelefone(e.target.value),
                  })
                }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                maxLength={255}
                value={formData.endereco}
                onChange={handleChange}
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

    {/* TABLE */}
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.endereco}</TableCell>
                <TableCell>
                  {new Date(cliente.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                   size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cliente)}
                  >
                       <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCliente(cliente.id)}
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