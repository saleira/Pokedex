let pokemonRepository = (function () {
    const pokemonList = [];
    let offset = 0;
    const limit = 20;
    let apiUrlBase = 'https://pokeapi.co/api/v2/pokemon';
    let loading = false;
    const typeColors = {
        Bug: '#a8b820',
        Dragon: '#7038f8',
        Grass: '#9bcc50',
        Steel: '#b8b8d0',
        Dark: '#707070',
        Flying: '#a890f0',
        Normal: '#a4acaf',
        Ghost: '#705898',
        Rock: '#b8a038',
        Ground: '#e0c068',
        Fighting: '#c02038',
        Fire: '#f08030',
        Electric: '#f8d030',
        Poison: '#a040a0',
        Psychic: '#f366b9',
        Fairy: '#fdb9e9', 
        Water: '#6890f0',
        Ice: '#98d8d8'
    };

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function appendId(id) {
        return '#' + id.toString().padStart(3, '0');
    }

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    function addPokemonToCard(pokemon) {
        let selectSection = document.querySelector('.pokemon-list');
        let card = document.createElement('div');
        card.classList.add('pokemon-card');
        selectSection.appendChild(card);

        let cardHeader = document.createElement('section');
        cardHeader.classList.add('pokemon-card-header');
        card.appendChild(cardHeader);
        let pokemonName = document.createElement('p');
        pokemonName.innerText = capitalizeFirstLetter(pokemon.name);
        let pokemonID = document.createElement('p');
        pokemonID.innerText = appendId(pokemon.id);
        cardHeader.appendChild(pokemonName);
        cardHeader.appendChild(pokemonID);

        let cardBody = document.createElement('section');
        cardBody.classList.add('pokemon-card-body');
        card.appendChild(cardBody);
        let pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.imageUrl;
        cardBody.appendChild(pokemonImage);

        let cardFooter = document.createElement('section');
        cardFooter.classList.add('pokemon-card-footer');
        card.appendChild(cardFooter);
        pokemon.types.forEach(type => {
            let pokemonType = document.createElement('p');
            pokemonType.classList.add('pokemon-type-badge');
            let typeName = capitalizeFirstLetter(type.type.name);
            pokemonType.innerText = typeName;
            pokemonType.style.backgroundColor = typeColors[typeName];
            cardFooter.appendChild(pokemonType);
        });
    }

    function loadList() {
        if (loading) return; // Exit if already loading
        loading = true;      // Set the flag to indicate loading in progress

        let apiUrl = `${apiUrlBase}?offset=${offset}&limit=${limit}`;
        return fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                let loadPromises = json.results.map(item => {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    return pokemonRepository.loadDetails(pokemon).then(() => pokemon);
                });

                // Wait for all details to load
                return Promise.all(loadPromises);
            })
            .then(pokemonBatch => {
                // Sort the batch by ID
                pokemonBatch.sort((a, b) => a.id - b.id);

                // Add each Pokémon in the sorted order
                pokemonBatch.forEach(pokemon => {
                    pokemonRepository.addPokemonToCard(pokemon);
                });

                // Update the offset for the next batch
                offset += limit;
                loading = false
            })
            .catch(error => {
                console.error("Error loading Pokémon:", error);
                loading = false;
            });
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.id = details.id;
            item.height = details.height;
            item.types = details.types;
            if (details.sprites.other.dream_world.front_default) {
                item.imageUrl = details.sprites.other.dream_world.front_default;
            } else if (details.sprites.other['official-artwork'].front_default) {
                item.imageUrl = details.sprites.other['official-artwork'].front_default;
            } else if (details.sprites.front_default) {
                item.imageUrl = details.sprites.front_default;
            } else {
                item.imageUrl = 'img/NoPokemon.svg';
            }
        }).catch(function (e) {
            console.error(e);
        });
    }

    return {
        add: add,
        getAll: getAll,
        addPokemonToCard: addPokemonToCard,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

// Initial load
pokemonRepository.loadList();

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        // User is near the bottom of the page, load more Pokémon
        pokemonRepository.loadList();
    }
});