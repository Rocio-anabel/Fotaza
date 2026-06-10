import {z} from 'zod';

export const votoSchema = z.object({
    idImagen: z.coerce.number().min(1),
    valor: z.coerce.number().min(1)
});