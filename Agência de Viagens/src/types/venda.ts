export interface Venda {
    id: string | null;
    id_fornecedor: string  | null;
    nm_fornecedor: string | null;
    id_produto: string  | null;
    nm_produto: string;
    desc_produto: string;
    id_cliente: string  | null;
    nm_cliente: string;
    id_vendedor: string  | null;
    nm_vendedor: string;
    dt_lancamento: null |Date;
    dt_venda: null | Date;
    dt_cancelamento: null | Date;
    dt_reembolso: null | Date;
    dt_embarque: null | Date;
    dt_retorno: null | Date;
    status: "pendente" | "confirmado" | "cancelado" | "reembolsado";
    vr_lancamento: number;
    vr_taxas: number;
    vr_desconto: number;
    vr_abatimento: number;
    vr_comissao: number;
    porc_comissao: number;
    vr_parcelado: number;
    vr_entrada: number;
    vr_saldo: number;
    nm_passageiros: string[];
    nm_forma_pagamento: string | null;
    nr_reserva: string | null;
}

export type CreateClient = Omit<Venda, "id">;