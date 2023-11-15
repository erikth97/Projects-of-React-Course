
// Funciones en Js
// const saludar = function(nombre) {
//     return `Hola, ${nombre}`
// }

const saludar2 = (nombre) => {
    return `Hola, ${nombre}`;
}

const saludar3 = (nombre) => `Hola, ${nombre}`;
const saludar4 = () => `Hola Mundo`;

// console.log(saludar('Erik'));

console.log(saludar2('Fabian'));
console.log(saludar3('Tamayo'));
console.log(saludar4());

const getUser = () => ({
        uid : 'ABC123',
        username : 'Erik'
});

const user = getUser();
console.log(user);

const getUsuarioActivo = (nombre) => ({
    uid : 'ABC123',
    username : 'nombre'
})

const usuarioActivo = getUsuarioActivo('Erik');
console.log(usuarioActivo);

