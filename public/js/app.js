import AJAX from './ajaxHandler.js';

const ajax = new AJAX();
const pageSize = 20;
let currentPage = 1;
let allPokemon = [];
let favorites = [];
let isLoading = false;

const typeColors = {
    normal: { backgroundColor: 'rgba(168, 167, 122, 0.5)', statColor: 'rgba(168, 167, 122, 0.2)' },
    fire: { backgroundColor: 'rgba(238, 129, 48, 0.5)', statColor: 'rgba(238, 129, 48, 0.2)' },
    water: { backgroundColor: 'rgba(99, 144, 240, 0.5)', statColor: 'rgba(99, 144, 240, 0.2)' },
    electric: { backgroundColor: 'rgba(247, 208, 44, 0.5)', statColor: 'rgba(247, 208, 44, 0.2)' },
    grass: { backgroundColor: 'rgba(122, 199, 76, 0.5)', statColor: 'rgba(122, 199, 76, 0.2)' },
    ice: { backgroundColor: 'rgba(150, 217, 214, 0.5)', statColor: 'rgba(150, 217, 214, 0.2)' },
    fighting: { backgroundColor: 'rgba(194, 46, 40, 0.5)', statColor: 'rgba(194, 46, 40, 0.2)' },
    poison: { backgroundColor: 'rgba(163, 62, 161, 0.5)', statColor: 'rgba(163, 62, 161, 0.2)' },
    ground: { backgroundColor: 'rgba(226, 191, 101, 0.5)', statColor: 'rgba(226, 191, 101, 0.2)' },
    flying: { backgroundColor: 'rgba(169, 143, 243, 0.5)', statColor: 'rgba(169, 143, 243, 0.2)' },
    psychic: { backgroundColor: 'rgba(249, 85, 135, 0.5)', statColor: 'rgba(249, 85, 135, 0.2)' },
    bug: { backgroundColor: 'rgba(166, 185, 26, 0.5)', statColor: 'rgba(166, 185, 26, 0.2)' },
    rock: { backgroundColor: 'rgba(182, 161, 66, 0.5)', statColor: 'rgba(182, 161, 66, 0.2)' },
    ghost: { backgroundColor: 'rgba(115, 87, 151, 0.5)', statColor: 'rgba(115, 87, 151, 0.2)' },
    dragon: { backgroundColor: 'rgba(111, 53, 252, 0.5)', statColor: 'rgba(111, 53, 252, 0.2)' },
    dark: { backgroundColor: 'rgba(112, 88, 70, 0.5)', statColor: 'rgba(112, 88, 70, 0.2)' },
    steel: { backgroundColor: 'rgba(183, 183, 206, 0.5)', statColor: 'rgba(183, 183, 206, 0.2)' },
    fairy: { backgroundColor: 'rgba(214, 133, 173, 0.5)', statColor: 'rgba(214, 133, 173, 0.2)' }
};

