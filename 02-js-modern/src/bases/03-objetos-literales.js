

const persona = {
    nombre: 'Erik',
    apellido: 'Tamayo',
    edad: 25,
    direccion: {
        ciudad: 'Monterrey',
        zip: 345324,
        lat: 23.546,
        lng: 94.435,
    }
};

// console.log.table(persona);

// Manera CORRECTA de clonar un objeto sin afectar el espacio en memoria del original, si no se crea otro totalmente nuevo.
const persona2 = {...persona};
persona2.nombre = 'Fabian';

console.log(persona)
console.log(persona2);