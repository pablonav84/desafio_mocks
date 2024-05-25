import {fa, faker} from "@faker-js/faker"


export const generaFactura=()=>{
    let nroComp="00"+faker.string.numeric({length:2, allowLeadingZeros:true})+"-"+faker.string.numeric({length:8, allowLeadingZeros:true})
    let fecha=faker.date.past({years:3})
    let cliente=generaUsuario()
    delete cliente.password
    let carrito=[]
    for(let i=0; i<faker.number.int({min:1, max:15}); i++){
        let producto=generaProducto()
        producto.cantidad=faker.number.int({min:1, max:100})
        carrito.push(producto)
    }
    let total=carrito.reduce((a, i)=>i.precio*i.cantidad,0)

    return{nroComp, fecha, cliente, carrito, total}
}