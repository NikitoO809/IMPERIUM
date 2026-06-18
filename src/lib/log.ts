// Registro mínimo de errores de consulta a la base de datos.
// La capa de datos degrada a listas/valores vacíos cuando una query falla, para no
// romper la página. Pero un fallo (RLS mal puesta, columna renombrada, caída de
// Supabase) NO debe pasar desapercibido: lo dejamos en los logs del servidor (Vercel)
// para poder diagnosticar. Distingue "0 filas" (normal) de "error de query" (problema).
export function logDbError(where: string, error: unknown): void {
  if (error) console.error(`[db] ${where}:`, error);
}
