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

// Placeholder изображение
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%233498db' width='400' height='200'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='40'%3E🚋%3C/text%3E%3C/svg%3E";

// Загрузка данных
fetch('systems-data.json')
    .then(response => response.json())
    .then(data => {
        systemsData = data;
        filteredData = data;
        
        // Инициализируем интерактивную карту
        if (typeof initWorldMap === 'function') {
            initWorldMap('interactiveMap', systemsData);
        }
        
        initializeFilters();
        displaySystems(filteredData);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Инициализация фильтров
function initializeFilters() {
    const searchBox = document.querySelector('.search-box');
    
    const filtersHTML = `
        <div class="filters">
            <div class="filter-group">
                <label for="continentFilter">Континент:</label>
                <select id="continentFilter">
                    <option value="">Все континенты</option>
                    ${Object.entries(continents).map(([code, name]) => 
                        `<option value="${code}">${name}</option>`
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
    
    document.getElementById('continentFilter').addEventListener('change', handleFilters);
    document.getElementById('countryFilter').addEventListener('change', handleFilters);
    
    // Заполняем список стран
    updateCountryFilter('');
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
    
    if (continent !== handleFilters.lastContinent) {
        updateCountryFilter(continent);
        handleFilters.lastContinent = continent;
    }
    
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
            <img src="${system.image}" alt="${system.city}" class="card-image" onerror="this.onerror=null; this.src='${placeholderImage}'">
            <div class="card-content">
                <h3>${system.city}</h3>
                <p class="country">🌍 ${system.country}</p>
                <p><strong>Год открытия:</strong> ${system.yearOpened}</p>
                <p><strong>Длина сети:</strong> ${system.networkLength} км</p>
                <p><strong>Маршрутов:</strong> ${system.routes}</p>
            </div>
        </a>
    `).join('');
}

// Поиск
document.getElementById('searchInput').addEventListener('input', handleFilters);
