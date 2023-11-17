
const getImagen = async() => {

    try {
        const apiKey = 'uPLP8JWuPdlVsXA44u0n4a0FmHXdlryQ';
        const resp = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`);
        const {data} = await resp.json();
    
        const {url} = data.images.original;

        const img = document.createElement('img');
        img.src = url;
        document.body.append(img);

    } catch (error) {
        //manejo de errores
        console.log(error)
    }
}

getImagen();