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
import { salesAPI } from "../../utils/api";
import { useGoogleLogin } from "@react-oauth/google";
import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } from "../../utils/supabase/info";
import { Venda } from "../../types/venda";
import { Client } from "../../types/client";
import { Fornecedor } from "../../types/fornecedor";
import { Profile } from "../../types/profiles";
import * as XLSX from "xlsx";
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);

export function SalesManager() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const hoje = new Date().toISOString().split("T")[0];
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isSavingCliente, setIsSavingCliente] = useState(false);
  const [isDialogOpenCliente, setIsDialogOpenCliente] = useState(false);
  const [tipoData, setTipoData] = useState(0);
  const [formDataCliente, setFormDataCliente] = useState<Partial<Client>>({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
  });



  const initialFormState: Partial<Venda> = {
    id_fornecedor: null,
    nm_fornecedor: "",
    id_produto: null,
    nm_produto: "",
    desc_produto: "",
    id_cliente: null,
    nm_cliente: "",
    id_vendedor: null,
    nm_vendedor: "",
    dt_lancamento: null,
    dt_venda: null,
    dt_cancelamento: null,
    dt_reembolso: null,
    dt_embarque: null,
    dt_retorno: null,
    status: "pendente",
    vr_lancamento: 0,
    vr_taxas: 0,
    vr_desconto: 0,
    vr_abatimento: 0,
    vr_comissao: 0,
    porc_comissao: 0,
    vr_parcelado: 0,
    vr_entrada: 0,
    vr_saldo: 0,
    nm_passageiros: [],
    nm_forma_pagamento: null,
    nr_reserva: null,
  };


  const [formData, setFormData] = useState<Partial<Venda>>(initialFormState);

  useEffect(() => {
    loadSales();
    loadClientes();
    loadFornecedores();
    loadProfiles();
  }, []);

  const loadSales = async () => {
    try {
      setIsLoading(true);

      const colunaData = tipoData === 0 ? "dt_venda" : "dt_embarque";
      console.log("Carregando vendas com filtro:", { colunaData, dataInicio, dataFim });

      const { data, error } = await supabase
        .from("vendas")
        .select("*")
        .gte(colunaData, dataInicio)
        .lte(colunaData, dataFim);
      setVendas(data ?? []);
      setIsLoading(false);

      if (error) {
        throw error;
      }

      setVendas(data ?? []);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar vendas");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome")
        .order("nome");

      if (error) throw error;

      setClientes(data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes");
    }
  };

  const loadFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from("fornecedor")
        .select("id, nm_fornecedor, cnpj, endereco, email, telefone, celular, logo_url")
        .order("nm_fornecedor");

      if (error) throw error;

      setFornecedores(data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar fornecedores");
    }
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase        
        .from("profiles")
        .select("id, nome, email, created_at")
        .order("nome");

      if (error) throw error;
      setProfiles(data ?? []);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar perfis");
    }
  };

  /* ================= CRUD ================= */

  const handleEdit = (venda: Venda) => {
    setEditingVenda(venda);
    setFormData(venda);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta venda?")) {
      try {
        await supabase.from("vendas").delete().eq("id", id);
        setVendas(vendas.filter((venda) => venda.id !== id));
        toast.success("Venda deletada com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar venda");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const vendaCalculada = {
        ...formData,
        vr_comissao: ((Number(formData.vr_lancamento) - Number(formData.vr_desconto) - Number(formData.vr_abatimento) - Number(formData.vr_taxas)) * Number(formData.porc_comissao)) / 100
      };

      if (editingVenda) {
        // ✏ Atualizar
        const { error } = await supabase
          .from("vendas")
          .update(vendaCalculada)
          .eq("id", editingVenda.id);

        if (error) throw error;

        setVendas(vendas.map(venda =>
          venda.id === editingVenda.id
            ? { ...venda, ...vendaCalculada } as Venda
            : venda
        ));

        toast.success("Venda atualizada com sucesso!");

      } else {
        // ➕ Criar
        const { data, error } = await supabase
          .from("vendas")
          .insert(vendaCalculada)
          .select();

        if (error) throw error;

        setVendas([...vendas, ...(data ?? [])]);

        toast.success("Venda adicionada com sucesso!");
      }

      // 🔄 Reset após sucesso
      setIsDialogOpen(false);
      setEditingVenda(null);
      setFormData(initialFormState);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar venda");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const [filtros, setFiltros] = useState({
    dt_venda_inicio: "",
    dt_venda_fim: "",
  });

  async function addCliente(formData: any) {
    setIsSavingCliente(true);
    if (editingClientId) {
      try {
        await supabase.from("clientes").update(formData).eq("id", editingClientId);
        setClientes(clientes.map(cliente => cliente.id === editingClientId ? { ...cliente, ...formData } as Client : cliente));
        toast.success("Cliente atualizado com sucesso!");
      } catch (error) {
        console.error("Error updating client:", error);
        toast.error("Erro ao atualizar cliente");
      } finally {
        setIsSavingCliente(false);
        setIsDialogOpenCliente(false);
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
        setIsSavingCliente(false);
        setIsDialogOpenCliente(false);
      }
      setFormDataCliente({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        endereco: "",
      });
      setIsSavingCliente(false);


    }
  }


  const handleLimpar = () => {
    const empty = {
      dt_venda_inicio: "",
      dt_venda_fim: "",

    };

    setFiltros(empty);
    loadSales();
  };


  const handleChangeCliente = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormDataCliente({ ...formDataCliente, [id]: value });
  };

