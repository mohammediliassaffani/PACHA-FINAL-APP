import { z } from 'zod';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENCY = 'AGENCY',
  AGENT = 'AGENT',
}
const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});
export const formSchema = z.object({
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  password: z
    .string()
    .min(8, 'La chaîne doit contenir au moins 8 caractères')
    .max(75, 'La chaîne ne doit pas dépasser 75 caractères'),
});
export const restformSchema = z.object({
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  newPassword: z
    .string()
    .min(8, 'La chaîne doit contenir au moins 8 caractères')
    .max(75, 'La chaîne ne doit pas dépasser 75 caractères'),
});

const userSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const responseSchema = z.object({
  tokens: tokenSchema,
  user: userSchema,
});

export interface UserAuth {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    avatarUrl: string;
    isVerified: boolean;
    email: string;
    username: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expiresIn: number;
  };
}
export type FormSchemaType = z.infer<typeof formSchema>;
export type RestFormData = z.infer<typeof restformSchema>;

export type ResponseType = z.infer<typeof responseSchema>;
export type AuthUserRespondType = z.infer<typeof userSchema>;
