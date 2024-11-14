let pokemonRepository = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
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
    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
    function buildModal(pokemon) {
        loadDetails(pokemon).then(function () {
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = '';

            const pokemonName = document.querySelector('#pokemonModalLabel');
            pokemonName.innerText = capitalizeFirstLetter(pokemon.name);

            const pokemonImg = document.createElement('img');
            pokemonImg.src = pokemon.imageUrl;
            pokemonImg.classList.add('img-fluid');
            modalBody.appendChild(pokemonImg);

            const typesContainer = document.createElement('div');
            typesContainer.classList.add('grid', 'gap-2', 'mt-3');
            modalBody.appendChild(typesContainer);
            pokemon.types.forEach(type => {
                const pokemonType = document.createElement('p');
                pokemonType.classList.add('g-col-6', 'text-center', 'p-2', 'rounded-3', 'm-0', 'pokemon-card-footer');
                const typeName = capitalizeFirstLetter(type.type.name);
                pokemonType.innerText = typeName;
                pokemonType.style.backgroundColor = typeColors[typeName];
                typesContainer.appendChild(pokemonType);
            });
            $('#modal-container').modal('show');
        });
    }

    function addListItem(pokemon) {
        const pokemonElementList = document.querySelector('.pokemon-list');
		const listItem = document.createElement('li');
		listItem.classList.add('list-group-item', 'border-0', 'col-4', 'p-1');

        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modal-container');

        button.classList.add('btn', 'btn-primary', 'btn-block', 'g-col-12', 'g-col-sm-6' ,'g-col-md-4', 'g-col-xl-3', 'w-100');
        button.innerText = capitalizeFirstLetter(pokemon.name);
        button.addEventListener('click', function () {
            buildModal(pokemon);
        });
        listItem.appendChild(button);
        pokemonElementList.appendChild(listItem); 
    }

    async function loadList() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const json = await response.json();
            json.results.forEach(item => {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        } catch (e) {
            console.error('There has been a problem with your fetch operation: ', e);
        }
    }

    async function loadDetails(item) {
        const url = item.detailsUrl;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const details = await response.json();
            item.id = details.id;
            item.height = details.height;
            item.types = details.types;
            item.imageUrl = details.sprites.other.dream_world.front_default;
        } catch (e) {
            console.error('There has been a problem with your fetch operation: ', e);
        }
    }


    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,  
        loadList: loadList
    };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});