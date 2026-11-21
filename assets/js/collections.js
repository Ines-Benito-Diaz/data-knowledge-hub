const category = document.body.dataset.collection;
const grid = document.querySelector('#collection-grid');
const filters = document.querySelector('#collection-filters');
let items = [];
let selectedTag = 'All';

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function render() {
  const shown = selectedTag === 'All' ? items : items.filter(item => item.tags.includes(selectedTag));
  grid.innerHTML = shown.length ? shown.map(item => `<a class="library-card ${category}-library-card" href="${safeText(item.path)}">
    <div class="library-card-top"><span class="library-card-icon">${safeText(item.icon)}</span><span class="difficulty">${safeText(item.difficulty)}</span></div>
    <div class="library-card-type">${safeText(category === 'tools' ? item.tool : 'PROJECT GUIDE')}</div>
    <h3>${safeText(item.title)}</h3><p>${safeText(item.summary)}</p>
    <div class="library-card-tags">${item.tags.map(tag => `<span>${safeText(tag)}</span>`).join('')}</div>
    <div class="library-card-bottom"><span>UPDATED ${safeText(item.updated)}</span><span class="library-card-action">Open guide <b>↗</b></span></div>
  </a>`).join('') : '<div class="collection-empty">No guides match this filter yet.</div>';
}

async function init() {
  const response = await fetch('assets/data/documents.json');
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const catalog = await response.json();
  items = catalog.filter(item => item.category === category);
  const tags = ['All', ...new Set(items.flatMap(item => item.tags))];
  filters.innerHTML = tags.map(tag => `<button class="filter-chip${tag === 'All' ? ' selected' : ''}" type="button" data-tag="${safeText(tag)}">${safeText(tag)}</button>`).join('');
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-tag]');
    if (!button) return;
    selectedTag = button.dataset.tag;
    filters.querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button));
    render();
  });
  render();
}

init().catch(error => {
  console.error(error);
  grid.innerHTML = '<div class="collection-empty">The library could not load. Preview it through a local web server.</div>';
});
