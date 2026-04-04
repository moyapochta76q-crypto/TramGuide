// Цвета континентов
const continentColors = {
    'europe': '#3498db',
    'asia': '#e74c3c', 
    'africa': '#f39c12',
    'north_america': '#2ecc71',
    'south_america': '#9b59b6',
    'australia': '#1abc9c'
};

// Соответствие стран континентам
const countryToContinent = {
    'BY': 'europe', 'RU': 'europe', 'CZ': 'europe', 'DE': 'europe',
    'FR': 'europe', 'PL': 'europe', 'UA': 'europe', 'LV': 'europe',
    'JP': 'asia', 'CN': 'asia', 'AE': 'asia',
    'MA': 'africa', 'EG': 'africa', 'ZA': 'africa',
    'CA': 'north_america', 'US': 'north_america', 'MX': 'north_america',
    'BR': 'south_america', 'AR': 'south_america',
    'AU': 'australia', 'NZ': 'australia'
};

// Названия стран
const countryNames = {
    'BY': 'Беларусь', 'RU': 'Россия', 'CZ': 'Чехия', 'DE': 'Германия',
    'FR': 'Франция', 'PL': 'Польша', 'UA': 'Украина', 'LV': 'Латвия',
    'JP': 'Япония', 'CN': 'Китай', 'AE': 'ОАЭ',
    'MA': 'Марокко', 'EG': 'Египет', 'ZA': 'ЮАР',
    'CA': 'Канада', 'US': 'США', 'MX': 'Мексика',
    'BR': 'Бразилия', 'AR': 'Аргентина',
    'AU': 'Австралия', 'NZ': 'Новая Зеландия'
};

// Инициализация карты
function initWorldMap(containerId, systemsData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Группируем системы по странам
    const countriesWithTrams = {};
    systemsData.forEach(system => {
        const code = system.countryCode;
        if (!countriesWithTrams[code]) {
            countriesWithTrams[code] = {
                name: system.country,
                continent: system.continent,
                systems: []
            };
        }
        countriesWithTrams[code].systems.push(system);
    });
    
    // Создаём HTML карты
    container.innerHTML = `
        <div class="map-wrapper">
            <div class="map-grid">
                ${createMapGrid(countriesWithTrams)}
            </div>
            <div class="country-info-panel" id="countryInfo">
                <p class="hint">👆 Выберите страну из списка</p>
            </div>
        </div>
        <div class="country-systems" id="countrySystems"></div>
    `;
    
    // Добавляем обработчики
    setupEventHandlers(container, countriesWithTrams);
}

// Создаём сетку стран по континентам
function createMapGrid(countriesWithTrams) {
    const continentNames = {
        'europe': '🌍 Европа',
        'asia': '🌏 Азия',
        'africa': '🌍 Африка',
        'north_america': '🌎 Северная Америка',
        'south_america': '🌎 Южная Америка',
        'australia': '🌏 Австралия и Океания'
    };
    
    // Группируем по континентам
    const byContinent = {};
    Object.entries(countriesWithTrams).forEach(([code, data]) => {
        const cont = data.continent;
        if (!byContinent[cont]) {
            byContinent[cont] = [];
        }
        byContinent[cont].push({ code, ...data });
    });
    
    let html = '';
    
    Object.entries(continentNames).forEach(([contCode, contName]) => {
        const countries = byContinent[contCode] || [];
        if (countries.length === 0) return;
        
        const color = continentColors[contCode];
        
        html += `
            <div class="continent-block">
                <h4 style="border-left: 4px solid ${color}; padding-left: 10px;">${contName}</h4>
                <div class="countries-list">
                    ${countries.map(c => `
                        <button class="country-btn" 
                                data-country="${c.code}" 
                                data-name="${c.name}"
                                data-count="${c.systems.length}"
                                style="--accent-color: ${color}">
                            <span class="country-name">${c.name}</span>
                            <span class="country-count">${c.systems.length}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    return html;
}

// Настройка обработчиков событий
function setupEventHandlers(container, countriesWithTrams) {
    const countryInfo = container.querySelector('#countryInfo');
    const countrySystems = container.querySelector('#countrySystems');
    const buttons = container.querySelectorAll('.country-btn');
    
    buttons.forEach(btn => {
        const code = btn.dataset.country;
        const name = btn.dataset.name;
        const data = countriesWithTrams[code];
        
        // Наведение
        btn.addEventListener('mouseenter', () => {
            const count = data.systems.length;
            const cities = data.systems.map(s => s.city).join(', ');
            
            countryInfo.innerHTML = `
                <h4>${name}</h4>
                <p><strong>🚋 Систем:</strong> ${count}</p>
                <p><strong>🏙️ Города:</strong> ${cities}</p>
                <p class="click-hint">Кликните для подробностей →</p>
            `;
        });
        
        // Уход курсора
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                countryInfo.innerHTML = `<p class="hint">👆 Выберите страну из списка</p>`;
            }
        });
        
        // Клик
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Показываем системы
            showCountrySystems(data.systems, name, countrySystems);
            
            // Обновляем инфо-панель
            const count = data.systems.length;
            const cities = data.systems.map(s => s.city).join(', ');
            countryInfo.innerHTML = `
                <h4>${name}</h4>
                <p><strong>🚋 Систем:</strong> ${count}</p>
                <p><strong>🏙️ Города:</strong> ${cities}</p>
            `;
            
            // Прокручиваем к списку
            countrySystems.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Показ систем выбранной страны
function showCountrySystems(systems, countryName, container) {
    container.innerHTML = `
        <h3>🚋 Трамвайные системы: ${countryName}</h3>
        <div class="systems-mini-grid">
            ${systems.map(system => `
                <a href="system.html?id=${system.id}" class="system-mini-card">
                    <h4>${system.city}</h4>
                    <div class="mini-stats">
                        <span>📅 ${system.yearOpened}</span>
                        <span>📏 ${system.networkLength} км</span>
                        <span>🚊 ${system.routes} маршр.</span>
                    </div>
                    <p class="mini-desc">${system.description.substring(0, 80)}...</p>
                </a>
            `).join('')}
        </div>
    `;
}
