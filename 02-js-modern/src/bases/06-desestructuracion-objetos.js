
 // Desestructuracion

// const { useContext } = require("react");

 // Asignacion Desestructurante
// const persona = {
//     nombre: 'Erik',
//     edad: 25,
//     clave: 'efth',
// };

// // const {edad, clave, nombre} = persona;

// // console.log(nombre);
// // console.log(edad);
// // console.log(clave);

// const retornaPerona = ({clave, nombre, edad, rango = 'Capitan'}) => {


// //    console.log(nombre, edad, rango);

//     return {
//         nombreClave: clave,
//         anios: edad,
//         latitud: {
//             lat: 14.1232,
//             lng: -34.7655
//         }
//     }

// }

// const {nombreClave, anios, latlng: {lat, lng} } = retornaPerona(persona);

// console.log(nombreClave, anios);
// console.log(lat, lng);

const persona = {
    nombre: 'Erik',
    edad: 25,
    clave: 'efth',
};

const retornaPersona = ({ clave, nombre, edad, rango = 'Capitan' }) => {
    return {
        nombreClave: clave,
        anios: edad,
        latitud: {
            lat: 14.1232,
            lng: -34.7655
        }
    }
}

const { nombreClave, anios, latitud: { lat, lng } } = retornaPersona(persona);

console.log(nombreClave, anios);
console.log(lat, lng);
