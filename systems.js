// Загрузка данных о системах
let systemsData = [];

fetch('systems-data.json')
    .then(response => response.json())
    .then(data => {
        systemsData = data;
        displaySystems(systemsData);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Функция отображения систем
function displaySystems(systems) {
    const grid = document.getElementById('systemsGrid');
    
    if (systems.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Системы не найдены</p>';
        return;
    }
    
    grid.innerHTML = systems.map(system => `
        <div class="system-card">
            <img src="${system.image}" alt="${system.city}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200/3498db/ffffff?text=${system.city}'">
            <div class="card-content">
                <h3>${system.city}</h3>
                <p class="country">🌍 ${system.country}</p>
                <p><strong>Год открытия:</strong> ${system.yearOpened}</p>
                <p><strong>Длина сети:</strong> ${system.networkLength} км</p>
                <p><strong>Маршрутов:</strong> ${system.routes}</p>
                <p style="margin-top: 1rem;">${system.description}</p>
                ${system.facts ? `<p style="margin-top: 1rem; padding: 0.5rem; background: #f0f8ff; border-left: 3px solid #3498db; font-size: 0.9rem;"><strong>💡 Факт:</strong> ${system.facts}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Поиск
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = systemsData.filter(system => 
        system.city.toLowerCase().includes(searchTerm) ||
        system.country.toLowerCase().includes(searchTerm)
    );
    displaySystems(filtered);
});
