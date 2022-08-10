let POKEMON = [];
const IGNORE_POKEMON_ID = [];
main();
setPageMode();

function setPageMode() {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    if (path === '/index.html' && urlParams.has("pokeID")) {
        setDetailMode(urlParams.get("pokeID"));
    }
    else if (path === '/index.html') {
        setListMode();
    }
}

function setDetailMode(id) {
    console.log('Load pokeID', id);
    document.getElementById("detail").classList.toggle("hide");
    document.getElementById("loading").classList.toggle("hide");
}

async function setListMode() {
    console.log('Load Pokémon list');
    document.getElementById("list").classList.toggle("hide");
    document.getElementById("loading").classList.toggle("hide");
    POKEMON = await getAllPokemon();
    const pokemonList = await generateRandomPokemonList();
    console.log('pokemon', pokemonList);
    renderPokemonList(pokemonList);
}

function toggleResponsiveMenu() {
    document.getElementById("responsive-menu").classList.toggle("hide");
}

async function getAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    const data = await response.json();
    return data.results;
}

async function generateRandomPokemonList() {
    console.log('Loading random Pokémon ...')
    let pokemonList = [];
    const selectedIDs = [];
    while (pokemonList.length < 10) {
        let randomID = Math.floor(Math.random() * POKEMON.length);
        while (selectedIDs.includes(randomID) || IGNORE_POKEMON_ID.includes(randomID)) {
            randomID = Math.floor(Math.random() * POKEMON.length);
        }
        const response = await fetch(POKEMON[randomID].url);
        const data = await response.json();
        const officialArtwork = data.sprites.other['official-artwork'].front_default;
        if (officialArtwork) {
            const id = data.id;
            const response2 = await fetch(data.species.url);
            const data2 = await response2.json();
            const name = data2.names.find(n => n.language.name === "en").name;
            const is_default = data.is_default;
            const type1 = data.types.find(t => t.slot === 1).type.name;
            const type2 = data.types.find(t => t.slot === 2)?.type.name;
            const atk = data.stats.find(s => s.stat.name === "attack").base_stat;
            const def = data.stats.find(s => s.stat.name === "defense").base_stat;
            const spAtk = data.stats.find(s => s.stat.name === "special-attack").base_stat;
            const spDef = data.stats.find(s => s.stat.name === "special-defense").base_stat;
            const attack = atk > spAtk ? atk : spAtk;
            const defense = def > spDef ? def : spDef;
            const pokemon = {
                id,
                name,
                image: officialArtwork,
                is_default,
                type1,
                type2,
                attack,
                defense
            }
            pokemonList.push(pokemon);
            selectedIDs.push(randomID);
        }
        else {
            IGNORE_POKEMON_ID.push(randomID);
        }
    }
    return pokemonList;
}

function renderPokemonList(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemonWrapper = document.getElementById('pokemon-' + (i + 1));
        const name = pokemonList[i].is_default ? pokemonList[i].name.toUpperCase() : pokemonList[i].name.toUpperCase() + " &#10024;";
        pokemonWrapper.getElementsByClassName('name')[0].innerHTML = name;
        pokemonWrapper.getElementsByClassName('sprite')[0].src = pokemonList[i].image;
        pokemonWrapper.getElementsByClassName('attack')[0].innerHTML = pokemonList[i].attack;
        pokemonWrapper.getElementsByClassName('defense')[0].innerHTML = pokemonList[i].defense;
        pokemonWrapper.getElementsByClassName('background')[0].setAttribute("class", "background" + " type1-" + pokemonList[i].type1 + " type2-" + (pokemonList[i].type2 ? pokemonList[i].type2 : pokemonList[i].type1));
        pokemonWrapper.getElementsByClassName('link')[0].setAttribute("href", "index.html?pokeID=" + pokemonList[i].id);
    }
}

async function reload() {
    const pokemonList = await generateRandomPokemonList();
    console.log('pokemon', pokemonList);
    renderPokemonList(pokemonList);
}

function main() {
    console.log('JavaScript working.')
}