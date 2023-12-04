import { useState } from "react";

export const GiftExpertApp = () => {

    const [ categories, setCategories ] = useState([ 'One Punch', 'Dragon Ball' ]);

    const onAddCategory = () => {
        //
        setCategories([ 'Valorant', ...categories ]);
        //
    }


    return (
        <>
        {/* {titulo} */}
        <h1>Gif App</h1>

        {/* {Input}

        {Listado de Gif} */}
        <button onClick={ onAddCategory }>Agregar</button>
        <ol>
            {
                categories.map( category => {
                    return <li key={ category }>{ category }</li>
                })
            }
        </ol>

        </>
    )
}
