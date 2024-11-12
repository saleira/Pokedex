let pokemonRepository = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }


    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    function addContent(pokemon) {
        const unorderedList = document.createElement('ul');
        unorderedList.classList.add('pokemon-info');
        
        const listItemHeight = document.createElement('li');
        listItemHeight.innerText = 'Height: ' + (pokemon.height/10) + ' m';
        
        const listItemType = document.createElement('li');
        listItemType.innerText = 'Type: ' + pokemon.types.map((type) => type.type.name).join(', ');

        unorderedList.appendChild(listItemHeight);
        unorderedList.appendChild(listItemType);
        return unorderedList;
    }

    function buildModal(pokemon) {
        loadDetails(pokemon).then(function () {
            const modalContainer = document.querySelector('#modal-container');

            modalContainer.innerHTML = '';

            const modal = document.createElement('div');
            modal.classList.add('modal');

            const closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal-close');
            const closeImg = document.createElement('img');
            closeImg.src = '/img/closeModal.svg';
            closeButtonElement.appendChild(closeImg);
            closeButtonElement.addEventListener('click', hideModal);
        
            const titleElement = document.createElement('h1');
            titleElement.innerText = capitalizeFirstLetter(pokemon.name);

            const contentElement = document.createElement('div');
            contentElement.classList.add('modal-content');
            const infoElement = document.createElement('p');
            infoElement.innerHTML = 'Height: ' + pokemon.height;
            const pokemonImage = document.createElement('img');
            pokemonImage.src = pokemon.imageUrl;
            contentElement.appendChild(pokemonImage);
            contentElement.appendChild(addContent(pokemon));
            
        
            modal.appendChild(closeButtonElement);
            modal.appendChild(titleElement);
            modal.appendChild(contentElement);
            modalContainer.appendChild(modal);
        
            modalContainer.classList.add('is-visible');
            showDetails(modalContainer);
        });
    }

    function showDetails(modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target === modalContainer) {
                hideModal();
            }
        });
    }

    function hideModal() {
        const modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    // Function to create list items with Pokémon details including a button that displays the pokemon info to the console
    function addListItem(pokemon) {
        const pokemonElementList = document.querySelector('.pokemon-list'); // Selects the ul with the class 'pokemon-list'
        const listItem = document.createElement('li'); // Creates a list item
        const button = document.createElement('button'); // Creates a button

        button.innerText = capitalizeFirstLetter(pokemon.name); // Sets the button text to the Pokémon's name
        button.classList.add('button-class'); // Adds a class to the button
        buttonEventListener(button, pokemon); // Calls the buttonEventListener function with the button and pokemon as arguments

        listItem.appendChild(button); // Appends the button to the list item
        pokemonElementList.appendChild(listItem); // Appends the list item to the ul
    }

    // Function to add event listener to button
    function buttonEventListener(button, pokemon) {
        button.addEventListener('click', function () {
            buildModal(pokemon);
        });
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

    window.addEventListener('keydown', (e) => {
        const modalContainer = document.querySelector('#modal-container');
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
        }
    });

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