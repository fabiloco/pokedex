const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let allPokemonsInfo = [];
let correctAnswer = '';

let pokedex = [];

//DOM
const pokeImg = document.getElementById('poke-img');
const answersList = document.getElementById('poke-answers');
const loader = document.getElementById('loader');
const pokedexElements = document.getElementById('pokedex');
const caught = document.getElementById('caught');


const getRandomNum = (max=150) => Math.round(Math.random() * max + 1);

// Petición realizada con promises
const getAllPokemons = () => {
    loader.style.display = 'block';
    setTimeout(()=> {
        fetch(URL_ALL_POKEMONS)
        .then(res => res.json())
        .then(allPokemons => {
            allPokemonsInfo = [...allPokemons.results];
            getAnswers();
            fillPokedex();
        });
    }, 500);
    
}
// Petición realizada con async-await y fetch
// const getAllPokemons = async () => {
//     const request = await fetch(URL_ALL_POKEMONS);
//     const allPokemons = await request.json();
// }

const getAnswers = (answers = 4) => {
    
    pokeImg.classList.remove('game__image--show');
    pokeImg.classList.remove('game__image--error');

    pokeImg.style.display = 'block';
    answersList.style.display = 'block';
    loader.style.display = 'none';
    
    
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
    // This worked
    // fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}`)
    //     .then(res => res.json())
    //     .then(pokeInfo => {
    //         pokeImg.classList.add('game__image');
    //         pokeImg.src = pokeInfo.sprites.front_default;
    //         pokeImg.style.display = 'block';
    //         answersList.style.display = 'block';
    //         loader.style.display = 'none';
    //     });  
    
    const urlImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    pokeImg.classList.add('game__image');
    pokeImg.src = urlImg;
    pokeImg.style.display = 'block';
    answersList.style.display = 'block';
    loader.style.display = 'none';
        
}

const writeAnswers = (answers) => { 
    answersList.textContent = '';
    const fragment = document.createDocumentFragment();
    for(const answer of answers){
        const listItem = document.createElement('li');
        listItem.textContent = answer;
        fragment.append(listItem);
    }
    pokeImg.classList.remove('game__image--show');
    pokeImg.classList.add('game__image');
    answersList.append(fragment);
}

const getPokeStats = (id, obj) => {
    const urlPoke = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    
    let weight = undefined;
    const weightText =  document.createElement('p');
    //let weight = undefined;
    //const weightText =  document.createElement('p');

    fetch(urlPoke)
        .then(res => res.json())
        .then(stats => {
            weight = stats.weight;
            weightText.textContent = `Weight: ${weight}`;
            obj.appendChild(weightText);
        });
    
}

const getSpriteCard = (id, obj) => {
    const urlSpriteCard = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    const spriteCard = document.createElement('img');
    spriteCard.src = urlSpriteCard;
    obj.appendChild(spriteCard);
}

const fillBack = (pokemon, obj) => {
    if(pokemon.catched){
        const fragment = document.createDocumentFragment();

        const pokecardInfo = document.createElement('div');
        //Agregar estilos del pokecardInfo

        const pokeName = document.createElement('h2');
        pokeName.textContent = pokemon.name;
        
        getSpriteCard(pokemon.id, pokecardInfo);
        getPokeStats(pokemon.id, pokecardInfo);

        pokecardInfo.appendChild(pokeName);

        fragment.appendChild(pokecardInfo);

        obj.appendChild(fragment);

    }
}
    

const createPokedex = () =>{
    pokedexElements.textContent = '';
    console.log(pokedex);
    const fragment = document.createDocumentFragment();

    pokedex.forEach(pokemon => {
        const pokecard = document.createElement('div')
        pokecard.classList.add('pokedex__card');

        const pokecardFront = document.createElement('div');
        pokecardFront.classList.add('front');

        

        const pokeball = document.createElement('div');
        pokeball.classList.add('pokedex__pokeball');

        const pokecardBack = document.createElement('div');
        pokecardBack.classList.add('back');
        
        fillBack(pokemon, pokecardBack);


        if(pokemon.catched){
            pokecard.classList.add('pokedex__card--show');
            
            pokecard.addEventListener('click', (e) => {
                if(pokecard.classList.contains('rotate')){
                    pokecard.classList.remove('rotate');
                    pokecard.classList.add('normal');
                }else{
                    pokecard.classList.remove('normal');
                    pokecard.classList.add('rotate');
                }
            });

        }
        
        pokecard.appendChild(pokecardFront);
        pokecard.appendChild(pokecardBack);
        pokecardFront.appendChild(pokeball);
        pokecard.appendChild(pokecardBack);
        fragment.appendChild(pokecard);
    });
    pokedexElements.appendChild(fragment);
}

const fillPokedex = () => {
    console.log(allPokemonsInfo);
    if(localStorage.getItem('pokedex')){
        pokedex = JSON.parse(localStorage.getItem('pokedex'));
    }else{
        pokedex = allPokemonsInfo.map((pokemon, index) => {
            return{
                id:index + 1,
                name: pokemon.name,
                catched: false
            };
        });
        localStorage.setItem('pokedex', JSON.stringify(pokedex));
    }
    createPokedex();
}

const catchPokemon = () => {
    const caughtPokemon = pokedex.findIndex(pokemon => pokemon.name === correctAnswer);
    console.log(caughtPokemon);

    pokedex[caughtPokemon].catched = true;

    localStorage.setItem('pokedex', JSON.stringify(pokedex));

    console.log(pokedex[caughtPokemon]);
}

const caughtAnim = async () => {
    caught.classList.add('caught-anim');
    pokeImg.classList.add('game__image--show');
    await setTimeout(()=>{

        caught.classList.remove('caught-anim');

    }, 4000);
}

answersList.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
        if(e.target.textContent === correctAnswer){
            caughtAnim();
            catchPokemon();
            createPokedex();
            pokeImg.classList.add('game__image--show');
            setTimeout(getAnswers, 2500);
            console.log('Correcto');
        }else{
            pokeImg.classList.add('game__image--error');
            setTimeout(getAnswers, 2500);
            console.log('Fallaste');
        }
    }
})

getAllPokemons();



