export interface Fornecedor {
  id: string | null;
  nm_fornecedor: string | null;
  cnpj: string | null;
  endereco: string | null;
  email: string | null;
  telefone: string | null;
  celular: string | null;
  logo_url: string | null;
}

export type CreateFornecedor = Omit<Fornecedor, "id">;

