document.addEventListener('DOMContentLoaded', () => {
    let allModels = [];

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const cycleFilter = document.getElementById('cycleFilter');
    const modelsGrid = document.getElementById('modelsGrid');
    const resultsCount = document.getElementById('resultsCount');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allModels = data.modelli;
            populateCategories(data.categorie);
            renderModels(allModels);
        })
        .catch(err => console.error('Errore nel caricamento dati:', err));

    function populateCategories(categories) {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    function renderModels(models) {
        modelsGrid.innerHTML = '';
        resultsCount.textContent = `Trovati ${models.length} modelli`;

        models.forEach(m => {
            const card = document.createElement('article');
            card.className = 'model-card';

            const cycleClass = m.ciclo === '2 Tempi' ? 'badge-2t' : (m.ciclo === '4 Tempi' ? 'badge-4t' : 'badge-ele');

            const imgHTML = m.immagine 
                ? `<img src="${m.immagine}" alt="${m.nome}" loading="lazy">`
                : `<div class="placeholder-img">📷 Immagine non disponibile</div>`;

            card.innerHTML = `
                <div class="card-img-wrapper">${imgHTML}</div>
                <div class="card-body">
                    <span class="category-tag">${m.categoria}</span>
                    <h2 class="model-title">${m.nome}</h2>
                    <div class="specs-list">
                        <div class="spec-item"><span class="spec-label">Anni:</span> <strong>${m.anni}</strong></div>
                        <div class="spec-item"><span class="spec-label">Cilindrata:</span> <strong>${m.cilindrata}</strong></div>
                        <div class="spec-item"><span class="spec-label">Ciclo:</span> <span class="badge-cycle ${cycleClass}">${m.ciclo}</span></div>
                    </div>
                </div>
            `;
            modelsGrid.appendChild(card);
        });
    }

    function filterData() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCat = categoryFilter.value;
        const selectedCycle = cycleFilter.value;

        const filtered = allModels.filter(m => {
            const matchesSearch = m.nome.toLowerCase().includes(query) || m.anni.includes(query);
            const matchesCat = selectedCat === 'ALL' || m.categoria === selectedCat;
            const matchesCycle = selectedCycle === 'ALL' || m.ciclo === selectedCycle;
            return matchesSearch && matchesCat && matchesCycle;
        });

        renderModels(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);
    cycleFilter.addEventListener('change', filterData);
});