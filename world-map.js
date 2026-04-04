// SVG карта мира с интерактивными странами
const worldMapSVG = `
<svg viewBox="0 0 1000 500" class="world-map-svg">
  <!-- Фон -->
  <rect fill="#f0f8ff" width="1000" height="500"/>
  
  <!-- Европа -->
  <g class="continent" data-continent="europe">
    <path class="country" data-country="BY" data-name="Беларусь" d="M545,bindingSet120 l10,5 5,10 -5,10 -15,5 -10,-10 5,-15z" fill="#e8e8e8"/>
    <path class="country" data-country="RU" data-name="Россия" d="M550,80 l50,10 60,20 40,30 -10,40 -30,20 -50,10 -40,-20 -20,-40 10,-50z M600,110 l200,20 100,50 50,80 -150,30 -100,-50 -80,-80z" fill="#e8e8e8"/>
    <path class="country" data-country="CZ" data-name="Чехия" d="M510,145 l15,3 10,10 -5,12 -20,2 -10,-12z" fill="#e8e8e8"/>
    <path class="country" data-country="DE" data-name="Германия" d="M485,125 l20,5 15,20 -5,25 -25,5 -15,-20 5,-30z" fill="#e8e8e8"/>
    <path class="country" data-country="FR" data-name="Франция" d="M450,150 l25,5 10,30 -15,25 -35,-5 -5,-35z" fill="#e8e8e8"/>
    <path class="country" data-country="PL" data-name="Польша" d="M520,120 l25,5 10,20 -10,20 -30,5 -10,-25z" fill="#e8e8e8"/>
    <path class="country" data-country="UA" data-name="Украина" d="M555,140 l40,10 20,25 -25,20 -45,-10 -10,-30z" fill="#e8e8e8"/>
    <path class="country" data-country="LV" data-name="Латвия" d="M540,100 l15,3 5,10 -10,8 -15,-5z" fill="#e8e8e8"/>
  </g>
  
  <!-- Азия -->
  <g class="continent" data-continent="asia">
    <path class="country" data-country="JP" data-name="Япония" d="M880,160 l15,30 5,40 -15,20 -15,-30 -5,-45z" fill="#e8e8e8"/>
    <path class="country" data-country="CN" data-name="Китай" d="M750,180 l60,20 30,50 -20,60 -80,10 -40,-50 20,-70z" fill="#e8e8e8"/>
    <path class="country" data-country="AE" data-name="ОАЭ" d="M620,250 l15,5 5,15 -15,5 -10,-15z" fill="#e8e8e8"/>
  </g>
  
  <!-- Африка -->
  <g class="continent" data-continent="africa">
    <path class="country" data-country="MA" data-name="Марокко" d="M430,230 l25,10 5,25 -20,15 -20,-20z" fill="#e8e8e8"/>
    <path class="country" data-country="EG" data-name="Египет" d="M560,230 l30,10 10,40 -25,20 -25,-30z" fill="#e8e8e8"/>
    <path class="country" data-country="ZA" data-name="ЮАР" d="M540,400 l30,10 15,30 -30,15 -30,-25z" fill="#e8e8e8"/>
  </g>
  
  <!-- Северная Америка -->
  <g class="continent" data-continent="north_america">
    <path class="country" data-country="CA" data-name="Канада" d="M150,80 l100,10 80,30 -20,50 -120,20 -60,-50z" fill="#e8e8e8"/>
    <path class="country" data-country="US" data-name="США" d="M120,160 l120,10 60,40 -30,50 -130,10 -40,-60z" fill="#e8e8e8"/>
    <path class="country" data-country="MX" data-name="Мексика" d="M130,260 l50,20 20,40 -40,20 -40,-40z" fill="#e8e8e8"/>
  </g>
  
  <!-- Южная Америка -->
  <g class="continent" data-continent="south_america">
    <path class="country" data-country="BR" data-name="Бразилия" d="M280,320 l60,30 30,70 -50,40 -60,-50 -10,-60z" fill="#e8e8e8"/>
    <path class="country" data-country="AR" data-name="Аргентина" d="M260,420 l30,20 10,50 -25,20 -25,-50z" fill="#e8e8e8"/>
  </g>
  
  <!-- Австралия -->
  <g class="continent" data-continent="australia">
    <path class="country" data-country="AU" data-name="Австралия" d="M800,350 l80,20 40,50 -30,40 -90,10 -30,-60z" fill="#e8e8e8"/>
    <path class="country" data-country="NZ" data-name="Новая Зеландия" d="M920,420 l15,20 -5,25 -15,-15z" fill="#e8e8e8"/>
  </g>
</svg>
`;

