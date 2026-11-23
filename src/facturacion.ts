import type { Factura, Pago } from "./modelo.ts";

/** Total pagado de una factura (dinero que realmente entró). */
export function pagadoDeFactura(facturaId: number, pagos: Pago[]): number {
  return pagos
    .filter((p) => p.facturaId === facturaId && p.estado === "APLICADO")
    .reduce((suma, p) => suma + p.valor, 0);
}

export function saldoDeFactura(factura: Factura, pagos: Pago[]): number {
  return factura.valorTotal - pagadoDeFactura(factura.id, pagos);
}

export interface ResultadoAbono {
  pago: Pago;
  saldo: number;
}

/** Registra un abono sobre una factura y devuelve el nuevo saldo. */
export function registrarAbono(
  factura: Factura,
  pagos: Pago[],
  valor: number,
  metodo: string,
  fecha: string,
): ResultadoAbono {
  if (factura.estado !== "EMITIDA") {
    throw new Error("La factura no está emitida");
  }
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new Error("El valor del abono debe ser un entero positivo");
  }
  if (valor > saldoDeFactura(factura, pagos)) {
    throw new Error("El abono supera el saldo de la factura");
  }
  const id = pagos.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  const pago: Pago = { id, facturaId: factura.id, fecha, valor, metodo, estado: "APLICADO" };
  const nuevos = [...pagos, pago];
  return { pago, saldo: saldoDeFactura(factura, nuevos) };
}

/** Reversa un pago: queda en el historial pero deja de contar. */
export function reversarPago(pagos: Pago[], pagoId: number): Pago[] {
  const pago = pagos.find((p) => p.id === pagoId);
  if (!pago) throw new Error(`No existe el pago ${pagoId}`);
  if (pago.estado === "REVERSADO") throw new Error("El pago ya estaba reversado");
  return pagos.map((p) => (p.id === pagoId ? { ...p, estado: "REVERSADO" } : p));
}
