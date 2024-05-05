// app.js
import FetchHandler from './fetchHandler.js';

const fetchHandler = new FetchHandler();
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

document.addEventListener("DOMContentLoaded", function () {
    const loadingSpinner = document.querySelector('.loading-spinner');

    // Fetch all Pokémon data
    fetchHandler.GetJSON('https://pokeapi.co/api/v2/pokemon?limit=898', {})
        .then(data => {
            console.log("Pokémon Data:", data); // Check if data is received
            allPokemon = data.results;
            displayPokemon();
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
        });

    // Debounce search input
    let searchTimeout;
    document.getElementById('search').addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            document.querySelector('.pokemon-list').innerHTML = ''; // Clear the existing Pokémon cards
            displayPokemon();
        }, 300); // 300ms debounce
    });

    // Function to display Pokémon cards
    function displayPokemon() {
        const loadingSpinner = document.querySelector('.loading-spinner');
        isLoading = true;
        if (loadingSpinner)
            loadingSpinner.classList.add('show');

        const searchQuery = document.getElementById('search').value.toLowerCase();
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
        Promise.all(paginatedPokemon.map((pokemon, index) => {
            return fetchAndDisplayPokemon(pokemon.url, index + 1 + startIndex);
        })).then(() => {
            isLoading = false;
            if (loadingSpinner)
                loadingSpinner.classList.remove('show');
        }).then(() => {
            const lastPokemonCard = document.querySelector('.pokemon-list').lastElementChild;
            if (lastPokemonCard) {
                observer.observe(lastPokemonCard);
            }
        });
    }

    // Function to fetch Pokémon details and display card
    function fetchAndDisplayPokemon(pokemonUrl, rank) {
        isLoading = true;
        if (loadingSpinner)
            loadingSpinner.classList.add('show');
        return fetchHandler.GetJSON(pokemonUrl, {})
            .then(data => {
                const card = createPokemonCard(data, rank);
                document.querySelector('.pokemon-list').appendChild(card);
                card.classList.add('animate__animated', 'animate__fadeIn'); // Add animation
            })
            .catch(error => {
                console.error('Error fetching Pokémon details:', error);
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

        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('card');
        pokemonCard.dataset.url = data.url;
        pokemonCard.style.backgroundColor = typeColors[types[0]].backgroundColor;
        pokemonCard.innerHTML = `
            <h2 class="poke-name">${data.name}</h2>
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
        `;

        // Add click event to show Pokemon details
        pokemonCard.addEventListener('click', function () {
            fetchPokemonDetailsAndShowModal(data);
        });

        return pokemonCard;
    }


    // Function to fetch Pokemon details and show modal
    function fetchPokemonDetailsAndShowModal(data) {
        const baseStats = `
            <div class="base-stats">
                <canvas id="pokemonStatsChart"></canvas>
            </div>
        `;
        fetchHandler.GetJSON(data.species.url, {})
            .then(speciesData => {
                showModal(data, baseStats, speciesData);
            })
            .catch(error => {
                console.error('Error fetching species data:', error);
            });
    }

    // Function to show modal with Pokemon details
    function showModal(data, baseStats, speciesData) {
        const modal = document.querySelector('.modal');
        const genderRate = getGenderRatio(speciesData.gender_rate);
        const catchRate = speciesData.capture_rate;
        const experienceLevel = speciesData.base_experience;
        const pokemonId = data.id;
        const modalContent = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${data.name}</h2>
                <div class="modal-details">
                    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="modal--image">
                    <div class="modal--details">
                        <p>Pokemon ID: ${pokemonId}</p>
                        <p>Experience Level: ${experienceLevel}</p>
                        <p>Weight: ${data.weight / 10} kg</p>
                        <p>Height: ${data.height / 10} m</p>
                        <p>Catch Rate: ${catchRate}%</p>
                        <p>Gender Ratio: ${genderRate}</p>

                    </div>
                </div>
                <div class="additional-details">
                    <h3>Base Stats</h3>
                    ${baseStats}
                </div>
            </div>
        `;

        modal.innerHTML = modalContent;
        const stats = data.stats.map(stat => stat.base_stat);
        displayStatsChart(stats, typeColors[data.types[0].type.name].statColor);
        modal.style.display = 'block';

        // Close modal
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Function to get gender ratio
    function getGenderRatio(genderRate) {
        let malePercentage = ((8 - genderRate) / 8) * 100;
        let femalePercentage = 100 - malePercentage;
        if (malePercentage < 0) {
            malePercentage = 0;
            femalePercentage = 100;
        } else if (femalePercentage < 0) {
            femalePercentage = 0;
            malePercentage = 100;
        }
        return `${malePercentage.toFixed(2)}% ♂, ${femalePercentage.toFixed(2)}% ♀`;
    }

    // Function to get gender ratio
    function getGenderRatio(genderRate) {
        let malePercentage = ((8 - genderRate) / 8) * 100;
        let femalePercentage = 100 - malePercentage;
        if (malePercentage < 0) {
            malePercentage = 0;
            femalePercentage = 100;
        } else if (femalePercentage < 0) {
            femalePercentage = 0;
            malePercentage = 100;
        }
        return `${malePercentage.toFixed(2)}% ♂, ${femalePercentage.toFixed(2)}% ♀`;
    }

    // Function to get catch rate in percentage
    function getCatchRatePercentage(catchRate) {
        return ((100 / 255) * catchRate).toFixed(2);
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
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchNextPage();
                observer.unobserve(entry.target);
            }
        });
    });

    // Show Pokemon ID on hover
    document.querySelector('.pokemon-list').addEventListener('mouseenter', function (event) {
        if (event.target.classList.contains('card')) {
            event.target.querySelector('.poke-id').style.display = 'block';
        }
    });

    document.querySelector('.pokemon-list').addEventListener('mouseleave', function (event) {
        if (event.target.classList.contains('card')) {
            event.target.querySelector('.poke-id').style.display = 'none';
        }
    });
});
