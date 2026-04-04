// Загрузка данных о системах
let systemsData = [];
let filteredData = [];

// Континенты
const continents = {
    'europe': 'Европа',
    'asia': 'Азия',
    'africa': 'Африка',
    'north_america': 'Северная Америка',
    'south_america': 'Южная Америка',
    'australia': 'Австралия и Океания'
};

fetch('systems-data.json')
    .then(response => response.json())
    .then(data => {
        systemsData = data;
        filteredData = data;
        initializeFilters();
        displaySystems(filteredData);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Инициализация фильтров
function initializeFilters() {
    const searchBox = document.querySelector('.search-box');
    
    // Создаём контейнер для фильтров
    const filtersHTML = `
        <div class="filters">
            <div class="filter-group">
                <label for="continentFilter">Континент:</label>
                <select id="continentFilter">
                    <option value="">Все континенты</option>
                    ${Object.entries(continents).map(([code, name]) => 
                        `<option value="${code}" ${code === 'europe' ? 'selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label for="countryFilter">Страна:</label>
                <select id="countryFilter">
                    <option value="">Все страны</option>
                </select>
            </div>
        </div>
    `;
    
    searchBox.insertAdjacentHTML('afterend', filtersHTML);
    
    // Обработчики фильтров
    document.getElementById('continentFilter').addEventListener('change', handleFilters);
    document.getElementById('countryFilter').addEventListener('change', handleFilters);
    
    // Инициализируем фильтр стран для Европы
    updateCountryFilter('europe');
}

// Обновление списка стран
function updateCountryFilter(continentCode) {
    const countryFilter = document.getElementById('countryFilter');
    const countries = [...new Set(
        systemsData
            .filter(s => !continentCode || s.continent === continentCode)
            .map(s => s.country)
    )].sort();
    
    countryFilter.innerHTML = '<option value="">Все страны</option>' + 
        countries.map(country => `<option value="${country}">${country}</option>`).join('');
}

// Обработка фильтров
function handleFilters() {
    const continent = document.getElementById('continentFilter').value;
    const country = document.getElementById('countryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Обновляем список стран при смене континента
    if (continent !== handleFilters.lastContinent) {
        updateCountryFilter(continent);
        handleFilters.lastContinent = continent;
    }
    
    // Фильтрация
    filteredData = systemsData.filter(system => {
        const matchContinent = !continent || system.continent === continent;
        const matchCountry = !country || system.country === country;
        const matchSearch = !searchTerm || 
            system.city.toLowerCase().includes(searchTerm) ||
            system.country.toLowerCase().includes(searchTerm);
        
        return matchContinent && matchCountry && matchSearch;
    });
    
    displaySystems(filteredData);
}

// Функция отображения систем
function displaySystems(systems) {
    const grid = document.getElementById('systemsGrid');
    
    if (systems.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Системы не найдены</p>';
        return;
    }
    
    grid.innerHTML = systems.map(system => `
        <a href="system.html?id=${system.id}" class="system-card card-link">
            <img src="${system.image}" alt="${system.city}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200/3498db/ffffff?text=${system.city}'">
            <div class="card-content">
                <h3>${system.city}</h3>
                <p class="country">🌍 ${system.country}</p>
                <p><strong>Год открытия:</strong> ${system.yearOpened}</p>
                <p><strong>Длина сети:</strong> ${system.networkLength} км</p>
                <p><strong>Маршрутов:</strong> ${system.routes}</p>
                <p style="margin-top: 1rem;">${system.description}</p>
            </div>
        </a>
    `).join('');
}

// Поиск
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', handleFilters);
