import { useEffect, useState } from "react"

export const Message = () => {

    const [coords, setCords] = useState({ x: 0, y: 0});

    useEffect(() => {

        const onMouseMove = ({ x, y }) => {
            // const coords = { x, y };
            setCords({ x, y})
        }
        
        window.addEventListener( 'mousemove', onMouseMove);

        return () => {
            window.removeEventListener( 'mousemove', onMouseMove );
        }
    }, []);


    
    return(
    <>
        <h3>Error: Usuario exsistente</h3>    
        { JSON.stringify( coords )}
    </>
    )
}