// Цвета континентов
const continentColors = {
    'europe': '#3498db',
    'asia': '#e74c3c',
    'africa': '#f39c12',
    'north_america': '#2ecc71',
    'south_america': '#9b59b6',
    'australia': '#1abc9c'
};

// Инициализация интерактивной карты
function initWorldMap(containerId, systemsData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Создаём контейнер для карты и информации
    container.innerHTML = `
        <div class="map-wrapper">
            <div class="svg-map-container">
                ${worldMapSVG}
            </div>
            <div class="country-info" id="countryInfo">
                <p class="hint">👆 Наведите на страну для просмотра информации</p>
            </div>
        </div>
        <div class="country-systems" id="countrySystems"></div>
    `;
    
    // Получаем страны с трамваями
    const countriesWithTrams = {};
    systemsData.forEach(system => {
        if (!countriesWithTrams[system.countryCode]) {
            countriesWithTrams[system.countryCode] = {
                name: system.country,
                continent: system.continent,
                systems: []
            };
        }
        countriesWithTrams[system.countryCode].systems.push(system);
    });
    
    // Подсвечиваем страны с трамваями
    Object.keys(countriesWithTrams).forEach(code => {
        const countryEl = container.querySelector(`[data-country="${code}"]`);
        if (countryEl) {
            const continent = countriesWithTrams[code].continent;
            countryEl.setAttribute('fill', continentColors[continent] || '#3498db');
            countryEl.classList.add('has-trams');
        }
    });
    
    // Обработчики событий для стран
    const countries = container.querySelectorAll('.country');
    const countryInfo = document.getElementById('countryInfo');
    const countrySystems = document.getElementById('countrySystems');
    
    countries.forEach(country => {
        const code = country.getAttribute('data-country');
        const name = country.getAttribute('data-name');
        const hasTrams = countriesWithTrams[code];
        
        // Наведение
        country.addEventListener('mouseenter', () => {
            if (hasTrams) {
                const count = hasTrams.systems.length;
                countryInfo.innerHTML = `
                    <h4>${name}</h4>
                    <p>🚋 Трамвайных систем: <strong>${count}</strong></p>
                    <p class="click-hint">Кликните для просмотра</p>
                `;
            } else {
                countryInfo.innerHTML = `
                    <h4>${name}</h4>
                    <p style="color: #999;">Нет данных о трамвайных системах</p>
                `;
            }
        });
        
        // Уход курсора
        country.addEventListener('mouseleave', () => {
            countryInfo.innerHTML = `<p class="hint">👆 Наведите на страну для просмотра информации</p>`;
        });
        
        // Клик
        country.addEventListener('click', () => {
            if (hasTrams) {
                showCountrySystems(hasTrams.systems, name, countrySystems);
                // Прокручиваем к списку
                countrySystems.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Показ систем страны
function showCountrySystems(systems, countryName, container) {
    container.innerHTML = `
        <h3>🚋 Трамвайные системы: ${countryName}</h3>
        <div class="systems-mini-grid">
            ${systems.map(system => `
                <a href="system.html?id=${system.id}" class="system-mini-card">
                    <div class="mini-card-content">
                        <h4>${system.city}</h4>
                        <p>📅 ${system.yearOpened} г.</p>
                        <p>📏 ${system.networkLength} км</p>
                        <p>🚊 ${system.routes} маршрутов</p>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
}
