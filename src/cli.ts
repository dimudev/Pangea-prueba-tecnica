import * as repo from "./repo.ts";
import { parsePesos, formatoCOP } from "./dinero.ts";
import { registrarAbono, reversarPago, saldoDeFactura, pagadoDeFactura } from "./facturacion.ts";

const [, , comando, ...resto] = process.argv;
const json = resto.includes("--json");
const args = resto.filter((a) => a !== "--json");

function salida(objeto: unknown, texto: string): void {
  if (json) {
    console.log(JSON.stringify(objeto));
  } else {
    if (Array.isArray(objeto)) {
      const tablaFormateada = objeto.map((item) => {
        const clon = { ...item };
        if (typeof clon.saldo === "number") clon.saldo = formatoCOP(clon.saldo);
        if (typeof clon.total === "number") clon.total = formatoCOP(clon.total);
        return clon;
      });
      console.table(tablaFormateada);
    } else {
      console.log(texto);
    }
  }
}

function facturaPorId(id: number) {
  const f = repo.facturas().find((x) => x.id === id);
  if (!f) throw new Error(`No existe la factura ${id}`);
  return f;
}

try {
  switch (comando) {
    case "facturas": {
      const pagos = repo.pagos();
      const lista = repo.facturas().map((f) => ({
        id: f.id,
        pacienteId: f.pacienteId,
        estado: f.estado,
        valorTotal: f.valorTotal,
        saldo: saldoDeFactura(f, pagos),
      }));
      salida(lista, lista.map((f) => `#${f.id}  paciente ${f.pacienteId}  ${f.estado}  total ${formatoCOP(f.valorTotal)}  saldo ${formatoCOP(f.saldo)}`).join("\n"));
      break;
    }
    case "saldo": {
      const f = facturaPorId(Number(args[0]));
      const pagos = repo.pagos();
      const r = { facturaId: f.id, valorTotal: f.valorTotal, pagado: pagadoDeFactura(f.id, pagos), saldo: saldoDeFactura(f, pagos) };
      salida(r, `Factura ${f.id}: total ${formatoCOP(r.valorTotal)}, pagado ${formatoCOP(r.pagado)}, saldo ${formatoCOP(r.saldo)}`);
      break;
    }
    case "abonar": {
      // abonar <facturaId> <valor> <metodo> <fecha YYYY-MM-DD>
      const f = facturaPorId(Number(args[0]));
      const pagos = repo.pagos();
      const { pago, saldo } = registrarAbono(f, pagos, parsePesos(args[1]), args[2], args[3]);
      repo.guardarPagos([...pagos, pago]);
      salida({ pagoId: pago.id, facturaId: f.id, saldo }, `Abono ${pago.id} registrado. Nuevo saldo: ${formatoCOP(saldo)}`);
      break;
    }
    case "reversar": {
      const pagos = reversarPago(repo.pagos(), Number(args[0]));
      repo.guardarPagos(pagos);
      salida({ pagoId: Number(args[0]), estado: "REVERSADO" }, `Pago ${args[0]} reversado`);
      break;
    }

      case "deudores": {
      const pacientes = repo.pacientes();
      const pagos = repo.pagos();
      const facturasEmitidas = repo.facturas().filter((f) => f.estado === "EMITIDA");

      const deudasPorPaciente = new Map<number, number>();
      for (const f of facturasEmitidas) {
        const saldo = saldoDeFactura(f, pagos);
        if (saldo > 0) {
          deudasPorPaciente.set(
            f.pacienteId,
            (deudasPorPaciente.get(f.pacienteId) || 0) + saldo
          );
        }
      }

      const lista = Array.from(deudasPorPaciente.entries())
        .map(([pacienteId, saldo]) => {
          const paciente = pacientes.find((p) => p.id === pacienteId);
          return {
            pacienteId,
            nombre: paciente?.nombre ?? "Desconocido",
            saldo,
          };
        })
        .sort((a, b) => {
          if (b.saldo !== a.saldo) {
            return b.saldo - a.saldo; 
          }
          return a.pacienteId - b.pacienteId; 
        });

      salida(
        lista,
        lista
          .map(
            (d) =>
              `Paciente #${d.pacienteId} - ${d.nombre}: saldo pendiente ${formatoCOP(d.saldo)}`
          )
          .join("\n")
      );
      break;
    }

    case "recaudo": {
      const desdeIdx = resto.indexOf("--desde");
      const hastaIdx = resto.indexOf("--hasta");

      const desde = desdeIdx !== -1 ? resto[desdeIdx + 1] : null;
      const hasta = hastaIdx !== -1 ? resto[hastaIdx + 1] : null;

      if (!desde || !hasta) {
        throw new Error("Se requieren los parámetros --desde YYYY-MM-DD y --hasta YYYY-MM-DD");
      }

      const pagos = repo.pagos().filter(
        (p) => p.estado === "APLICADO" && p.fecha >= desde && p.fecha <= hasta
      );

      const recaudoPorMetodo = new Map<string, number>();
      for (const p of pagos) {
        const bruto = (p.metodo || "Sin método").trim();
        const metodo = bruto.charAt(0).toUpperCase() + bruto.slice(1).toLowerCase();
        
        recaudoPorMetodo.set(metodo, (recaudoPorMetodo.get(metodo) || 0) + p.valor);
      }

      const lista = Array.from(recaudoPorMetodo.entries()).map(([metodo, total]) => ({
        metodo,
        total,
      }));

      salida(
        lista,
        lista.map((r) => `Método: ${r.metodo} - Total: ${formatoCOP(r.total)}`).join("\n")
      );
      break;
    }


    default:
      console.log("Comandos: facturas | saldo <id> | abonar <id> <valor> <metodo> <fecha> | reversar <pagoId> | deudores | recaudo --desde YYYY-MM-DD --hasta YYYY-MM-DD   (agrega --json para salida en JSON)");
  }
} catch (e) {
  console.error("Error:", (e as Error).message);
  process.exit(1);
}
