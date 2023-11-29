import { getHeroeById, getHeroesByOwner } from "../../src/base-pruebas/08-imp-exp";
import heroes from "../../src/data/heroes";

describe('Pruebas en 08-imp-exp', () => { 
    
    
    test('getHeroeByID debe de retornar un heroe por ID', () => {

        const id = 1;
        const hero = getHeroeById( id );

        expect( hero ).toEqual({ id: 1, name: 'Batman', owner: 'DC' })
    });

    test('getHeroeByID debe retornar undefined si no exsiste', () => {

        const id = 100;
        const hero = getHeroeById( id );
        expect( hero ).toBeFalsy();

    });


    //tarea
    describe('getHeroesByOwner debe regresar heroes DC', () => {
        
        const owner = 'DC';
        const heroes = getHeroesByOwner(owner);
    
        expect( heroes.length ).toBe( 3 );
        expect( heroes ).toEqual([
            { id: 1, name: 'Batman', owner: 'DC' },
            { id: 3, name: 'Superman', owner: 'DC' },
            { id: 4, name: 'Flash', owner: 'DC' }
        ])
        expect( heroes ).toEqual( heroes.filter( (heroe) => heroe.owner === owner) )


    })

    test('getHeroesByOwner debe de regresar heroes de Marvel', () => {
        
        const owner = 'Marvel';
        const heroes = getHeroesByOwner( owner );

        expect( heroes.length ).toBe( 2 );
        expect( heroes ).toEqual( heroes.filter( (heroe) => heroe.owner === owner ) )
        

    });

})