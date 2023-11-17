
// import {heroes} from './data/heroes'
import heroes, {owners} from '../data/heroes'

console.log(owners)

const getHeroeById = (id) => {
    heroes.find((heroe) => heroe.id === id);
}

console.log(getHeroeById);

const getHeroesByOwner = (owner) => heroes.filter((heroe) => heroe.owner === owner)

console.log(getHeroesByOwner('Marvel'))

