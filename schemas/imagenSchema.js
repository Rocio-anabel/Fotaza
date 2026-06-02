import { z } from 'zod';

export const imagenSchema = z.object({
  imagenes: z.array(z.any())
    .min(1, 'Se requiere mínimo 1 imágen'),
});