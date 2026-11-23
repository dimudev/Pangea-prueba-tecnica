import { test } from "node:test";
import assert from "node:assert/strict";
import { saldoDeFactura, registrarAbono, reversarPago } from "../src/facturacion.ts";
import type { Factura, Pago } from "../src/modelo.ts";

const factura: Factura = { id: 1, pacienteId: 1, fecha: "2026-11-02", valorTotal: 200000, estado: "EMITIDA" };
const pago = (id: number, valor: number, estado = "APLICADO"): Pago => ({ id, facturaId: 1, fecha: "2026-11-03", valor, metodo: "EFECTIVO", estado });

test("saldo sin pagos es el total", () => {
  assert.equal(saldoDeFactura(factura, []), 200000);
});
test("saldo descuenta pagos aplicados", () => {
  assert.equal(saldoDeFactura(factura, [pago(1, 50000)]), 150000);
});
test("abono nuevo actualiza el saldo", () => {
  const r = registrarAbono(factura, [pago(1, 50000)], 100000, "Efectivo", "2026-11-04");
  assert.equal(r.saldo, 50000);
});
test("no permite abonar más que el saldo", () => {
  assert.throws(() => registrarAbono(factura, [], 300000, "Efectivo", "2026-11-04"));
});
test("reversar marca el pago como reversado", () => {
  const r = reversarPago([pago(1, 50000)], 1);
  assert.equal(r[0].estado, "REVERSADO");
});
