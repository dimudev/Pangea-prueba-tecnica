# Reportes y Avisos para los equipos

## Para el equipo de Caja
Hola buenos días/tardes, les escribo para comentarles que revisé el cálculo de los cobros en las facturas porque noté que, cuando un pago se anulaba (reversaba), el sistema a veces se confundía y lo seguía tomando en cuenta de forma incorrecta. Ya corregí ese detalle para que el sistema únicamente sume el dinero que entró de verdad a la caja con pagos aprobados. De esta manera, si un pago se anula, el saldo de la factura se mantiene exacto y no descuadra las cuentas.

## Para el equipo de Recepción
Hola buenos días/tardes, ya quedó listo el comando en el sistema para que puedan consultar la lista de **deudores** cuando lo necesiten. 
Solo tienen que escribir el comando de deudores en la pantalla de comandos del sistema. El programa revisa automáticamente las facturas que están pendientes por cobrar, calcula cuánto debe cada paciente y se los ordena de mayor a menor deuda para que sepan a quién llamar o gestionar primero. Si hay dos personas que deben exactamente la misma cantidad, el sistema las ordena de manera ordenada por su número de historia/identificación.

## Para el equipo de Facturación
Hola buenos días/tardes, ya configuré el reporte de **recaudo** por fechas que me pidieron. 
Para consultarlo, solo deben indicar la fecha de inicio y la fecha de cierre que desean revisar. El sistema agrupa todo el dinero que ingresó en ese periodo exacto y se los totaliza según el método con el que pagaron (efectivo, tarjeta, etc.). 
*Una aclaración sobre los datos:* Noté que a veces en el sistema escribían los métodos de pago con minúsculas, mayúsculas o espacios extra (por ejemplo, "efectivo", "EFECTIVO", " tarjeta "). Para evitar que el reporte saliera desordenado con filas repetidas por un simple error de digitación, le puse una pequeña limpieza automática para que unifique todo prolijamente bajo un mismo nombre.