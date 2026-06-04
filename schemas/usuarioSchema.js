import {  z } from 'zod';

export const usuarioSchema = z.object({
    nombre: z.string()
        .min(1, 'El nombre es obligatorio'),
    apellido: z.string()
        .min(1, 'El apellido es obligatorio'),
    email: z.string()   
        .min(1, 'El correo electrónico es obligatorio')
        .email('El formato de email ingresado no es válido'),
    password: z.string()
        .min(6, 'Contraseña debe contener al menos 6 caracteres'),
    fechaNacimiento: z.string()
        .min(1, 'La fecha de nacimiento es obligatoria')
        .date(),
    sexo: z.string('Por favor seleccione una opción')
        .min(1, 'El campo no puede estar vacío'),
    bio: z.string().optional()
});