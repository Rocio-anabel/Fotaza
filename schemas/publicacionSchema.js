import { z } from 'zod';

export const publicacionSchema = z.object({
    titulo: z.string()
        .min(1, 'El título es obligatorio'),
    descripcion: z.string().nullable(),
    licencia: z.string().optional().transform(val => val === 'on'),
    marcaAgua: z.string().optional(),
    etiquetas: z.string()
        .min(1,'Se requiere minimo una etiqueta')
        .regex(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+(,\s*[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+)*$/,
                'Formato inválido. Ejemplo: naturaleza, retrato, blanco, negro'
              )
})
    .refine(
      data => {
        if (data.licencia === 'on') {
          return data.marcaAgua && data.marcaAgua.trim() !== '';
        }
        return true;
      },
      {
        message: 'La marca de agua es obligatoria',
        path: ['marcaAgua'], 
      }
    );


