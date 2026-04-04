// Цвета маркеров по континентам
const continentColors = {
    'europe': '#3498db',
    'asia': '#e74c3c',
    'africa': '#f39c12',
    'north_america': '#2ecc71',
    'south_america': '#9b59b6',
    'australia': '#1abc9c'
};

// Инициализация карты
const map = L.map('map').setView([30, 0], 2);

// Добавляем базовый слой карты
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
}).addTo(map);

// Функция создания кастомного маркера
function createCustomMarker(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// Загрузка данных и добавление маркеров
fetch('systems-data.json')
    .then(response => response.json())
    .then(systems => {
        systems.forEach(system => {
            if (system.coordinates) {
                const color = continentColors[system.continent] || '#95a5a6';
                const marker = L.marker(
                    [system.coordinates.lat, system.coordinates.lng],
                    { icon: createCustomMarker(color) }
                ).addTo(map);
                
                // Popup с информацией
                const popupContent = `
                    <div class="popup-content">
                        <h3>${system.city}</h3>
                        <p><strong>🌍 Страна:</strong> ${system.country}</p>
                        <p><strong>📅 Год открытия:</strong> ${system.yearOpened}</p>
                        <p><strong>📏 Длина сети:</strong> ${system.networkLength} км</p>
                        <p><strong>🚊 Маршрутов:</strong> ${system.routes}</p>
                        <a href="system.html?id=${system.id}" class="popup-link">Подробнее →</a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // При клике центрируем карту
                marker.on('click', function() {
                    map.setView([system.coordinates.lat, system.coordinates.lng], 10);
                });
            }
        });
        
        // Добавляем счётчик систем
        const systemCount = systems.filter(s => s.coordinates).length;
        const infoDiv = document.querySelector('.map-info p');
        infoDiv.innerHTML = `<strong>💡 На карте отмечено ${systemCount} трамвайных систем.</strong> Кликните на маркер для подробной информации`;
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Адаптивность карты
map.invalidateSize();
window.addEventListener('resize', () => {
    map.invalidateSize();
});
