import { useState } from "react";
import { AddCategory } from "./components/AddCategory";

export const GiftExpertApp = () => {

    const [ categories, setCategories ] = useState([ 'One Punch', 'Dragon Ball' ]);

    const onAddCategory = () => {
        //
        setCategories([ 'Valorant', ...categories ]);
        //
    }


    return (
        <>
        {/* titulo */}
        <h1>Gif App</h1>

        {/* Input */}
        <AddCategory />

        {/* Listado de Gif */}
        <button onClick={ onAddCategory }>Agregar</button>
        <ol>
            {
                categories.map( category => {
                    return <li key={ category }>{ category }</li>
                })
            }
        </ol>

        {/* Gif Item */}


        </>
    )
}