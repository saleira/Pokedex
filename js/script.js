let pokemonRepository = (function () {
    let pokemonList = [
        {id: 1, name: 'Bulbasaur', height: 0.7, type: ['Grass', 'Poison']},
        {id: 2, name: 'Ivysaur', height: 1, type: ['Grass', 'Poison']},
        {id: 3, name: 'Venusaur', height: 2, type: ['Grass', 'Poison']},
        {id: 4, name: 'Charmander', height: 0.6, type: ['Fire']},
        {id: 5, name: 'Charmeleon', height: 1.1, type: ['Fire']},
        {id: 6, name: 'Charizard', height: 1.7, type: ['Fire', 'Flying']},
        {id: 7, name: 'Squirtle', height: 0.5, type: ['Water']},
        {id: 8, name: 'Wartortle', height: 1, type: ['Water']},
        {id: 9, name: 'Blastoise', height: 1.6, type: ['Water']}
    ];

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

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem
    };
})();

let pokemonList = pokemonRepository.getAll();

pokemonList.forEach(pokemon =>{
    pokemonRepository.addListItem(pokemon);
});