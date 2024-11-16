let pokemonRepository = (function () {
    let pokemonList = [];
    let offset = 0;
    const limit = 20;
    let apiAllPokemons = 'https://pokeapi.co/api/v2/pokemon';
    let apiGeneration = 'https://pokeapi.co/api/v2/generation';
    let apiType = 'https://pokeapi.co/api/v2/type';
    let loading = false;
    let currentGeneration = null;
    let currentType = null;
    const typeColors = {
        bug: '#a8b820',
        dragon: '#7038f8',
        grass: '#9bcc50',
        steel: '#b8b8d0',
        dark: '#707070',
        flying: '#a890f0',
        normal: '#a4acaf',
        ghost: '#705898',
        rock: '#b8a038',
        ground: '#e0c068',
        fighting: '#c02038',
        fire: '#f08030',
        electric: '#f8d030',
        poison: '#a040a0',
        psychic: '#f366b9',
        fairy: '#fdb9e9', 
        water: '#6890f0',
        ice: '#98d8d8'
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

    // Create a card for each Pokémon
    function createCard(pokemon) {
        const card = document.querySelector('#pokemon-main-card');
        const gridElement = document.createElement('div');
        gridElement.classList.add('card', 'cardListElem', 'rounded-3', 'g-col-12', 'g-col-sm-6' ,'g-col-md-4', 'g-col-xl-3', 'p-2', 'm-1', 'm-sm-2', 'flex-fill');
        card.appendChild(gridElement);

        const pokemonImg = document.createElement('img');
        pokemonImg.src = pokemon.imageUrl;
        pokemonImg.classList.add('img-fluid', 'pokemon-card-body');
        gridElement.appendChild(pokemonImg);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        gridElement.appendChild(cardBody);

        const cardTitle = document.createElement('h5');
        cardTitle.innerText = pokemon.name;
        cardTitle.classList.add('mb-0', 'text-capitalize');

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
            pokemonType.classList.add('g-col-6', 'text-center', 'p-2', 'rounded-3', 'm-0', 'text-capitalize');
            const typeName = type.type.name;
            pokemonType.innerText = typeName;
            pokemonType.style.backgroundColor = typeColors[typeName];
            typesContainer.appendChild(pokemonType);
        });
    }
    // Render the list of Pokémon to the page
    function renderPokemonList() {
        const cardContainer = document.querySelector('#pokemon-main-card');
        cardContainer.innerHTML = '';
        getAll().forEach(pokemon => createCard(pokemon));
    }

    // Load the list of Pokémon from the API and show a spinner while loading
    function loadList() {
        if (loading) return;
        loading = true;

        showLoading();

        let apiUrl;
        if (currentGeneration) {
            apiUrl = `${apiGeneration}/${currentGeneration}`;
            const cardContainer = document.querySelector('#pokemon-main-card');
            cardContainer.innerHTML = '';
        } else if (currentType) {
            apiUrl = currentType;
            const cardContainer = document.querySelector('#pokemon-main-card');
            cardContainer.innerHTML = '';
        } else {
            apiUrl = `${apiAllPokemons}?offset=${offset}&limit=${limit}`;
            enableScrollLoading();
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(async (data) => {
                if (currentGeneration) {
                    const speciesList = data.pokemon_species

                    const loadPromises = speciesList.map(async (species) => {
                        const pokemon = {name: species.name, detailsUrl: species.url.replace('-species', '')};
                        await loadPokemonDetails(pokemon);
                        add(pokemon);
                    });
                    await Promise.all(loadPromises);
                } else if (currentType) {
                    const pokemonList = data.pokemon;
                    console.log(pokemonList);

                    const loadPromises = pokemonList.map(async (item) => {
                        const pokemon = {name: item.pokemon.name, detailsUrl: item.pokemon.url};
                        await loadPokemonDetails(pokemon);
                        add(pokemon);
                    });
                    await Promise.all(loadPromises);
                } else {
                    const loadPromises = data.results.map(async (item) => {
                        const pokemon = {name: item.name, detailsUrl: item.url};
                        await loadPokemonDetails(pokemon);
                        add(pokemon);
                    });
                    await Promise.all(loadPromises);
                    offset += limit;
                }

                pokemonList.sort((a, b) => a.id - b.id);
                renderPokemonList();
            })
            .catch(error => {
                console.error('Error loading Pokémon:', error);
            })
            .finally(() => {
                hideLoading();
                loading = false;
            });
    }

    // Load the details for a single Pokémon
    async function loadPokemonDetails(item) {
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

    // Fetch the list of generations or types
    async function loadDropdowns(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const details = await response.json();
            return details.results;
        } catch (e) {
            console.error(e);
        }
    }

    // Create a dropdown list
    function createDropdown(list, dropdownSelector){
        const dropdown = document.querySelector(dropdownSelector);
        dropdown.innerHTML = '';
        list.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.classList.add('dropdown-item', 'text-capitalize');
            link.href = '#';
            link.innerText = item.name;
            listItem.appendChild(link);
            dropdown.appendChild(listItem);
        })
    }

    function loadGenerationPokemons(generationId) {
        disableScrollLoading();
        currentGeneration = generationId;
        currentType = null;
        pokemonList = [];
        loadList();
    }

    function loadTypePokemons(typeUrl) {
        disableScrollLoading();
        currentType = typeUrl;
        currentGeneration = null;
        pokemonList = [];
        loadList();
    }

    // Load the generation information for the dropdown
    async function loadGenerationDropdown() {
        const generationList = await loadDropdowns(apiGeneration);
        createDropdown(generationList, '#generationDropdown');

        const dropdownItems = document.querySelectorAll('#generationDropdown .dropdown-item');
        dropdownItems.forEach((item, index) => {
            item.addEventListener('click', () => loadGenerationPokemons(index + 1));
        });
    }

    // Load the type information for the dropdown
    async function loadTypeDropdown() {
        let typeList = await loadDropdowns(apiType);
        typeList = typeList.filter(type => type.name !== 'unknown');
        typeList.sort((a, b) => a.name.localeCompare(b.name));
        createDropdown(typeList, '#typeDropdown');

        const dropdownItems = document.querySelectorAll('#typeDropdown .dropdown-item');
        dropdownItems.forEach((item) => {
            item.addEventListener('click', () => {
                loadTypePokemons(apiType + '/' + item.innerText.toLowerCase());
            });
        });
    }

    function showLoading() {
        const spinnerContainer = document.createElement('div');
        spinnerContainer.id = 'loading-spinner'; // Assign an ID for easy removal
        spinnerContainer.classList.add('d-flex', 'justify-content-center', 'm-5');

        const spinnerElement = document.createElement('div');
        spinnerElement.classList.add('spinner-border', 'text-primary');
        spinnerElement.setAttribute('role', 'status');
        spinnerContainer.appendChild(spinnerElement);

        const mainContainer = document.querySelector('#pokemon-main-card');
        mainContainer.insertAdjacentElement('afterend', spinnerContainer);
    }

    function hideLoading() {
        const spinnerContainer = document.querySelector('#loading-spinner');
        if (spinnerContainer) {
            spinnerContainer.remove();
        }
    }

    function enableScrollLoading() {
        window.addEventListener('scroll', handleScroll);
    }

    function disableScrollLoading() {
        window.removeEventListener('scroll', handleScroll);
    }

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            pokemonRepository.loadList();
        }
    }

    function resetFilter() {
        currentGeneration = null;
        currentType = null;
        offset = 0;
        pokemonList = [];
        loadList();
        enableScrollLoading();
    }

    return {
        loadList: loadList,
        loadPokemonDetails: loadPokemonDetails,
        createCard: createCard,
        loadGenerationDropdown: loadGenerationDropdown,
        loadTypeDropdown: loadTypeDropdown,
        resetFilter: resetFilter
    };
})();


pokemonRepository.loadList();
pokemonRepository.loadGenerationDropdown();
pokemonRepository.loadTypeDropdown();


const allPokemonButtons = document.querySelectorAll('#allPokemons, #pokemonLogo');
allPokemonButtons.forEach(button => {
    button.addEventListener('click', pokemonRepository.resetFilter);
});
