// Загрузка данных о вагонах
let tramsData = [];

fetch('trams-data.json')
    .then(response => response.json())
    .then(data => {
        tramsData = data;
        displayTrams(tramsData);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Функция отображения вагонов
function displayTrams(trams) {
    const grid = document.getElementById('tramsGrid');
    
    if (trams.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Вагоны не найдены</p>';
        return;
    }
    
    grid.innerHTML = trams.map(tram => `
        <div class="tram-card">
            <img src="${tram.image}" alt="${tram.model}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200/9b59b6/ffffff?text=${tram.model}'">
            <div class="card-content">
                <h3>${tram.model}</h3>
                <p class="country">🏭 ${tram.manufacturer}</p>
                <p><strong>Страна:</strong> ${tram.country}</p>
                <p><strong>Годы выпуска:</strong> ${tram.yearStart}${tram.yearEnd ? ' - ' + tram.yearEnd : ' - н.в.'}</p>
                <p><strong>Тип:</strong> ${tram.type}</p>
                <p><strong>Длина:</strong> ${tram.length} м</p>
                <p><strong>Вместимость:</strong> ${tram.capacity} чел.</p>
                <p style="margin-top: 1rem;">${tram.description}</p>
            </div>
        </div>
    `).join('');
}

// Поиск
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = tramsData.filter(tram => 
        tram.model.toLowerCase().includes(searchTerm) ||
        tram.manufacturer.toLowerCase().includes(searchTerm) ||
        tram.country.toLowerCase().includes(searchTerm)
    );
    displayTrams(filtered);
});
