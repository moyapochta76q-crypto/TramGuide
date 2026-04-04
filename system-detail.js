// Получаем ID системы из URL
const urlParams = new URLSearchParams(window.location.search);
const systemId = urlParams.get('id');

if (!systemId) {
    window.location.href = 'systems.html';
}

// Загружаем данные
fetch('systems-data.json')
    .then(response => response.json())
    .then(data => {
        const system = data.find(s => s.id === systemId);
        if (system) {
            displaySystem(system);
        } else {
            document.getElementById('detailContent').innerHTML = `
                <div class="error-message">
                    <h3>Система не найдена</h3>
                    <p>Запрошенная трамвайная система не существует.</p>
                    <a href="systems.html" class="btn">Вернуться к списку</a>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('detailContent').innerHTML = '<p>Ошибка загрузки данных</p>';
    });

function displaySystem(system) {
    // Обновляем заголовок страницы
    document.title = `${system.city}, ${system.country} — TramGuide`;
    document.getElementById('cityName').textContent = system.city;
    document.getElementById('countryName').textContent = `🌍 ${system.country}, ${system.continentName}`;
    
    // Формируем галерею
    let galleryHTML = '';
    if (system.images && system.images.length > 0) {
        galleryHTML = `
            <div class="gallery">
                <h3>📸 Фотогалерея</h3>
                <div class="gallery-grid">
                    ${system.images.map(img => `
                        <img src="${img}" alt="${system.city}" class="gallery-image" onclick="openImage('${img}')" onerror="this.style.display='none'">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Формируем видео
    let videosHTML = '';
    if (system.videos && system.videos.length > 0) {
        videosHTML = `
            <div class="videos">
                <h3>🎬 Видео</h3>
                <div class="videos-grid">
                    ${system.videos.map(video => `
                        <iframe src="${video}" frameborder="0" allowfullscreen></iframe>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Формируем факты
    let factsHTML = '';
    if (system.facts && system.facts.length > 0) {
        factsHTML = `
            <div class="facts-section">
                <h3>💡 Интересные факты</h3>
                <ul class="facts-list">
                    ${system.facts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Основной контент
    document.getElementById('detailContent').innerHTML = `
        <div class="detail-main">
            <div class="detail-image-container">
                <img src="${system.image}" alt="${system.city}" class="detail-main-image" onerror="this.src='https://via.placeholder.com/800x400/3498db/ffffff?text=${system.city}'">
            </div>
            
            <div class="detail-info">
                <div class="info-grid">
                    <div class="info-card">
                        <span class="info-label">Год открытия</span>
                        <span class="info-value">${system.yearOpened}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Длина сети</span>
                        <span class="info-value">${system.networkLength} км</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Маршрутов</span>
                        <span class="info-value">${system.routes}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Континент</span>
                        <span class="info-value">${system.continentName}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">
                <h3>О системе</h3>
                <div class="description-text">
                    ${system.fullDescription ? system.fullDescription.split('\n').map(p => `<p>${p}</p>`).join('') : `<p>${system.description}</p>`}
                </div>
            </div>
            
            ${factsHTML}
            ${galleryHTML}
            ${videosHTML}
            
            ${system.website ? `
                <div class="external-link">
                    <a href="${system.website}" target="_blank" class="btn">🔗 Официальный сайт</a>
                </div>
            ` : ''}
        </div>
    `;
}

// Открытие изображения в полный размер
function openImage(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="this.parentElement.remove()">
            <img src="${src}" alt="Фото">
            <span class="modal-close">&times;</span>
        </div>
    `;
    document.body.appendChild(modal);
}
