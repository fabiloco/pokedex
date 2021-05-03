const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let allPokemonsInfo = [];



const getRandomNum = () => Math.round(Math.random() * 151 + 1);

// Petición realizada con promises
const getAllPokemons = () => {
    fetch(URL_ALL_POKEMONS)
        .then(res => res.json())
        .then(allPokemons => {
            allPokemonsInfo = allPokemons.results;
            console.log(allPokemonsInfo);
            console.log(getRandomNum());
        });
}

// Petición realizada con async-await y fetch
// const getAllPokemons = async () => {
//     const request = await fetch(URL_ALL_POKEMONS);
//     const allPokemons = await request.json();
// }

getAllPokemons();


