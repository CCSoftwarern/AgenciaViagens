import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Plus, Pencil, Trash2, Save, Loader2, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } from "../../utils/supabase/info";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);


export function UsersManager() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nome: "",
    email: "",
    telefone: ""
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
   const [formUser, setFormUser] = useState({
    nome: "",
    email: "",
    password: ""
  });

   function handleChangeUser(e:any){
    setFormUser({...formUser,[e.target.name]:e.target.value})
  }


  async function criarUsuario(){
    setIsSaving(true);
    const { error } = await supabase.auth.signUp({
      email: formUser.email,
      password: formUser.password,
      options:{
        data:{
          display_name: formUser.nome
        }
      }
    })
    setIsSaving(false);


    if(error){
      alert(error.message)
      return
    }

    toast.success("Usuário criado com sucesso");

    setShowModal(false)
    setIsDialogOpen(false);
    listarUsuarios();
    setFormUser({
      nome:"",
      email:"",
      password:""
    })
  }


  async function handleDelete(id:string) {
    setDeletingId(id);

    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        setIsLoading(true);
        await supabase.auth.admin.deleteUser(id);
        toast.success("Usuário deletado com sucesso");
        listarUsuarios();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Erro ao deletar usuário");
      } finally {
        setDeletingId(null);
        setIsLoading(false);
      }
    }
  }


  async function listarUsuarios() {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsuarios(data || []);
    setIsLoading(false);
  }

  useEffect(() => {
    listarUsuarios();
  }, []);

  function handleChange(e:any){
    setForm({...form,[e.target.name]:e.target.value})
  }

  async function salvar() {

    if(form.id){

      await supabase
      .from("profiles")
      .update({
        nome:form.nome,
        email:form.email,
        telefone:form.telefone
      })
      .eq("id",form.id)

    }else{

      await supabase
      .from("profiles")
      .insert([form])

    }

    setForm({
      id:"",
      nome:"",
      email:"",
      telefone:""
    })

    listarUsuarios()
  }

  function editar(usuario:any){
    setForm(usuario)
  }

  async function excluir(id:string){

    await supabase
    .from("profiles")
    .delete()
    .eq("id",id)

    listarUsuarios()
  }

  return (

  <div>
  <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl">Gerenciar Usuários</h1>

  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogTrigger asChild>
      <Button
        onClick={() => {
          setFormUser({
            nome: "",
            email: "",
            password: "",
          });
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Usuário
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Novo Usuário</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          criarUsuario();
        }}
        className="space-y-4"
      >

        <div className="grid grid-cols-1 gap-4">

          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              maxLength={150}
              value={formUser.nome}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  nome: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              maxLength={254}
              value={formUser.email}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  email: e.target.value.toLowerCase(),
                })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              minLength={6}
              value={formUser.password}
              onChange={(e) =>
                setFormUser({
                  ...formUser,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

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
                    <TableHead>Data</TableHead>

                    </TableRow>
                </TableHeader>

                <TableBody>
                    {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                        <TableCell>{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                        {new Date(usuario.created_at).toLocaleString()}
                        </TableCell>
              
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        )}
</div>
    )
}
function handleDelete(id: any): any {
  throw new Error("Function not implemented.");
}