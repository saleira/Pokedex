let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    // Function to show Pokémon details to the console
    function showDetails(pokemon) {
        console.log(pokemon);
    }

    // Function to create list items with Pokémon details including a button that displays the pokemon info to the console
    function addListItem(pokemon) {
        let pokemonElementList = document.querySelector('.pokemon-list'); // Selects the ul with the class 'pokemon-list'
        let listItem = document.createElement('li'); // Creates a list item
        let button = document.createElement('button'); // Creates a button

        button.innerText = pokemon.name; // Sets the button text to the Pokémon's name
        button.classList.add('button-class'); // Adds a class to the button
        buttonEventListener(button, pokemon); // Calls the buttonEventListener function with the button and pokemon as arguments

        listItem.appendChild(button); // Appends the button to the list item
        pokemonElementList.appendChild(listItem); // Appends the list item to the ul
    }

    // Function to add event listener to button
    function buttonEventListener(button, pokemon) {
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    

    function loadList() {
        return fetch(apiUrl).then(function (response) {
        return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
            let pokemon = {
            name: item.name,
            detailsUrl: item.url
            };
            add(pokemon);
        });
        }).catch(function (e) {
            console.error(e);
        })
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,  
        loadList: loadList
    };
})();



pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});