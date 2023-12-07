import { useState } from "react";
import { AddCategory } from "./components/AddCategory";
import { GifGrid } from "./components/GifGrid";

export const GiftExpertApp = () => {

    const [ categories, setCategories ] = useState([ 'One Punch' ]);

    const onAddCategory = ( newCategory ) => {

        if ( categories.includes(newCategory) ) return;

        // categories.push(newCategory);
        setCategories([ newCategory, ...categories ]);
        // setCategories([ 'Valorant', ...categories ]);
    }


    return (
        <>

        <h1>Gif App</h1>

        
        <AddCategory 
            onNewCategoty={ (value) => onAddCategory(value) }
        />
        
        

        {
            categories.map( ( category ) => (
                <GifGrid 
                key={ category }
                category={ category }/>
            ))
        }




        </>
    )
}