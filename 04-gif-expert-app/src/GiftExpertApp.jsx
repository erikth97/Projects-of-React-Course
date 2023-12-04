import { useState } from "react";

export const GiftExpertApp = () => {

    const [ categories, setCategories ] = useState([ 'One Punch', 'Dragon Ball' ]);

    console.log(categories);

    return (
        <>
        {/* {titulo} */}
        <h1>Gif App</h1>

        {/* {Input}

        {Listado de Gif} */}
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
