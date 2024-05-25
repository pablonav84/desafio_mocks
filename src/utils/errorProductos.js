import os from "os"

export function argumentosProductos(producto){
    let {code, ...otros}=producto
    return `Se han detectado args inválidos.
Argumentos requeridos:
    - code: tipo numero entero. Se ingresó ${code}
Argumentos opcioneales:
    - descrip, precio, stock. Se ingresó ${JSON.stringify(otros)}

Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`
}