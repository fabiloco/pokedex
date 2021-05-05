const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let allPokemonsInfo = [];
let correctAnswer = '';

//DOM
const pokeImg = document.getElementById('poke-img');
const answersList = document.getElementById('poke-answers');
const loader = document.getElementById('loader');



const getRandomNum = (max=150) => Math.round(Math.random() * max + 1);

// Petición realizada con promises
const getAllPokemons = () => {
    loader.style.display = 'block';
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
        console.log(options);
        if(options.find(({ name }) => currentPokemon.name !== name)) {
            options.push(currentPokemon);
        }     
    }
    let allAnswers = options.map(answer => answer.name)
    // for(const answer of options){
    //     allAnswers.push(answer.name);
    // }

    getSprite(options[0].url.substring(34).replace('/',''));

    correctAnswer = options[0].name;
    console.log(correctAnswer);

    allAnswers = allAnswers.sort(() => Math.random() - 0.5);

    writeAnswers(allAnswers);
}

const getSprite = (id) => { 
    fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}`)
        .then(res => res.json())
        .then(pokeInfo => {
            pokeImg.classList.add('game__image');
            pokeImg.src = pokeInfo.sprites.front_default;
        });    
}

const writeAnswers = (answers) => { 
    answersList.textContent = '';
    const fragment = document.createDocumentFragment();
    for(const answer of answers){
        const listItem = document.createElement('li');
        listItem.textContent = answer;
        fragment.append(listItem);
    }
    loader.style.display = 'none';
    pokeImg.classList.remove('game__image--show');
    pokeImg.classList.add('game__image');
    answersList.append(fragment);
}

answersList.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
        if(e.target.textContent === correctAnswer){
            pokeImg.classList.add('game__image--show');
            setTimeout(() => getAnswers(), 2500);
            console.log('Correcto');
        }else{
            console.log('Fallaste');
        }
    }
})

getAllPokemons();


