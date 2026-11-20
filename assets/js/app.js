const categoryNames = { tools: 'Tool', projects: 'Project', knowledge: 'Knowledge', cheatsheets: 'Cheat sheet' };
const categoryIcons = { tools: '◈', projects: '▧', knowledge: '✳', cheatsheets: '⌘' };
const list = document.querySelector('#document-list');
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
  document.querySelector('#all-filter-count').textContent = documents.length;
  document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('selected', button.dataset.filter === category));
  const clearFilter = document.querySelector('#clear-filter');
  clearFilter.textContent = category === 'all' ? 'View all  →' : `Showing ${categoryNames[category] || category}  ×`;
}

function renderQuickAccess() {
  const quick = documents.filter(doc => doc.quickAccess).slice(0, 4);
  document.querySelector('#quick-list').innerHTML = quick.map(doc => `<a class="quick-item" href="${escapeHtml(doc.path)}"><span class="quick-icon">${escapeHtml(doc.icon || '▤')}</span><span><strong>${escapeHtml(doc.title)}</strong><small>${escapeHtml(categoryNames[doc.category] || 'Document')} · ${escapeHtml(doc.tool || '')}</small></span><span class="quick-arrow">↗</span></a>`).join('');
}

async function init() {
  const response = await fetch('assets/data/documents.json');
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  documents = await response.json();
  const toolCount = documents.filter(doc => doc.category === 'tools').length;
  const projectCount = documents.filter(doc => doc.category === 'projects').length;
  document.querySelector('#tools-card-count').textContent = `${String(toolCount).padStart(2, '0')} GUIDES`;
  document.querySelector('#projects-card-count').textContent = `${String(projectCount).padStart(2, '0')} NOTES`;
  renderQuickAccess();
  updateFilter('all');
  document.querySelector('#today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase();
}

document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => updateFilter(button.dataset.filter)));
document.querySelector('#clear-filter').addEventListener('click', event => { event.preventDefault(); updateFilter('all'); });
init().catch(error => {
  console.error(error);
  list.innerHTML = '<div class="empty-list">The library catalog could not load. Preview this site through a local web server.</div>';
});
