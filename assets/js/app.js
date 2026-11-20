const categoryNames = { tools: 'Tool', projects: 'Project', knowledge: 'Knowledge', cheatsheets: 'Cheat sheet' };
const categoryIcons = { tools: '◈', projects: '▧', knowledge: '✳', cheatsheets: '⌘' };
const list = document.querySelector('#document-list');
const search = document.querySelector('#global-search');
const results = document.querySelector('#search-results');
let documents = [];
let activeFilter = 'all';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
}

function renderDocuments(items) {
  if (!items.length) {
    list.innerHTML = '<div class="empty-list">Nothing here yet. Add a document to the library catalog to get started.</div>';
    return;
  }
  list.innerHTML = items.map(doc => `<a class="document-row" href="${escapeHtml(doc.path)}">
    <span class="doc-icon">${escapeHtml(categoryIcons[doc.category] || '▤')}</span>
    <span class="doc-main"><span class="document-title">${escapeHtml(doc.title)}</span><span class="doc-meta"><span class="doc-type">${escapeHtml(categoryNames[doc.category] || 'Document')}</span><span>·</span><span class="doc-tag">${escapeHtml((doc.tags || [])[0] || doc.tool || '')}</span></span></span>
    <span class="doc-date">${escapeHtml(formatDate(doc.updated))}</span>
  </a>`).join('');
}

function updateFilter(category = activeFilter) {
  activeFilter = category;
  const matches = [...documents].filter(doc => category === 'all' || doc.category === category)
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title));
  renderDocuments(matches);
  document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('selected', button.dataset.filter === category));
  const clearFilter = document.querySelector('#clear-filter');
  clearFilter.textContent = category === 'all' ? 'View all  →' : `Showing ${categoryNames[category] || category}  ×`;
}

function updateStats() {
  const tools = documents.filter(doc => doc.category === 'tools').length;
  const projects = documents.filter(doc => doc.category === 'projects').length;
  const areas = new Set(documents.map(doc => doc.tool).filter(Boolean)).size;
  document.querySelector('#stat-documents').textContent = String(documents.length).padStart(2, '0');
  document.querySelector('#stat-tools').textContent = String(tools).padStart(2, '0');
  document.querySelector('#stat-projects').textContent = String(projects).padStart(2, '0');
  document.querySelector('#stat-areas').textContent = String(areas).padStart(2, '0');
  document.querySelector('#tool-nav-count').textContent = String(tools).padStart(2, '0');
  document.querySelector('#project-nav-count').textContent = String(projects).padStart(2, '0');
  document.querySelector('#tools-card-count').textContent = `${String(tools).padStart(2, '0')} GUIDES`;
  document.querySelector('#projects-card-count').textContent = `${String(projects).padStart(2, '0')} NOTES`;
  document.querySelector('#all-filter-count').textContent = documents.length;
}

function renderQuickAccess() {
  const quick = documents.filter(doc => doc.quickAccess).slice(0, 4);
  document.querySelector('#quick-list').innerHTML = quick.map(doc => `<a class="quick-item" href="${escapeHtml(doc.path)}"><span class="quick-icon">${escapeHtml(doc.icon || '▤')}</span><span><strong>${escapeHtml(doc.title)}</strong><small>${escapeHtml(categoryNames[doc.category] || 'Document')} · ${escapeHtml(doc.tool || '')}</small></span><span class="quick-arrow">↗</span></a>`).join('');
}

function showSearchMatches(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) { results.hidden = true; results.innerHTML = ''; return; }
  const found = documents.filter(doc => [doc.title, doc.summary, doc.tool, doc.category, ...(doc.tags || [])].join(' ').toLowerCase().includes(normalized)).slice(0, 7);
  results.innerHTML = found.length ? found.map(doc => `<a class="search-result" role="option" href="${escapeHtml(doc.path)}"><span class="result-icon">${escapeHtml(categoryIcons[doc.category] || '▤')}</span><span><strong>${escapeHtml(doc.title)}</strong><small>${escapeHtml(categoryNames[doc.category] || 'Document')} · ${escapeHtml(doc.tool || '')}</small></span></a>`).join('') : '<div class="empty-results">No matches. Try a tool, topic or tag.</div>';
  results.hidden = false;
}

async function init() {
  const response = await fetch('assets/data/documents.json');
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  documents = await response.json();
  updateStats();
  renderQuickAccess();
  updateFilter('all');
  document.querySelector('#today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase();
}

document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => updateFilter(button.dataset.filter)));
document.querySelector('#clear-filter').addEventListener('click', event => { event.preventDefault(); updateFilter('all'); });
search.addEventListener('input', () => showSearchMatches(search.value));
document.addEventListener('click', event => { if (!event.target.closest('.search-panel')) results.hidden = true; });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); }
  if (event.key === 'Escape') { results.hidden = true; search.blur(); }
});
document.querySelectorAll('.feature-card').forEach(card => card.addEventListener('click', () => {
  const category = card.dataset.category;
  updateFilter(category);
}));
document.querySelectorAll('.side-nav a[href="#tools"], .side-nav a[href="#projects"], .side-nav a[href="#knowledge"], .side-nav a[href="#cheatsheets"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  updateFilter(link.hash.slice(1));
  document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

init().catch(error => {
  console.error(error);
  list.innerHTML = '<div class="empty-list">The library catalog could not load. Preview this site through a local web server.</div>';
});
