/**
 * Dominio → Formulario
 * (editar)
 */
export function toArticuloprecioForm(data: Articuloprecio): ArticuloprecioForm {
  return {
    id: data.id,
    articuloid: data.articuloid,
    categid: String(data.categid),
    precio: data.precio,
    factorconversion: data.factorconversion,
    changedate: data.changedate
  }
}

/**
 * Formulario → Dominio
 * (guardar)
 */
export function toArticuloprecioDomain(
  form: ArticuloprecioForm
): Articuloprecio {
  return {
    id: form.id ?? 0,
    articuloid: form.articuloid ?? 0,
    categid: Number(form.categid),
    precio: form.precio,
    factorconversion: form.factorconversion,
    changedate: form.changedate
  }
}