const arrayFormaPagamento = [
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "boleto", label: "Boleto Bancário" },
  { value: "pix", label: "Pix" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cheque", label: "Cheque" },
  { value: "deposito", label: "Depósito Bancário" },
  { value: "carteira_digital", label: "Carteira Digital" }
];

  if (isLoading) {
    return (
      <div className= "flex items-center justify-center h-64" >
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );
  }

  const handleEditCliente = (cliente: Client) => {
    setEditingClientId(cliente.id);
    setFormDataCliente(cliente);
    setIsDialogOpenCliente(true);
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

  //Calcular total
  const total = vendas.reduce((acc, venda) => acc + Number(venda.vr_lancamento), 0);

  //Mudar cor do status
  function getStatusStyle(status: string) {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      case "reembolsado":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //Exportar para Excel
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(vendas);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas");

    XLSX.writeFile(workbook, "vendas.xlsx");
  }


  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className= "flex items-center justify-center h-64" >
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div>



    {/* HEADER */ }

    < div className = "flex items-center justify-between mb-8" >
                <div>
        <h1 className="text-3xl">Gerenciar vendas</h1>
        <h6 className="text-sm text-gray-500">Aqui você pode adicionar, editar ou remover as vendas realizadas pela agência.</h6>
          </div>


        < Dialog open = { isDialogOpenCliente } onOpenChange = { setIsDialogOpenCliente } >


          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" >
            <DialogHeader>
            <DialogTitle>
            { editingClientId? "Editar Cliente": "Novo Cliente" }
            </DialogTitle>
            </DialogHeader>

            < form onSubmit = {(e) => { e.preventDefault(); addCliente(formDataCliente); }
              } className = "space-y-4" >
                <div className="grid grid-cols-2 gap-4" >
                  <div>
                  <Label htmlFor="nome" > Nome </Label>
                    < Input
              id = "nome"
              maxLength = { 150}
              value = { formDataCliente.nome }
              onChange = { handleChangeCliente }
              required
                />
                </div>

                < div >
  <Label htmlFor="email" > Email </Label>
    < Input
type = "email"
id = "email"
maxLength = { 254}
value = { formDataCliente.email }
onChange = {(e) =>
setFormDataCliente({
  ...formDataCliente,
  email: e.target.value.toLowerCase(),
})
                  }
required
  />
  </div>
  </div>

  < div className = "grid grid-cols-2 gap-4" >
    <div>
    <Label htmlFor="cpf" > CPF </Label>
      < Input
type = "text"
id = "cpf"
inputMode = "numeric"
maxLength = { 14} // 11 números + 3 pontos + 1 traço
value = { formDataCliente.cpf }
onChange = {(e) => {
  let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

  // limita a 11 dígitos
  value = value.slice(0, 11);

  // aplica máscara
  value = value
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

  setFormDataCliente({
    ...formDataCliente,
    cpf: value,
  });
}}
required
  />
  </div>

  < div >
  <Label htmlFor="telefone" > Telefone </Label>
    < Input
type = "text"
id = "telefone"
inputMode = "numeric"
maxLength = { 15} // (99) 99999-9999
value = { formDataCliente.telefone }
onChange = {(e) =>
setFormDataCliente({
  ...formDataCliente,
  telefone: formatTelefone(e.target.value),
})
                }
required
  />
  </div>
  </div>

  < div >
  <Label htmlFor="endereco" > Endereço </Label>
    < Input
id = "endereco"
maxLength = { 255}
value = { formDataCliente.endereco }
onChange = { handleChangeCliente }
required
  />
  </div>

  < div className = "flex gap-2 justify-end" >
    <Button
                type="button"
variant = "outline"
onClick = {() => setIsDialogOpenCliente(false)}
disabled = { isSavingCliente }
  >
  Cancelar
  </Button>

  < Button type = "submit" disabled = { isSavingCliente } >
    {
      isSavingCliente?(
                  <Loader2 className = "w-4 h-4 mr-2 animate-spin" />
                ): (
          <Save className = "w-4 h-4 mr-2" />
                )}
Salvar
  </Button>
  </div>
  </form>
  </DialogContent>
  </Dialog>


  < div className = "flex gap-2" >
    <Dialog open={ isDialogOpen } onOpenChange = { setIsDialogOpen } >
      <DialogTrigger asChild >
      <Button
            onClick={
  () => {
    setEditingVenda(null);
    setFormData(initialFormState);
  }
}
          >
  <Plus className="w-4 h-4 mr-2" />
    Nova venda
      </Button>
      </DialogTrigger>

      < DialogContent className = "max-w-4xl max-h-[90vh] overflow-y-auto" >
        <DialogHeader>
        <DialogTitle>
        { editingVenda? "Editar Venda": "Nova Venda" }
        </DialogTitle>
        </DialogHeader>

        < form onSubmit = { handleSubmit } className = "space-y-4" >

          {/* CLIENTE / PRODUTO */ }
          < div className = "grid grid-cols-2 gap-4" >
            <div>
            <Label htmlFor="nr_reserva" > Reserva </Label>
              < Input
id = "nr_reserva"
value = { formData.nr_reserva ?? "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="status" > Status </Label>
    < select
id = "status"
value = { formData.status }
onChange = { handleChange }
required
className = "w-full border rounded-md p-2"
  >
  <option value="pendente" > Pendente </option>
    < option value = "confirmado" > Confirmado </option>
      < option value = "cancelado" > Cancelado </option>
        < option value = "reembolsado" > Reembolsado </option>
          </select>
          </div>




          </div>

          < div >
          <Label htmlFor="id_cliente" > Cliente </Label>
            < select
id = "id_cliente"
value = { formData.id_cliente ?? "" }
onChange = {(e) => {
  const selectedId = e.target.value || null;

  const clienteSelecionado = clientes.find(
    (c) => c.id === selectedId
  );

  setFormData({
    ...formData,
    id_cliente: selectedId,
    nm_cliente: clienteSelecionado?.nome || "",
  });
}}
className = "w-full border rounded-md p-2"
required
  >
  <option value="" > Selecione um cliente </option>

{
  clientes.map((cliente) => (
    <option key= { cliente.id } value = { cliente.id } >
    { cliente.nome }
    </option>
  ))
}
</select>

  </div>

  < div className = "col-span-2" >
    <Label htmlFor="nm_produto" > Produto </Label>
      < Input
id = "nm_produto"
value = { formData.nm_produto }
onChange = { handleChange }
required
  />
  </div>

{/* FORNECEDOR / VENDEDOR */ }
<div className="grid grid-cols-2 gap-4" >
  <div>
  <div>
  <Label htmlFor="id_fornecedor" > Fornecedor </Label>

    < select
id = "id_fornecedor"
value = { formData.id_fornecedor ?? "" }
onChange = {(e) => {
  const selectedId = e.target.value || null;

  const fornecedorSelecionado = fornecedores.find(
    (f) => f.id === selectedId
  );

  setFormData({
    ...formData,
    id_fornecedor: selectedId,
    nm_fornecedor: fornecedorSelecionado?.nm_fornecedor || "",
  });
}}
className = "w-full border rounded-md p-2"
required
  >
  <option value="" > Selecione um fornecedor </option>

{
  fornecedores.map((fornecedor) => (
    <option key= { fornecedor.id } value = { fornecedor.id } >
    { fornecedor.nm_fornecedor }
    </option>
  ))
}
</select>
  </div>
  </div>

   <div>
  <Label htmlFor="id_vendedor" > Vendedor </Label>

    < select
		id = "id_vendedor"
		value = { formData.id_vendedor ?? "" }
		onChange = {(e) => {
		  const selectedId = e.target.value || null;

		  const vendedorSelecionado = profiles.find(
			(f) => f.id === selectedId
		  );

		  setFormData({
			...formData,
			id_vendedor: selectedId,
			nm_vendedor: vendedorSelecionado?.nome || "",
		  });
		}}
		className = "w-full border rounded-md p-2"
		required
		  >
		  <option value="" > Selecione um vendedor </option>

		{
		  profiles.map((profile) => (
			<option key= { profile.id } value = { profile.id } >
			{ profile.nome }
			</option>
		  ))
		}
	</select>
  </div>
  </div>
{/* DATAS */ }
<div className="grid grid-cols-3 gap-4" >
  <div>
  <Label htmlFor="dt_venda" > Data Venda </Label>
    < Input
type = "date"
id = "dt_venda"
value = { formData.dt_venda || "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="dt_embarque" > Embarque </Label>
    < Input
type = "date"
id = "dt_embarque"
value = { formData.dt_embarque || "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="dt_retorno" > Retorno </Label>
    < Input
type = "date"
id = "dt_retorno"
value = { formData.dt_retorno || "" }
onChange = { handleChange }
required
  />
  </div>
  </div>

{/* VALORES */ }
<div className="grid grid-cols-3 gap-4" >
  <div>
  <Label htmlFor="vr_lancamento" > Total </Label>
    < Input
type = "number"
id = "vr_lancamento"
value = { formData.vr_lancamento }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="vr_taxas" > Taxas </Label>
    < Input
type = "number"
id = "vr_taxas"
value = { formData.vr_taxas ?? "" }
onChange = { handleChange }
required
  />
  </div>


  < div >
  <Label htmlFor="vr_abatimento" > Abatimentos </Label>
    < Input
type = "number"
id = "vr_abatimento"
value = { formData.vr_abatimento ?? "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="vr_desconto" > Descontos </Label>
    < Input
type = "number"
id = "vr_desconto"
value = { formData.vr_desconto ?? "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="porc_comissao" >% Comissão </Label>
    < Input
type = "number"
id = "porc_comissao"
value = { formData.porc_comissao }
onChange = { handleChange }
required
  />
  </div>

  < div >
  <Label htmlFor="vr_comissao" > Comissão </Label>
    < Input
type = "number"
id = "vr_comissao"
value = { formData.vr_comissao ?? "" }
onChange = { handleChange }
required
  />
  </div>

  < div >
        <Label htmlFor="vr_entrada" > Entrada </Label>
          < Input
          type = "number"
          id = "vr_entrada"
          value = { formData.vr_entrada ?? "" }
          onChange = { handleChange }
          required
        />
  </div>

  < div >
        <Label htmlFor="vr_parcelado" > Parcelado </Label>
          < Input
          type = "number"
          id = "vr_parcelado"
          value = { formData.vr_parcelado ?? "" }
          onChange = { handleChange }
          required
        />
  </div>

  < div >
  <Label htmlFor="nm_forma_pagamento" > Forma de Pagamento </Label>
    < select
        id = "nm_forma_pagamento"
        value = { formData.nm_forma_pagamento ?? "" }
        onChange = { handleChange }
        required
        className = "w-full border rounded-md p-2">
           {arrayFormaPagamento.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))}

    </select>
    </div>
  


  </div>



{/* PASSAGEIROS */ }
<div>
  <Label htmlFor="nm_passageiros" > Passageiros </Label>
    < Input
id = "nm_passageiros"
value = { formData.nm_passageiros }
onChange = { handleChange }
required
placeholder = "Nome1, Nome2, Nome3"
  />
  </div>

{/* BOTÕES */ }
<div className="flex gap-2 justify-end" >
  <Button
                type="button"
variant = "secondary"
onClick = {() => setIsDialogOpenCliente(true)}
disabled = { isSaving }
  >
  <Plus className="w-4 h-4 mr-2" />
    Novo Cliente
      </Button>
      < Button
type = "button"
variant = "outline"
onClick = {() => setIsDialogOpen(false)}
disabled = { isSaving }
  >
  Cancelar
  </Button>

  < Button type = "submit" disabled = { isSaving } >
    {
      isSaving?(
                  <Loader2 className = "w-4 h-4 mr-2 animate-spin" />
                ): (
          <Save className = "w-4 h-4 mr-2" />
                )}
Salvar
  </Button>
  </div>
  </form>
  </DialogContent>
  </Dialog>
  </div>
  </div>

{/* TABELA */ }
<Card className="p-6 shadow-md rounded-2xl" >
  <div className="flex flex-wrap items-end gap-2" >

    <div className="flex flex-col" >
      <label className="text-sm font-medium text-gray-600 mb-1" >
        Data Inicial
          </label>
          < input
type = "date"
value = { dataInicio }
onChange = {(e) => setDataInicio(e.target.value)}
className = "border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  </div>

  < div className = "flex flex-col" >
    <label className="text-sm font-medium text-gray-600 mb-1" >
      Data Final
        </label>
        < input
type = "date"
value = { dataFim }
onChange = {(e) => setDataFim(e.target.value)}
className = "border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  </div>
  < div className = "flex flex-col" >
    <Label htmlFor="filtro" > Filtro </Label>
      < select
id = "filtro"
value = { tipoData }
onChange = {(e) => setTipoData(Number(e.target.value))}
required
className = "w-full border rounded-md p-2"
  >
  <option value="0" > Data da Venda </option>
    < option value = "1" > Data do embarque </option>
      </select>
      </div>

      < div className = "flex flex-col" >
      <Button
          onClick={ () => loadSales() }>
  <Search className="w-4 h-4 mr-2" />

    Buscar
    </Button>
    </div>
    < div className = "flex flex-col" >
      <Button
          onClick={ exportToExcel } variant = "outline"
  >
  <Download className="w-4 h-4 mr-2" />
    Exportar para Excel
      </Button>
      </div>


      </div>
      </Card>
      < div className = "h-4" />
        <Card>
        <CardContent className="p-0" >
          <Table>
          <TableHeader>
          <TableRow>
          <TableHead>ID </TableHead>
          < TableHead > Data da Venda </TableHead>
            < TableHead > Fornecedor </TableHead>
            < TableHead > Cliente </TableHead>
            < TableHead > Produto </TableHead>
            < TableHead > Embarque </TableHead>
            < TableHead > Retorno </TableHead>
            < TableHead > Valor Total </TableHead>
              < TableHead > Status </TableHead>
              < TableHead className = "text-right" > Ações </TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
{
  vendas.map((venda) => (
    <TableRow key= { venda.id } >
    <TableCell>{ venda.id } </TableCell>
    < TableCell > { venda.dt_venda?.split("-").reverse().join("/") } </TableCell>
    < TableCell > { venda.nm_fornecedor } </TableCell>
    < TableCell > { venda.nm_cliente } </TableCell>
    < TableCell > { venda.nm_produto } </TableCell>
    < TableCell > { venda.dt_embarque ? venda.dt_embarque?.split("-").reverse().join("/") : "-" } </TableCell>
    < TableCell > { venda.dt_retorno ? venda.dt_retorno?.split("-").reverse().join("/") : "-" } </TableCell>
    <TableCell>
                R$ { Number(venda.vr_lancamento || 0).toFixed(2)
}
</TableCell>
  < TableCell >
  <span
                  className={ `px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(venda.status)}` }
                >
  { venda.status }
  </span>
  </TableCell>

  < TableCell className = "text-right" >
    <div className="flex gap-2 justify-end" >
      <Button
                    size="sm"
variant = "outline"
onClick = {() => handleEdit(venda)}
                  >
  <Pencil className="w-4 h-4" />
    </Button>

    < Button
size = "sm"
variant = "destructive"
onClick = {() => handleDelete(venda.id)}
                  >
  <Trash2 className="w-4 h-4" />
    </Button>
    </div>
    </TableCell>
    </TableRow>
          ))}
</TableBody>
  < TableFooter >
  <TableRow>
  <TableCell colSpan={ 9 } className = "text-right font-bold" >
    Total
    </TableCell>
    < TableCell className = "text-right font-bold" >
      R$ { total.toFixed(2) }
</TableCell>
  </TableRow>
  </TableFooter>
  </Table>
  </CardContent>
  </Card>

  </div>
  );
}