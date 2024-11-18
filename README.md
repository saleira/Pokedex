# Pokémon Web Application

This project is a simple web application that displays a list of Pokémon using the [PokéAPI](https://pokeapi.co/). The application allows users to filter Pokémon by generation and type. It features infinite scrolling, so new Pokémon are loaded as you scroll down the page.

## Features

- Display Pokémon with their name, ID, image, and types.
- Filter Pokémon by generation and type.
- Infinite scrolling to load more Pokémon as you scroll down.
- Back to top button for easy navigation.

## Design

The design of this application was inspired by the [Medium article titled "Designing a Pokémon Application: Wireframes, UI, and Prototype" by Skaoi](https://medium.com/@Skaoi/designing-a-pok%C3%A9mon-application-wireframes-ui-and-prototype-9cc6ec4de477).

## Technologies Used

- HTML
- CSS (Bootstrap)
- JavaScript
- PokéAPI (https://pokeapi.co/)

## JavaScript Code Explanation

### 1. **pokemonRepository Object**
The main object for managing the Pokémon data and the interaction with the API. It includes various methods for loading and displaying Pokémon, handling types and generations, and adding dynamic functionality to the page.

### Key Methods:
- **add(pokemon)**: Adds a Pokémon object to the `pokemonList`.
- **getAll()**: Returns all the Pokémon in the list.
- **appendId(id)**: Formats the Pokémon ID to be displayed in the format `#001`.
- **createCard(pokemon)**: Creates a card for each Pokémon and appends it to the main Pokémon container.
- **renderPokemonList()**: Clears the current list of Pokémon and re-renders the list from the `pokemonList`.
- **loadList()**: Loads the Pokémon list from the API and handles fetching by generation or type.
- **loadPokemonDetails(item)**: Fetches the details of a single Pokémon, including its types and image.
- **loadDropdowns(apiUrl)**: Fetches the data for the generation and type dropdowns.
- **createDropdown(list, dropdownSelector)**: Creates a dropdown list in the DOM based on the data passed.
- **showLoading()**: Displays a loading spinner while data is being fetched.
- **hideLoading()**: Hides the loading spinner after the data has been loaded.
- **enableScrollLoading()**: Adds an event listener to the window to load more Pokémon when the user scrolls down.
- **disableScrollLoading()**: Removes the scroll event listener to stop loading more Pokémon.
- **handleScroll()**: Detects when the user has scrolled to the bottom of the page and triggers loading more Pokémon.
- **resetFilter()**: Resets the current generation and type filters, and reloads the list of Pokémon.

### 2. **Dropdown Handling**
The dropdowns for selecting a generation or type of Pokémon are dynamically generated and populated using the `loadGenerationDropdown` and `loadTypeDropdown` methods. The user can click on a generation or type, which will reload the Pokémon list filtered by the selected option.

### 3. **Infinite Scrolling**
The infinite scrolling functionality is handled by the `enableScrollLoading` and `handleScroll` methods. When the user scrolls near the bottom of the page, the application loads more Pokémon automatically.

### 4. **Back to Top Button**
A "Back to Top" button is displayed when the user scrolls more than 300 pixels down the page. Clicking the button scrolls the page smoothly to the top.