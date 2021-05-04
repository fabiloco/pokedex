const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let allPokemonsInfo = [];



const getRandomNum = (max=151) => Math.round(Math.random() * max + 1);

// Petición realizada con promises
const getAllPokemons = () => {
    fetch(URL_ALL_POKEMONS)
        .then(res => res.json())
        .then(allPokemons => {
            allPokemonsInfo = [...allPokemons.results];
            getAnswers();
        });
}
// Petición realizada con async-await y fetch
// const getAllPokemons = async () => {
//     const request = await fetch(URL_ALL_POKEMONS);
//     const allPokemons = await request.json();
// }

const getAnswers = (answers = 3) => {
    const options = [];
    let randomNum = getRandomNum();
    let currentPokemon = allPokemonsInfo[randomNum];
    options.push(currentPokemon);
    while(options.length < answers) {
        randomNum = getRandomNum();
        currentPokemon = allPokemonsInfo[randomNum];
        if(options.find(({ name }) => currentPokemon.name !== name)) {
            options.push(currentPokemon);
        }     
    }
    getSprite(options[0].url.substring(34).replace('/',''));
}

const getSprite = (id) => { 
    fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}`)
        .then(res => res.json())
        .then(pokeInfo => {
            console.log(pokeInfo);
        });    
}

getAllPokemons();


