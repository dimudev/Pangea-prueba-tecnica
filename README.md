# clinica-cobros

Módulo de caja de la clínica: facturas, abonos y pagos de pacientes.
Lo usa el personal de **Caja** y **Recepción**. Funciona desde hace unos meses.

## Requisitos
- Node.js 22.18 o superior (ejecuta TypeScript directamente; no hay que instalar nada).

## Uso
```
node src/cli.ts facturas
node src/cli.ts saldo 12
node src/cli.ts abonar 12 "250.000" Efectivo 2026-11-16
node src/cli.ts reversar 35
```
Agrega `--json` a cualquier comando para obtener la salida en JSON.

## Pantalla web
```
npm run web
```
Abre http://localhost:3000. Muestra las facturas, sus pagos y permite registrar abonos y reversar pagos.
Es la misma lógica que usa la línea de comandos.

## Pruebas
```
npm test
```

## Datos
Los datos están en `data/*.json` (pacientes, facturas, pagos). Los pagos vienen de un
sistema anterior; el campo `metodo` lo escribe quien registra el pago.
