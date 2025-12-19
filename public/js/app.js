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
    const pikachuLoader = document.querySelector('.pikachu-loader');
    const loadingText = document.querySelector('.loading-text');

    // Enhanced interactive grid glow effect with animation
    let gridGlow = null;
    
    // Create animated grid glow element
    document.addEventListener('mousemove', function(e) {
        if (!gridGlow) {
            gridGlow = document.createElement('div');
            gridGlow.style.cssText = `
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(157, 78, 221, 0.5) 0%, rgba(123, 44, 191, 0.3) 30%, rgba(106, 27, 154, 0.15) 50%, transparent 70%);
                pointer-events: none;
                z-index: 1;
                mix-blend-mode: screen;
                transform: translate(-50%, -50%);
                transition: opacity 0.2s ease;
                filter: blur(20px);
                animation: glowPulse 3s ease-in-out infinite;
            `;
            
            // Add keyframe animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes glowPulse {
                    0%, 100% { 
                        filter: blur(20px);
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% { 
                        filter: blur(25px);
                        transform: translate(-50%, -50%) scale(1.15);
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(gridGlow);
        }
        
        gridGlow.style.left = e.clientX + 'px';
        gridGlow.style.top = e.clientY + 'px';
        gridGlow.style.opacity = '1';
    });
    
    // Fade out when mouse leaves window
    document.addEventListener('mouseleave', function() {
        if (gridGlow) {
            gridGlow.style.opacity = '0';
        }
    });

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }

    // Fetch all Pokémon data
    fetchHandler.GetJSON('https://pokeapi.co/api/v2/pokemon?limit=898', {})
        .then(data => {
            console.log("Pokémon Data:", data); // Check if data is received
            allPokemon = data.results;
            displayPokemon();
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
            showError('Failed to load Pokémon data. Please refresh the page.');
        });

    // Function to show error messages
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF0000, #CC0000);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // Debounce search input - supports name and number search
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
        const pikachuLoader = document.querySelector('.pikachu-loader');
        const loadingText = document.querySelector('.loading-text');
        
        isLoading = true;
        if (pikachuLoader) {
            pikachuLoader.classList.add('show');
            if (loadingText) loadingText.style.display = 'block';
        }

        const searchQuery = document.getElementById('search').value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon => {
            const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
            const nameMatch = pokemon.name.toLowerCase().includes(searchQuery);
            const numberMatch = pokemonId.includes(searchQuery) || pokemonId.padStart(4, '0').includes(searchQuery);
            return nameMatch || numberMatch;
        });
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex).sort((a, b) => {
            const idA = parseInt(a.url.split('/').slice(-2, -1)[0]);
            const idB = parseInt(b.url.split('/').slice(-2, -1)[0]);
            return idA - idB;
        });
        
        // Fetch and display Pokémon sequentially to maintain order
        const fetchPromises = paginatedPokemon.map((pokemon, index) => {
            return fetchHandler.GetJSON(pokemon.url, {})
                .then(data => ({
                    data: data,
                    index: index,
                    rank: index + 1 + startIndex
                }));
        });
        
        Promise.all(fetchPromises).then(results => {
            // Sort by index to maintain correct order
            results.sort((a, b) => a.index - b.index);
            
            // Display cards in order
            results.forEach(result => {
                const card = createPokemonCard(result.data, result.rank);
                document.querySelector('.pokemon-list').appendChild(card);
                card.classList.add('animate__animated', 'animate__fadeIn');
            });
            
            isLoading = false;
            if (pikachuLoader) {
                pikachuLoader.classList.remove('show');
                if (loadingText) loadingText.style.display = 'none';
            }
        }).then(() => {
            const lastPokemonCard = document.querySelector('.pokemon-list').lastElementChild;
            if (lastPokemonCard && filteredPokemon.length > endIndex) {
                observer.observe(lastPokemonCard);
            }
        }).catch(error => {
            console.error('Error displaying Pokémon:', error);
            isLoading = false;
            if (pikachuLoader) {
                pikachuLoader.classList.remove('show');
                if (loadingText) loadingText.style.display = 'none';
            }
        });
    }

    // Function to fetch Pokémon details and display card
    function fetchAndDisplayPokemon(pokemonUrl, rank) {
        return fetchHandler.GetJSON(pokemonUrl, {})
            .then(data => {
                const card = createPokemonCard(data, rank);
                document.querySelector('.pokemon-list').appendChild(card);
                card.classList.add('animate__animated', 'animate__fadeIn'); // Add animation
                return data;
            })
            .catch(error => {
                console.error('Error fetching Pokémon details:', error);
                throw error;
            });
    }

    // Function to create Pokémon card
    function createPokemonCard(data, rank) {
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
        const types = data.types.map(type => type.type.name);
        const pokemonIconUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${data.id.toString().padStart(3, '0')}.png`;
        const pokemonId = String(data.id).padStart(4, '0');

        const moves = data.moves.map(move => move.move.name).slice(0, 4); // Displaying only the first 4 moves

        const abilityCards = abilities.split(', ').map(ability => `
            <div class="small-card">${ability}</div>
        `).join('');

        const moveCards = moves.map(move => `
            <div class="small-card">${move}</div>
        `).join('');

        const typeIcons = types.map(type => `
            <span class="type-badge-small" style="background: var(--type-${type})">${type}</span>
        `).join('');

        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('card');
        pokemonCard.dataset.url = data.url;
        pokemonCard.innerHTML = `
            <div class="card--id">#${pokemonId}</div>
            <h2 class="poke-name">${data.name}</h2>
            <div class="type-icons">${typeIcons}</div>
            <img src="${pokemonIconUrl}" alt="${data.name}" class="card--image">
            <div class="card--details">
                <h3 class="card--abilities">Abilities</h3>
                <div class="small-card-container abilities-container">
                    ${abilityCards}
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
        const statBarsHTML = `
            <div class="stat-bars">
                ${data.stats.map(stat => {
                    const statName = stat.stat.name.replace('-', ' ');
                    const statValue = stat.base_stat;
                    const percentage = (statValue / 255) * 100;
                    return `
                        <div class="stat-bar-container">
                            <div class="stat-label">${statName}</div>
                            <div class="stat-bar-wrapper">
                                <div class="stat-bar" style="width: ${percentage}%"></div>
                            </div>
                            <div class="stat-value">${statValue}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        const baseStats = `
            <div class="base-stats">
                ${statBarsHTML}
                <div style="margin-top: 2rem;">
                    <canvas id="pokemonStatsChart"></canvas>
                </div>
            </div>
        `;
        fetchHandler.GetJSON(data.species.url, {})
            .then(speciesData => {
                // Fetch evolution chain
                return fetchHandler.GetJSON(speciesData.evolution_chain.url, {})
                    .then(evolutionData => {
                        showModal(data, baseStats, speciesData, evolutionData);
                    });
            })
            .catch(error => {
                console.error('Error fetching species data:', error);
            });
    }

    // Function to parse evolution chain
    function parseEvolutionChain(chain) {
        const evolutions = [];
        let current = chain;
        
        while (current) {
            const speciesName = current.species.name;
            const speciesId = current.species.url.split('/').slice(-2, -1)[0];
            evolutions.push({ name: speciesName, id: speciesId });
            current = current.evolves_to[0];
        }
        
        return evolutions;
    }

    // Function to show modal with Pokemon details
    function showModal(data, baseStats, speciesData, evolutionData) {
        const modal = document.querySelector('.modal');
        const genderRate = getGenderRatio(speciesData.gender_rate);
        const catchRate = speciesData.capture_rate;
        const pokemonId = String(data.id).padStart(4, '0');
        const types = data.types.map(type => `<span class="type-badge" style="background: var(--type-${type.type.name})">${type.type.name}</span>`).join(' ');
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
        const genus = speciesData.genera.find(g => g.language.name === 'en')?.genus || 'Unknown';
        const flavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
        
        // Parse evolution chain
        const evolutions = parseEvolutionChain(evolutionData.chain);
        const evolutionHTML = evolutions.length > 1 ? `
            <div class="evolution-chain">
                <h3>Evolution Chain</h3>
                <div class="evolution-container">
                    ${evolutions.map((evo, index) => `
                        <div class="evolution-item">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png" 
                                 alt="${evo.name}" 
                                 class="evolution-image">
                            <p class="evolution-name">${evo.name}</p>
                            <p class="evolution-id">#${String(evo.id).padStart(4, '0')}</p>
                        </div>
                        ${index < evolutions.length - 1 ? '<div class="evolution-arrow">→</div>' : ''}
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        const modalContent = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${data.name} <span style="color: var(--text-secondary); font-size: 0.7em;">#${pokemonId}</span></h2>
                <div class="modal-details">
                    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="modal--image">
                    <div class="modal--details">
                        <p><span class="label">Category:</span> ${genus}</p>
                        <p><span class="label">Type:</span> ${types}</p>
                        <p><span class="label">Height:</span> ${(data.height / 10).toFixed(1)} m (${Math.floor((data.height / 10) * 3.281)}' ${Math.round((((data.height / 10) * 3.281) % 1) * 12)}")</p>
                        <p><span class="label">Weight:</span> ${(data.weight / 10).toFixed(1)} kg (${(data.weight / 10 * 2.205).toFixed(1)} lbs)</p>
                        <p><span class="label">Abilities:</span> ${abilities}</p>
                        <p><span class="label">Gender Ratio:</span> ${genderRate}</p>
                        <p><span class="label">Catch Rate:</span> ${catchRate}</p>
                    </div>
                </div>
                <div class="modal-info">
                    <p style="color: var(--text-primary); font-style: italic; line-height: 1.8;">${flavorText}</p>
                </div>
                ${evolutionHTML}
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
            const pokeId = event.target.querySelector('.poke-id');
            if (pokeId) pokeId.style.display = 'none';
        }
    });

    // Smooth scroll to top when search is used
    document.getElementById('search').addEventListener('focus', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(event) {
        const modal = document.querySelector('.modal');
        if (modal && modal.style.display === 'block' && event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

    console.log('🎮 Pokédex loaded successfully!');
});
