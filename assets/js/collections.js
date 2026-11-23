const category = document.body.dataset.collection;
const grid = document.querySelector('#collection-grid');
const filters = document.querySelector('#collection-filters');
let items = [];
const selectedTags = new Set();
let filterTitle = '';

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function render() {
  const shown = selectedTags.size ? items.filter(item => item.tags.some(tag => selectedTags.has(tag))) : items;
  grid.innerHTML = shown.length ? shown.map(item => `<a class="library-card ${category}-library-card" href="${safeText(item.path)}">
    <div class="library-card-top"><span class="library-card-icon">${safeText(item.icon)}</span><span class="difficulty">${safeText(item.difficulty)}</span></div>
    <div class="library-card-type">${safeText(category === 'tools' ? item.tool : 'PROJECT GUIDE')}</div>
    <h3>${safeText(item.title)}</h3><p>${safeText(item.summary)}</p>
    <div class="library-card-tags">${item.tags.map(tag => `<span>${safeText(tag)}</span>`).join('')}</div>
    <div class="library-card-bottom"><span>UPDATED ${safeText(item.updated)}</span><span class="library-card-action">Open guide <b>↗</b></span></div>
  </a>`).join('') : '<div class="collection-empty">No guides match this filter yet.</div>';
}

function updateFilterState() {
  const allButton = filters.querySelector('[data-reset-filters]');
  const toggle = filters.querySelector('.filter-dropdown-toggle');
  const hasSelection = selectedTags.size > 0;
  allButton.classList.toggle('selected', !hasSelection);
  allButton.setAttribute('aria-pressed', String(!hasSelection));
  toggle.querySelector('span').textContent = hasSelection ? `${filterTitle} (${selectedTags.size})` : filterTitle;
}

function closeFilterMenu() {
  const toggle = filters.querySelector('.filter-dropdown-toggle');
  const menu = filters.querySelector('.filter-dropdown-menu');
  if (!toggle || !menu || menu.hidden) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
}

async function init() {
  const response = await fetch('assets/data/documents.json');
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const catalog = await response.json();
  items = catalog.filter(item => item.category === category);
  const tags = ['All', ...new Set(items.flatMap(item => item.tags))];
  filterTitle = category === 'projects' ? 'Project type' : 'Tool type';
  filters.innerHTML = `<button class="filter-chip selected" type="button" data-reset-filters aria-pressed="true">All</button>
    <div class="filter-dropdown">
      <button class="filter-dropdown-toggle" type="button" aria-expanded="false" aria-controls="collection-filter-options"><span>${safeText(filterTitle)}</span><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 7 5 5 5-5"/></svg></button>
      <div class="filter-dropdown-menu" id="collection-filter-options" role="group" aria-label="Filter by ${safeText(filterTitle.toLowerCase())}" hidden>
        ${tags.slice(1).map(tag => `<label class="filter-option"><input type="checkbox" value="${safeText(tag)}"><span>${safeText(tag)}</span></label>`).join('')}
      </div>
    </div>`;

  filters.querySelector('[data-reset-filters]').addEventListener('click', () => {
    selectedTags.clear();
    filters.querySelectorAll('.filter-option input').forEach(input => { input.checked = false; });
    closeFilterMenu();
    updateFilterState();
    render();
  });
  const toggle = filters.querySelector('.filter-dropdown-toggle');
  const menu = filters.querySelector('.filter-dropdown-menu');
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
  });
  menu.addEventListener('change', event => {
    const input = event.target.closest('input[type="checkbox"]');
    if (!input) return;
    if (input.checked) selectedTags.add(input.value);
    else selectedTags.delete(input.value);
    updateFilterState();
    render();
  });
  filters.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeFilterMenu();
    toggle.focus();
  });
  document.addEventListener('pointerdown', event => {
    if (!filters.contains(event.target)) closeFilterMenu();
  });
  render();
}

init().catch(error => {
  console.error(error);
  grid.innerHTML = '<div class="collection-empty">The library could not load. Preview it through a local web server.</div>';
});
