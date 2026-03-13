import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contactAPI } from "../../utils/api";
import React from "react";
import { Card, CardContent } from "../ui/card";

interface Contact {
    id: string;
    name: string;
    email: string;
    message: string;
    phone: string;
    destination: string;
    createdAt: string;
}
export function ContactManager() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setIsLoading(true);
            const data = await contactAPI.getAll();
            console.log("Loaded contacts:", data);
            setContacts(data.contacts || []);
        } catch (error) {
            toast.error("Erro ao carregar contatos");
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja deletar este contato?")) {
            try {
                setDeletingId(id);
                await contactAPI.delete(id);
                toast.success("Contato deletado com sucesso");
                loadContacts();
            } catch (error) {
                console.error("Error deleting contact:", error);
                toast.error("Erro ao deletar contato");
            } finally {
                setDeletingId(null);
            }   
        }
    };

    return (
      <div>
       
        <h2 className="text-2xl font-bold mb-4">Gerenciador de Contatos</h2>
        <h6 className="text-sm text-gray-500">Aqui você pode visualizar e gerenciar os contatos enviados pelos clientes através do formulário de contato.</h6>
        

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
                    <TableHead>Destino</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.destination}</TableCell>
                        <TableCell>{contact.message}</TableCell>
                        <TableCell>
                        {new Date(contact.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deletingId === contact.id}
                        >
                            {deletingId === contact.id ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                            <Trash2 className="w-4 h-4" />
                            )}
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        )}
</div>
    );
}   
