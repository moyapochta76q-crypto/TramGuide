// Загрузка данных о системах
let systemsData = [];
let filteredData = [];
let map = null;
let markers = [];

// Континенты
const continents = {
    'europe': 'Европа',
    'asia': 'Азия',
    'africa': 'Африка',
    'north_america': 'Северная Америка',
    'south_america': 'Южная Америка',
    'australia': 'Австралия и Океания'
};

// Цвета маркеров
const continentColors = {
    'europe': '#3498db',
    'asia': '#e74c3c',
    'africa': '#f39c12',
    'north_america': '#2ecc71',
    'south_america': '#9b59b6',
    'australia': '#1abc9c'
};

// Инициализация карты
function initMap() {
    map = L.map('map').setView([45, 20], 3);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
    }).addTo(map);
}

// Создание маркера
function createCustomMarker(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 20px;
            height: 20px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Добавление маркеров на карту
function addMarkersToMap(systems) {
    // Удаляем старые маркеры
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    systems.forEach(system => {
        if (system.coordinates) {
            const color = continentColors[system.continent] || '#95a5a6';
            const marker = L.marker(
                [system.coordinates.lat, system.coordinates.lng],
                { icon: createCustomMarker(color) }
            ).addTo(map);
            
            const popupContent = `
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${system.city}</h4>
                    <p style="margin: 4px 0; color: #555;"><strong>🌍</strong> ${system.country}</p>
                    <p style="margin: 4px 0; color: #555;"><strong>📅</strong> ${system.yearOpened} г.</p>
                    <p style="margin: 4px 0; color: #555;"><strong>📏</strong> ${system.networkLength} км</p>
                    <a href="system.html?id=${system.id}" style="
                        display: inline-block;
                        margin-top: 8px;
                        padding: 6px 12px;
                        background: #3498db;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 13px;
                    ">Подробнее →</a>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            markers.push(marker);
        }
    });
}

// Загрузка данных
fetch('systems-data.json')
    .then(response => response.json())
    .then(data => {
        systemsData = data;
        filteredData = data;
        initMap();
        initializeFilters();
        addMarkersToMap(filteredData);
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
    
    document.getElementById('continentFilter').addEventListener('change', handleFilters);
    document.getElementById('countryFilter').addEventListener('change', handleFilters);
    
    updateCountryFilter('europe');
    // Применяем фильтр Европы по умолчанию
    handleFilters();
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
    addMarkersToMap(filteredData);
    
    // Центрируем карту на отфильтрованных системах
    if (filteredData.length > 0) {
        const bounds = L.latLngBounds(
            filteredData
                .filter(s => s.coordinates)
                .map(s => [s.coordinates.lat, s.coordinates.lng])
        );
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }
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
            </div>
        </a>
    `).join('');
}

// Поиск
document.getElementById('searchInput').addEventListener('input', handleFilters);
