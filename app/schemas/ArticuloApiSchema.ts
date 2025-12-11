import { z } from 'zod'

// Sub-interfaces
export const ArticuloEditSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  activo: z.boolean().optional()
})

export type ArticuloEdit = z.infer<typeof ArticuloEditSchema>
