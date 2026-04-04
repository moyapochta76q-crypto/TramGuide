// Загрузка данных о вагонах
let tramsData = [];
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
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%239b59b6' width='400' height='200'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='40'%3E🚃%3C/text%3E%3C/svg%3E";

fetch('trams-data.json')
    .then(response => response.json())
    .then(data => {
        tramsData = data;
        filteredData = data;
        initializeFilters();
        displayTrams(filteredData);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Инициализация фильтров
function initializeFilters() {
    const searchBox = document.querySelector('.search-box');
    
    const filtersHTML = `
        <div class="filters">
            <div class="filter-group">
                <label for="continentFilter">Континент эксплуатации:</label>
                <select id="continentFilter">
                    <option value="">Все континенты</option>
                    ${Object.entries(continents).map(([code, name]) => 
                        `<option value="${code}" ${code === 'europe' ? 'selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label for="countryFilter">Страна эксплуатации:</label>
                <select id="countryFilter">
                    <option value="">Все страны</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="cityFilter">Город эксплуатации:</label>
                <select id="cityFilter">
                    <option value="">Все города</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="typeFilter">Тип вагона:</label>
                <select id="typeFilter">
                    <option value="">Все типы</option>
                    <option value="low-floor">Низкопольный</option>
                    <option value="high-floor">Высокопольный</option>
                </select>
            </div>
        </div>
    `;
    
    searchBox.insertAdjacentHTML('afterend', filtersHTML);
    
    document.getElementById('continentFilter').addEventListener('change', handleFilters);
    document.getElementById('countryFilter').addEventListener('change', handleFilters);
    document.getElementById('cityFilter').addEventListener('change', handleFilters);
    document.getElementById('typeFilter').addEventListener('change', handleFilters);
    
    updateCountryFilter('europe');
    handleFilters();
}

// Обновление списка стран
function updateCountryFilter(continentCode) {
    const countries = new Set();
    
    tramsData.forEach(tram => {
        if (tram.cities) {
            tram.cities.forEach(city => {
                if (!continentCode || city.continent === continentCode) {
                    countries.add(city.country);
                }
            });
        }
    });
    
    const countryFilter = document.getElementById('countryFilter');
    countryFilter.innerHTML = '<option value="">Все страны</option>' + 
        [...countries].sort().map(country => `<option value="${country}">${country}</option>`).join('');
    
    updateCityFilter(continentCode, '');
}

// Обновление списка городов
function updateCityFilter(continentCode, countryCode) {
    const cities = new Set();
    
    tramsData.forEach(tram => {
        if (tram.cities) {
            tram.cities.forEach(city => {
                const matchContinent = !continentCode || city.continent === continentCode;
                const matchCountry = !countryCode || city.country === countryCode;
                
                if (matchContinent && matchCountry) {
                    cities.add(city.city);
                }
            });
        }
    });
    
    const cityFilter = document.getElementById('cityFilter');
    cityFilter.innerHTML = '<option value="">Все города</option>' + 
        [...cities].sort().map(city => `<option value="${city}">${city}</option>`).join('');
}

// Обработка фильтров
function handleFilters() {
    const continent = document.getElementById('continentFilter').value;
    const country = document.getElementById('countryFilter').value;
    const city = document.getElementById('cityFilter').value;
    const type = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (continent !== handleFilters.lastContinent) {
        updateCountryFilter(continent);
        handleFilters.lastContinent = continent;
    }
    
    if (country !== handleFilters.lastCountry) {
        updateCityFilter(continent, country);
        handleFilters.lastCountry = country;
    }
    
    filteredData = tramsData.filter(tram => {
        const matchType = !type || tram.type === type;
        
        const matchSearch = !searchTerm || 
            tram.model.toLowerCase().includes(searchTerm) ||
            tram.manufacturer.toLowerCase().includes(searchTerm) ||
            tram.countryOfOrigin.toLowerCase().includes(searchTerm);
        
        let matchGeo = true;
        if (continent || country || city) {
            matchGeo = tram.cities && tram.cities.some(c => {
                const matchContinent = !continent || c.continent === continent;
                const matchCountry = !country || c.country === country;
                const matchCity = !city || c.city === city;
                return matchContinent && matchCountry && matchCity;
            });
        }
        
        return matchType && matchSearch && matchGeo;
    });
    
    displayTrams(filteredData);
}

// Функция отображения вагонов
function displayTrams(trams) {
    const grid = document.getElementById('tramsGrid');
    
    if (trams.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Вагоны не найдены</p>';
        return;
    }
    
    grid.innerHTML = trams.map(tram => `
        <a href="tram.html?id=${tram.id}" class="tram-card card-link">
            <img src="${tram.image}" alt="${tram.model}" class="card-image" onerror="this.onerror=null; this.src='${placeholderImage}'">
            <div class="card-content">
                <h3>${tram.model}</h3>
                <p class="country">🏭 ${tram.manufacturer}</p>
                <p><strong>Страна производства:</strong> ${tram.countryOfOrigin}</p>
                <p><strong>Годы выпуска:</strong> ${tram.yearStart}${tram.yearEnd ? ' - ' + tram.yearEnd : ' - н.в.'}</p>
                <p><strong>Тип:</strong> ${tram.typeName}</p>
            </div>
        </a>
    `).join('');
}

// Поиск
document.getElementById('searchInput').addEventListener('input', handleFilters);
