import { useState } from "react";
import { AddCategory } from "./components/AddCategory";

export const GiftExpertApp = () => {

    const [ categories, setCategories ] = useState([ 'One Punch', 'Dragon Ball' ]);

    const onAddCategory = ( newCategory ) => {

        if ( categories.includes(newCategory) ) return;
        
        // categories.push(newCategory);
        setCategories([ newCategory, ...categories ]);
        // setCategories([ 'Valorant', ...categories ]);
    }


    return (
        <>
        {/* titulo */}
        <h1>Gif App</h1>

        {/* Input */}
        <AddCategory 
            // setCategories={ setCategories } 
            onNewCategoty={ (value) => onAddCategory(value) }
        />

        {/* Listado de Gif */}
        <button onClick={ onAddCategory }>Agregar</button>
        <ol>
            {
                categories.map( ( category ) => {
                    return <li key={ category }>{ category }</li>
                })
            }
        {/* <li>ABC</li> */}
        </ol>
        {/* Gif Item */}


        </>
    )
}