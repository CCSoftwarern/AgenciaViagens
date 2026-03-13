export interface Profile {
    id: string | null;
    nome: string;
    email: string;
    created_at: Date | null;
}

export type CreateProfile = Omit<Profile, "id">;