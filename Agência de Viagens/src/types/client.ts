export interface Client {
  id: string;
  nome: string;
  email?: string;
  cpf?: string;
  rg?: string;
  data_nascimento?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  icone?: string;
  anexos?: Anexo[];
}

export interface Anexo {
  fileName: string;
  url: string;
}

export type CreateClient = Omit<Client, "id">;