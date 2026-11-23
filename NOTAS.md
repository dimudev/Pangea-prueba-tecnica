# Notas técnicas del trabajo realizado

- **Entorno y herramientas:** 
  - Trabajé directamente con **Node.js (v24.21.0)** aprovechando su capacidad nativa para ejecutar TypeScript sin necesidad de configurar compiladores externos complejos (`--experimental-strip-types`).
  - Uso de autocompletado inteligente y asistencia de código para acelerar la escritura de código repetitivo y consultas rápidas de sintaxis, manteniendo el criterio propio en la arquitectura, la lógica financiera (lista blanca) y las validaciones de la CLI.

- **Cómo abordé el desarrollo:**
  1. **Corrección de errores (Bugfix):** Primero investigué por qué el saldo de las facturas fallaba con los pagos reversados. Descubrí una discrepancia en los nombres de los estados (`REVERSADO` vs `REVERTIDO`) y opté por blindar la función usando una lista blanca (`APLICADO`), asegurando que solo los pagos reales muevan el dinero.
  2. **Automatización (CLI):** Desarrollé los comandos `deudores` y `recaudo` dentro del archivo de la terminal (`src/cli.ts`), reutilizando la lógica de negocio ya existente para mantener todo ordenado.
  3. **Experiencia de uso (UX en consola):** Además de cumplir estrictamente con la salida en formato `--json` que pide la prueba para automatizaciones, añadí un formateador visual con `console.table` y formato de moneda local (`COP`) para cuando el equipo quiera consultar los datos de forma interactiva en la pantalla.
  4. **Calidad:** Agregué una prueba unitaria en la carpeta `test/` para validar el comportamiento del saldo con los pagos reversados y corrí la suite completa para verificar que todo pasara en verde.