import {fa, faker} from "@faker-js/faker"


export const generaUsuario=()=>{
    let nombre=faker.person.firstName()
    let apellido=faker.person.lastName()
    let email=faker.internet.email({firstName:nombre, lastName:apellido})
    let password=faker.internet.password({length:6})
    let dni=faker.number.int({min:10000000, max:65000000})
    return {
        nombre, apellido, email, password, dni
    }
}