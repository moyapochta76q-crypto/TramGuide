// Получаем ID вагона из URL
const urlParams = new URLSearchParams(window.location.search);
const tramId = urlParams.get('id');

if (!tramId) {
    window.location.href = 'trams.html';
}

// Загружаем данные
fetch('trams-data.json')
    .then(response => response.json())
    .then(data => {
        const tram = data.find(t => t.id === tramId);
        if (tram) {
            displayTram(tram);
        } else {
            document.getElementById('detailContent').innerHTML = `
                <div class="error-message">
                    <h3>Вагон не найден</h3>
                    <p>Запрошенная модель вагона не существует.</p>
                    <a href="trams.html" class="btn">Вернуться к списку</a>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('detailContent').innerHTML = '<p>Ошибка загрузки данных</p>';
    });

function displayTram(tram) {
    // Обновляем заголовок страницы
    document.title = `${tram.model} — TramGuide`;
    document.getElementById('modelName').textContent = tram.model;
    document.getElementById('manufacturerName').textContent = `🏭 ${tram.manufacturerFull}`;
    
    // Формируем список городов
    let citiesHTML = '';
    if (tram.cities && tram.cities.length > 0) {
        const citiesByCountry = {};
        tram.cities.forEach(c => {
            if (!citiesByCountry[c.country]) {
                citiesByCountry[c.country] = [];
            }
            citiesByCountry[c.country].push(c.city);
        });
        
        citiesHTML = `
            <div class="cities-section">
                <h3>🌍 Где эксплуатируется</h3>
                <div class="cities-list">
                    ${Object.entries(citiesByCountry).map(([country, cities]) => `
                        <div class="country-cities">
                            <strong>${country}:</strong> ${cities.join(', ')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Формируем галерею
    let galleryHTML = '';
    if (tram.images && tram.images.length > 0) {
        galleryHTML = `
            <div class="gallery">
                <h3>📸 Фотогалерея</h3>
                <div class="gallery-grid">
                    ${tram.images.map(img => `
                        <img src="${img}" alt="${tram.model}" class="gallery-image" onclick="openImage('${img}')" onerror="this.style.display='none'">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Формируем видео
    let videosHTML = '';
    if (tram.videos && tram.videos.length > 0) {
        videosHTML = `
            <div class="videos">
                <h3>🎬 Видео</h3>
                <div class="videos-grid">
                    ${tram.videos.map(video => `
                        <iframe src="${video}" frameborder="0" allowfullscreen></iframe>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Формируем факты
    let factsHTML = '';
    if (tram.facts && tram.facts.length > 0) {
        factsHTML = `
            <div class="facts-section">
                <h3>💡 Интересные факты</h3>
                <ul class="facts-list">
                    ${tram.facts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Основной контент
    document.getElementById('detailContent').innerHTML = `
        <div class="detail-main">
            <div class="detail-image-container">
                <img src="${tram.image}" alt="${tram.model}" class="detail-main-image" onerror="this.src='https://via.placeholder.com/800x400/9b59b6/ffffff?text=${tram.model}'">
            </div>
            
            <div class="detail-info">
                <div class="info-grid">
                    <div class="info-card">
                        <span class="info-label">Производитель</span>
                        <span class="info-value">${tram.manufacturer}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Страна</span>
                        <span class="info-value">${tram.countryOfOrigin}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Годы выпуска</span>
                        <span class="info-value">${tram.yearStart}${tram.yearEnd ? ' - ' + tram.yearEnd : ' - н.в.'}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-label">Тип</span>
                        <span class="info-value">${tram.typeName}</span>
                    </div>
                </div>
                
                <div class="specs-section">
                    <h3>📋 Технические характеристики</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Длина</span>
                            <span class="spec-value">${tram.length} м</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Ширина</span>
                            <span class="spec-value">${tram.width} м</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Вместимость</span>
                            <span class="spec-value">${tram.capacity} чел.</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Мест для сидения</span>
                            <span class="spec-value">${tram.seats}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Макс. скорость</span>
                            <span class="spec-value">${tram.maxSpeed} км/ч</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Мощность</span>
                            <span class="spec-value">${tram.power} кВт</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">
                <h3>Описание</h3>
                <div class="description-text">
                    ${tram.fullDescription ? tram.fullDescription.split('\n').map(p => `<p>${p}</p>`).join('') : `<p>${tram.description}</p>`}
                </div>
            </div>
            
            ${factsHTML}
            ${citiesHTML}
            ${galleryHTML}
            ${videosHTML}
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
