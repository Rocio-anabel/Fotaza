import {z} from 'zod';

export const comentarioSchema = z.object({
    idImagen: z.coerce.number().min(1),
    comentario: z.string().min(1)
})