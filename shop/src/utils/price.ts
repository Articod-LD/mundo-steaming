export function formatPrecioColombiano(precio:string) {
    const precioConvert = Number(precio)
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(precioConvert);
}
