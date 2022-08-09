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

function setListMode() {
    console.log('Load Pokémon list');
    document.getElementById("list").classList.toggle("hide");
    document.getElementById("loading").classList.toggle("hide");
}

function main() {
    console.log('JavaScript working.')
}