let POKEMON = [];
let THEME = 'light';
const IGNORE_POKEMON_ID = [];
getLocalStorage();
setPageMode();

function getLocalStorage() {
    THEME = localStorage.getItem('pac2-theme') || 'light';
    setTheme();
}

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

async function setDetailMode(id) {
    const pokemon = await getPokemon(id);
    if (pokemon === 'NOT-FOUND' || pokemon === 'NO-IMAGE') {
        document.getElementById("not-found").classList.toggle("hide");
        document.getElementById("loading").classList.toggle("hide");
    }
    else {
        renderPokemonDetail(pokemon);
    }

}

async function setListMode() {
    document.getElementById("list").classList.toggle("hide");
    document.getElementById("loading").classList.toggle("hide");
    POKEMON = await getAllPokemon();
    const pokemonList = await generateRandomPokemonList();
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

async function getPokemon(id) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    if (!response.ok) {
        return 'NOT-FOUND';
    }
    const data = await response.json();
    const officialArtwork = data.sprites.other['official-artwork'].front_default;
    if (officialArtwork) {
        const url = data.is_default ? data.species.url : data.forms.find(f => f.name === data.name).url;
        const id = data.id;
        const response2 = await fetch(url);
        const data2 = await response2.json();
        const name = data2.names.find(n => n.language.name === "en").name;
        const type1 = data.types.find(t => t.slot === 1).type.name;
        const type2 = data.types.find(t => t.slot === 2)?.type.name;
        const atk = data.stats.find(s => s.stat.name === "attack").base_stat;
        const def = data.stats.find(s => s.stat.name === "defense").base_stat;
        const spAtk = data.stats.find(s => s.stat.name === "special-attack").base_stat;
        const spDef = data.stats.find(s => s.stat.name === "special-defense").base_stat;
        const attack = atk > spAtk ? atk : spAtk;
        const defense = def > spDef ? def : spDef;
        const spriteFront = data.sprites.front_default;
        const spriteBack = data.sprites.back_default;
        const pokemon = {
            id,
            name,
            image: officialArtwork,
            type1,
            type2,
            attack,
            defense,
            spriteFront,
            spriteBack
        }
        return pokemon;
    }
    else {
        return 'NO-IMAGE';
    }

}

function renderPokemonList(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemonWrapper = document.getElementById('pokemon-' + (i + 1));
        const name = pokemonList[i].is_default ? pokemonList[i].name : pokemonList[i].name + " &#10024;";
        pokemonWrapper.getElementsByClassName('name')[0].innerHTML = name;
        const pokemonImage = pokemonWrapper.getElementsByClassName('sprite')[0];
        pokemonImage.src = pokemonList[i].image;
        pokemonImage.alt = pokemonList[i].name;
        pokemonWrapper.getElementsByClassName('attack')[0].innerHTML = pokemonList[i].attack;
        pokemonWrapper.getElementsByClassName('defense')[0].innerHTML = pokemonList[i].defense;
        pokemonWrapper.getElementsByClassName('background')[0].setAttribute("class", "background border" + " type1-" + pokemonList[i].type1 + " type2-" + (pokemonList[i].type2 ? pokemonList[i].type2 : pokemonList[i].type1));
        pokemonWrapper.getElementsByClassName('link')[0].setAttribute("href", "index.html?pokeID=" + pokemonList[i].id);
    }
    flipCards();
}

function renderPokemonDetail(pokemon) {
    const pokemonWrapper = document.getElementById('detail');
    pokemonWrapper.getElementsByClassName('pokemon-name')[0].innerHTML = pokemon.name;
    pokemonWrapper.getElementsByClassName('pokemon-number')[0].innerHTML = '#' + pokemon.id;
    pokemonWrapper.getElementsByClassName('image')[0].src = pokemon.image;
    pokemonWrapper.getElementsByClassName('image')[0].alt = pokemon.name;
    pokemonWrapper.getElementsByClassName('type-1')[0].innerHTML = pokemon.type1;
    pokemonWrapper.getElementsByClassName('type-1')[0].setAttribute("class", "type type-1 " + pokemon.type1);
    if (pokemon.type2) {
        pokemonWrapper.getElementsByClassName('type-2')[0].innerHTML = pokemon.type2;
        pokemonWrapper.getElementsByClassName('type-2')[0].setAttribute("class", "type type-2 " + pokemon.type2);
    }
    else {
        pokemonWrapper.getElementsByClassName('type-2')[0].classList.toggle("hide");

    }
    pokemonWrapper.getElementsByClassName('attack-number')[0].innerHTML = pokemon.attack;
    pokemonWrapper.getElementsByClassName('attack')[0].style.width = ((pokemon.attack / 255) * 100) + '%';
    pokemonWrapper.getElementsByClassName('defense-number')[0].innerHTML = pokemon.defense;
    pokemonWrapper.getElementsByClassName('defense')[0].style.width = ((pokemon.defense / 255) * 100) + '%';
    if (!pokemon.spriteFront && !pokemon.spriteBack) {
        pokemonWrapper.getElementsByClassName('pokemon-sprites')[0].classList.toggle("hide");
    }
    else {
        pokemonWrapper.getElementsByClassName('front-default-sprite')[0].src = pokemon.spriteFront;
        if (pokemon.spriteBack) {
            pokemonWrapper.getElementsByClassName('back-default-sprite')[0].src = pokemon.spriteBack;
        }
        else {
            pokemonWrapper.getElementsByClassName('back-default')[0].classList.toggle("hide");
        }

    }
    pokemonWrapper.classList.toggle("hide");
    document.getElementById("loading").classList.toggle("hide");
}

async function reload() {
    flipCards();
    const pokemonList = await generateRandomPokemonList();
    renderPokemonList(pokemonList);
}

function filterByName() {
    const value = document.getElementById("name-filter").value.toUpperCase();
    const cards = document.getElementsByClassName('card');
    if (value.length >= 3) {
        for (let i = 0; i < cards.length; i++) {
            const name = cards[i].getElementsByClassName('name')[0].innerHTML.toUpperCase();
            cards[i].style.display = name.includes(value) ? "block" : "none";
        }
    }
    else {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = "block";
        }
    }
}

function toggleAudio() {
    const audio = document.getElementById('audio');
    const audioButtons = document.getElementsByClassName('audio-button-img');
    if (audio.paused) {
        audio.play();
        for (let i = 0; i < audioButtons.length; i++) {
            audioButtons[i].src = '/assets/icons/volume.svg';
        }
    }
    else {
        audio.muted = !audio.muted;
        for (let i = 0; i < audioButtons.length; i++) {
            audioButtons[i].src = audio.muted ? '/assets/icons/mute.svg' : '/assets/icons/volume.svg';
        }
    }
}

function toggleTheme() {
    switch (THEME) {
        case 'light':
            THEME = 'dark';
            break;
        case 'dark':
            THEME = 'light';
            break;
    }
    localStorage.setItem('pac2-theme', THEME);
    setTheme();
}

function flipCards() {
    const cards = document.getElementsByClassName('card-inner');
    for (let i = 0; i < cards.length; i++) {
        setTimeout(() =>
            cards[i].classList.toggle("flipped"),
            100 * i
        );
    }
}

function setTheme() {
    const themeButtons = document.getElementsByClassName('theme-button-img');
    for (let i = 0; i < themeButtons.length; i++) {
        themeButtons[i].src = THEME == 'dark' ? '/assets/icons/moon.svg' : '/assets/icons/sun.svg';
    }
}