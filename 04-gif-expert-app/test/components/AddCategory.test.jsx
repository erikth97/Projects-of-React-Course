import { fireEvent, render, screen } from "@testing-library/react"
import { AddCategory } from "../../src/components/AddCategory"


describe('Pruebas en <AddCategory />', () => { 

    test('debe de cambiar el valor de la caja de texto', () => {
        
        render( <AddCategory onNewCategory={ () => {} } /> );
        const input = screen.getByRole('textbox');

        fireEvent.input( input, { target: { value: 'Saitama' } });

        expect( input.value ).toBe('Saitama');

    });
    
    test('debe de llamar inNewCategory si el onput tiene un valor', () => {

        const inputValue = 'Saitama';
        //TODO:

        render( <AddCategory onNewCategory={ () => {} } />);

        const input = screen.getAllByRole('textbox');
        const form = screen.getAllByRole('form');

        fireEvent.input( input, { target: { value: 'Saitama' } });
    })

});