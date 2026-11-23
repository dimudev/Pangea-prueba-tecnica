import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Factura, Paciente, Pago } from "./modelo.ts";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DATOS = process.env.CLINICA_DATOS ?? join(AQUI, "..", "data");

function leer<T>(archivo: string): T[] {
  return JSON.parse(readFileSync(join(DATOS, archivo), "utf-8")) as T[];
}

export function pacientes(): Paciente[] {
  return leer<Paciente>("pacientes.json");
}
export function facturas(): Factura[] {
  return leer<Factura>("facturas.json");
}
export function pagos(): Pago[] {
  return leer<Pago>("pagos.json");
}
export function guardarPagos(lista: Pago[]): void {
  writeFileSync(join(DATOS, "pagos.json"), JSON.stringify(lista, null, 2) + "\n");
}
