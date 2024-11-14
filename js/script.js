let pokemonRepository = (function () {
    let pokemonList = [];
    let pokemonListBackup = [];
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

    function createCard(pokemon) {
        const card = document.querySelector('#pokemon-main-card');
        const gridElement = document.createElement('div');
        gridElement.classList.add('card', 'rounded-3', 'g-col-12', 'g-col-sm-6' ,'g-col-md-4', 'g-col-xl-3', 'p-2', 'm-1', 'm-sm-2', 'flex-fill');
        card.appendChild(gridElement);

        const pokemonImg = document.createElement('img');
        pokemonImg.src = pokemon.imageUrl;
        pokemonImg.classList.add('img-fluid', 'pokemon-card-body');
        gridElement.appendChild(pokemonImg);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        gridElement.appendChild(cardBody);

        const cardTitle = document.createElement('h5');
        cardTitle.innerText = capitalizeFirstLetter(pokemon.name);
        cardTitle.classList.add('mb-0');

        cardBody.appendChild(cardTitle);
        const cardSubtitle = document.createElement('h6');
        cardSubtitle.classList.add('mb-3', 'text-muted');
        cardSubtitle.innerText = appendId(pokemon.id);
        cardBody.appendChild(cardSubtitle);

        const typesContainer = document.createElement('div');
        typesContainer.classList.add('grid', 'gap-2' );
        cardBody.appendChild(typesContainer);
        pokemon.types.forEach(type => {
            const pokemonType = document.createElement('p');
            pokemonType.classList.add('g-col-6', 'text-center', 'p-2', 'rounded-3', 'm-0', 'pokemon-card-footer');
            const typeName = capitalizeFirstLetter(type.type.name);
            pokemonType.innerText = typeName;
            pokemonType.style.backgroundColor = typeColors[typeName];
            typesContainer.appendChild(pokemonType);
        });
    }

    function loadList() {
        if (loading) return; // Exit if already loading
        loading = true;      // Set the flag to indicate loading in progress

        const spinnerContainer = document.createElement('div');
        spinnerContainer.classList.add('d-flex', 'justify-content-center', 'm-5'); 

        // Spinner element
        const spinnerElement = document.createElement('div');
        spinnerElement.classList.add('spinner-border', 'text-primary');
        spinnerElement.setAttribute('role', 'status');

        // Insert the spinnerContainer after #pokemon-main-card
        spinnerContainer.appendChild(spinnerElement);

        // Append the spinner container to the #pokemon-main-card div
        const mainContainer = document.querySelector('#pokemon-main-card');
        mainContainer.insertAdjacentElement('afterend', spinnerContainer);

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
                    pokemonRepository.createCard(pokemon);
                });

                // Update the offset for the next batch
                offset += limit;
            })
            .catch(error => {
                console.error("Error loading Pokémon:", error);
            })
            .finally(() => {
                // Remove the spinner and reset the loading flag
                spinnerContainer.remove();
                loading = false;
            });
    }


    async function loadDetails(item) {
        let url = item.detailsUrl;
        try {
            const response = await fetch(url);
            const details = await response.json();
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
        } catch (e) {
            console.error(e);
        }
    }

    return {
        add: add,
        getAll: getAll,
        loadList: loadList,
        loadDetails: loadDetails,
        createCard: createCard
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