let pokemonRepository = (function () {
    const pokemonList = [
        {id: 1, name: 'Bulbasaur', height: 0.7, type: ['Grass', 'Poison'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg'},
        {id: 2, name: 'Ivysaur', height: 1, type: ['Grass', 'Poison'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg'},
        {id: 3, name: 'Venusaur', height: 2, type: ['Grass', 'Poison'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg'},
        {id: 4, name: 'Charmander', height: 0.6, type: ['Fire'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/4.svg'},
        {id: 5, name: 'Charmeleon', height: 1.1, type: ['Fire'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/5.svg'},
        {id: 6, name: 'Charizard', height: 1.7, type: ['Fire', 'Flying'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg'},
        {id: 7, name: 'Squirtle', height: 0.5, type: ['Water'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/7.svg'},
        {id: 8, name: 'Wartortle', height: 1, type: ['Water'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/8.svg'},
        {id: 9, name: 'Blastoise', height: 1.6, type: ['Water'], img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/9.svg'}
    ];

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
        Pyshic: '#f366b9',
        Fairy: '#fdb9e9', 
        Water: '#6890f0',
        Ice: '#98d8d8'
    }

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function appendId(id) {
        return '#' + id.toString().padStart(3, '0');
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
        pokemonName.innerText = pokemon.name;
        let pokemonID = document.createElement('p');
        pokemonID.innerText = appendId(pokemon.id);
        cardHeader.appendChild(pokemonName);
        cardHeader.appendChild(pokemonID);

        let cardBody = document.createElement('section');
        cardBody.classList.add('pokemon-card-body');
        card.appendChild(cardBody);
        let pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.img;
        cardBody.appendChild(pokemonImage);

        let cardFooter = document.createElement('section');
        cardFooter.classList.add('pokemon-card-footer');
        card.appendChild(cardFooter);
        pokemon.type.forEach(type => {
            let pokemonType = document.createElement('p');
            pokemonType.classList.add('pokemon-type-badge');
            pokemonType.innerText = type;
            pokemonType.style.backgroundColor = typeColors[type];
            cardFooter.appendChild(pokemonType);
        });
    }

    return {
        add: add,
        getAll: getAll,
        addPokemonToCard: addPokemonToCard
    };
})();

let pokemonList = pokemonRepository.getAll();

pokemonList.forEach(pokemon =>{
    pokemonRepository.addPokemonToCard(pokemon);
});