import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as repo from "./repo.ts";
import { parsePesos } from "./dinero.ts";
import { registrarAbono, reversarPago, saldoDeFactura, pagadoDeFactura } from "./facturacion.ts";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PORT ?? 3000);

function resumenFactura(f: ReturnType<typeof repo.facturas>[number]) {
  const pagos = repo.pagos();
  const paciente = repo.pacientes().find((p) => p.id === f.pacienteId);
  return {
    id: f.id,
    fecha: f.fecha,
    estado: f.estado,
    pacienteId: f.pacienteId,
    paciente: paciente?.nombre ?? "",
    eps: paciente?.eps ?? null,
    valorTotal: f.valorTotal,
    pagado: pagadoDeFactura(f.id, pagos),
    saldo: saldoDeFactura(f, pagos),
  };
}

function leerCuerpo(req: import("node:http").IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (c) => (datos += c));
    req.on("end", () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch (e) { reject(e); }
    });
  });
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const enviar = (codigo: number, cuerpo: unknown, tipo = "application/json") => {
    res.writeHead(codigo, { "Content-Type": tipo + "; charset=utf-8" });
    res.end(tipo === "application/json" ? JSON.stringify(cuerpo) : String(cuerpo));
  };
  try {
    if (req.method === "GET" && url.pathname === "/") {
      return enviar(200, readFileSync(join(AQUI, "..", "public", "index.html"), "utf-8"), "text/html");
    }
    if (req.method === "GET" && url.pathname === "/api/facturas") {
      return enviar(200, repo.facturas().map(resumenFactura));
    }
    const m = url.pathname.match(/^\/api\/facturas\/(\d+)$/);
    if (req.method === "GET" && m) {
      const f = repo.facturas().find((x) => x.id === Number(m[1]));
      if (!f) return enviar(404, { error: "No existe la factura" });
      const pagos = repo.pagos().filter((p) => p.facturaId === f.id);
      return enviar(200, { ...resumenFactura(f), pagos });
    }
    if (req.method === "POST" && url.pathname === "/api/abonar") {
      const { facturaId, valor, metodo, fecha } = await leerCuerpo(req);
      const f = repo.facturas().find((x) => x.id === Number(facturaId));
      if (!f) return enviar(404, { error: "No existe la factura" });
      const pagos = repo.pagos();
      const r = registrarAbono(f, pagos, parsePesos(String(valor)), String(metodo), String(fecha));
      repo.guardarPagos([...pagos, r.pago]);
      return enviar(200, { pagoId: r.pago.id, saldo: r.saldo });
    }
    if (req.method === "POST" && url.pathname === "/api/reversar") {
      const { pagoId } = await leerCuerpo(req);
      repo.guardarPagos(reversarPago(repo.pagos(), Number(pagoId)));
      return enviar(200, { pagoId: Number(pagoId), estado: "REVERSADO" });
    }
    enviar(404, { error: "No encontrado" });
  } catch (e) {
    enviar(400, { error: (e as Error).message });
  }
});

servidor.listen(PUERTO, () => console.log(`Caja disponible en http://localhost:${PUERTO}`));
