export interface Paciente {
  id: number;
  documento: string;
  nombre: string;
  eps: string | null;
}

export interface Factura {
  id: number;
  pacienteId: number;
  fecha: string; // YYYY-MM-DD
  valorTotal: number; // pesos enteros
  estado: "EMITIDA" | "ANULADA";
}

// El estado viene de un sistema anterior y no siempre se validó.
export interface Pago {
  id: number;
  facturaId: number;
  fecha: string; // YYYY-MM-DD
  valor: number; // pesos enteros
  metodo: string;
  estado: string;
}
