import { useEffect } from "react"

export const Message = () => {

    useEffect(() => {

        const onMouseMove = ({x,y}) => {
            const coords = {x,y};
            console.log(coords)
        }
        
        window.addEventListener('mousemove')

        return () => {
            
        }
    }, []);


    
    return(
    <>
        <h3>Error: Usuario exsistente</h3>    

    </>
    )
}
