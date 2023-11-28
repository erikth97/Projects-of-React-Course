
describe('Pruebas eb <DemoComponent />', () => { 
    
    test ('Esta prueba no debe de fallar', () => {

        // Inicializacion
        const message1 = 'Hola Mundi';

        // Estimulo
        const message2 = message1.trim();

        // Observar el comportamineto
        expect( message1 ).toBe( message2 );

    })

})