$(document).ready(function () {
    const $loadingSpinner = $('.loading-spinner');

    // Fetch all Pokémon data
    ajax.GetJSON('https://pokeapi.co/api/v2/pokemon?limit=898', {}, (error, data) => {
        if (error) {
            console.error('Error fetching Pokémon data:', error);
            return;
        }
        allPokemon = data.results;
        displayPokemon();
    });

    // Debounce search input
    let searchTimeout;
    $('#search').on('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            $('.pokemon-list').empty(); // Clear the existing Pokémon cards
            displayPokemon();
        }, 300); // 300ms debounce
    });

    // Function to display Pokémon cards
    function displayPokemon() {
        const searchQuery = $('#search').val().toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon => {
            const nameMatch = pokemon.name.toLowerCase().includes(searchQuery);
            return nameMatch;
        });
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex).sort((a, b) => {
            const idA = parseInt(a.url.split('/').slice(-2, -1)[0]);
            const idB = parseInt(b.url.split('/').slice(-2, -1)[0]);
            return idA - idB;
        });
        paginatedPokemon.forEach((pokemon, index) => {
            fetchAndDisplayPokemon(pokemon.url, index + 1 + startIndex);
        });
    }

    // Function to fetch Pokémon details and display card
    function fetchAndDisplayPokemon(pokemonUrl, rank) {
        isLoading = true;
        $loadingSpinner.addClass('show');
        ajax.GetJSON(pokemonUrl, {}, (error, data) => {
            isLoading = false;
            $loadingSpinner.removeClass('show');
            if (error) {
                console.error('Error fetching Pokémon details:', error);
                return;
            }
            const card = createPokemonCard(data, rank);
            $('.pokemon-list').append(card);
            card.addClass('animate__animated animate__fadeIn'); // Add animation
        });
    }

    // Function to create Pokémon card
    function createPokemonCard(data, rank) {
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
        const types = data.types.map(type => type.type.name);
        const pokemonIconUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${data.id.toString().padStart(3, '0')}.png`;

        const moves = data.moves.map(move => move.move.name).slice(0, 5); // Displaying only the first 5 moves

        const abilityCards = abilities.split(', ').map(ability => `
            <div class="small-card">${ability}</div>
        `).join('');

        const moveCards = moves.map(move => `
            <div class="small-card">${move}</div>
        `).join('');

        const pokemonCard = $(`
            <div class="card" data-url="${data.url}" style="background-color: ${typeColors[types[0]].backgroundColor}">
                <h2 class="poke-name">${data.name}</h2>
                <h3 class="poke-id" style="position: absolute; top: 10px; left: 10px; font-family: 'Arial', sans-serif; color: white;">#${data.id}</h3>
                <div class="card__inner">
                    <div class="card__front">
                        <img src="${pokemonIconUrl}" alt="${data.name}" class="card--image">
                        <div class="card--details">
                            <h3 class="card--abilities">Abilities:</h3>
                            <div class="small-card-container">
                                ${abilityCards}
                            </div>
                        </div>
                    </div>
                    <div class="card__back">
                        <p>Type: ${types.join(', ')}</p>
                        <div class="card--details">
                            <h3 class="card--moves">Moves:</h3>
                            <div class="small-card-container">
                                ${moveCards}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Add click event to show Pokemon details
        pokemonCard.click(function () {
            fetchBaseStatsAndShowModal(data);
        });

        return pokemonCard;
    }

    // Function to fetch base stats and show modal
    function fetchBaseStatsAndShowModal(data) {
        ajax.GetJSON(data.species.url, {}, (error, speciesData) => {
            if (error) {
                console.error('Error fetching species data:', error);
                return;
            }
            const baseStats = `
                <div class="base-stats">
                    <canvas id="pokemonStatsChart"></canvas>
                </div>
            `;
            showModal(data, baseStats);
        });
    }

    // Show modal with Pokemon details
    function showModal(data, baseStats) {
        const modalContent = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${data.name}</h2>
                <div class="modal-details">
                    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="modal--image">
                    <div class="modal--details">
                        <p>Type: ${data.types.map(type => type.type.name).join(', ')}</p>
                        <p>Weight: ${data.weight / 10} kg</p>
                        <p>Height: ${data.height / 10} m</p>
                    </div>
                </div>
                <div class="additional-details">
                    <h3>Base Stats</h3>
                    ${baseStats}
                </div>
            </div>
        `;

        $('.modal').html(modalContent);
        const stats = data.stats.map(stat => stat.base_stat);
        displayStatsChart(stats, typeColors[data.types[0].type.name].statColor);
        $('.modal').css('display', 'block');

        // Close modal
        $('.close-button').click(() => {
            $('.modal').css('display', 'none');
        });
    }

    // Display chart of Pokemon stats
    function displayStatsChart(stats, backgroundColor) {
        const ctx = document.getElementById('pokemonStatsChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
                datasets: [{
                    label: 'Base Stats',
                    data: stats,
                    backgroundColor: backgroundColor,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 200
                    }
                }
            }
        });
    }

    // Fetch next page of Pokemon data
    function fetchNextPage() {
        if (!isLoading) {
            currentPage++;
            displayPokemon();
        }
    }

    // Add scroll event to fetch next page
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            fetchNextPage();
        }
    });

    // Show Pokemon ID on hover
    $('.pokemon-list').on('mouseenter', '.card', function () {
        $(this).find('.poke-id').fadeIn();
    });

    $('.pokemon-list').on('mouseleave', '.card', function () {
        $(this).find('.poke-id').fadeOut();
    });
});
