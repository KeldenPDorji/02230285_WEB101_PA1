// public/js/modal.js

export function createModal(data) {
    const modalContent = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 class="modal-pokemon-name">${data.name}</h2>
            <div class="modal-info">
                <p><span class="label">National No.:</span> ${data.id}</p>
                <p><span class="label">Type:</span> ${data.types.map(type => type.type.name).join('/')}</p>
                <p><span class="label">Species:</span> ${data.species.name}</p>
                <p><span class="label">Height:</span> ${data.height / 10}m</p>
                <p><span class="label">Weight:</span> ${data.weight / 10}kg</p>
                <p><span class="label">Abilities:</span> ${data.abilities.map(ability => ability.ability.name).join(', ')} (hidden ability: ${data.abilities[data.abilities.length - 1].ability.name})</p>
                <p><span class="label">Local No.:</span> Entries for various Pokémon games</p>
            </div>
            <div class="modal-info">
                <h3>Base Stats:</h3>
                <div class="chart">
                    ${data.stats.map(stat => `
                        <div class="stat">
                            <div class="label">${stat.stat.name}</div>
                            <div class="bar" style="width: ${stat.base_stat / 2}px;"></div>
                            <div class="value">${stat.base_stat}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    $('.modal').html(modalContent);
    $('.modal').addClass('show');

    // Create Chart.js instance for base stats
    const ctx = document.getElementById('pokemonStatsChart').getContext('2d');
    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: data.stats.map(stat => stat.stat.name),
            datasets: [{
                label: 'Base Stats',
                data: data.stats.map(stat => stat.base_stat),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });

    // Close modal when close button is clicked
    $('.close-button').click(function () {
        closeModal();
    });

    // Close modal when clicking outside modal
    $(window).click(function (e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

export function closeModal() {
    $('.modal').removeClass('show');
    $('.modal').empty();
}
