const targets = [...document.querySelectorAll('[data-guide-source]')];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const resolved = new URL(href, new URL('docs/tools/', window.location.href)).href;
    return `<a href="${escapeHtml(resolved)}">${label}</a>`;
  });
  return html;
}

function slugifyHeading(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'topic';
}

let flowchartSequence = 0;

function renderFlowchart(source, prefix) {
  const lines = source.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!/^flowchart\s+LR$/i.test(lines[0] || '')) return null;

  const nodes = new Map();
  const edges = [];
  const ensureNode = (id, label, shape) => {
    if (!nodes.has(id)) nodes.set(id, { id, label: label || id, shape: shape || 'box' });
    else if (label) nodes.get(id).label = label;
    if (shape) nodes.get(id).shape = shape;
  };

  const nodePattern = '(\\w+)(?:\\[([^\\]]+)\\]|\\{([^}]+)\\})?';
  const edgePattern = new RegExp(`^${nodePattern}\\s*-->\\s*(?:\\|([^|]+)\\|\\s*)?${nodePattern}$`);
  for (const line of lines.slice(1)) {
    const match = line.match(edgePattern);
    if (!match) return null;
    const [, from, fromBox, fromDecision, edgeLabel, to, toBox, toDecision] = match;
    ensureNode(from, fromBox || fromDecision, fromDecision ? 'decision' : 'box');
    ensureNode(to, toBox || toDecision, toDecision ? 'decision' : 'box');
    edges.push({ from, to, label: edgeLabel || '' });
  }
  if (!nodes.size) return null;

  const items = [...nodes.values()];
  const nodeHeight = 76;
  const gap = 48;
  let cursor = 24;
  items.forEach(node => {
    const longestLine = Math.max(...node.label.split(/\s+/).map(word => word.length));
    node.width = Math.max(126, Math.min(210, Math.max(longestLine, node.label.length * 0.53) * 8 + 34));
    node.x = cursor;
    cursor += node.width + gap;
  });
  const svgWidth = cursor - gap + 24;
  const svgHeight = 176;
  const centerY = 105;
  const arrowId = `${prefix}-arrow-${++flowchartSequence}`;
  const byId = new Map(items.map((node, index) => [node.id, { ...node, index }]));
  const wrapLabel = (label, maxChars) => {
    const words = label.split(/\s+/);
    const rows = [];
    let row = '';
    words.forEach(word => {
      const next = row ? `${row} ${word}` : word;
      if (next.length > maxChars && row) { rows.push(row); row = word; }
      else row = next;
    });
    if (row) rows.push(row);
    return rows;
  };
  const svgNodes = items.map((node, index) => {
    const x = node.x;
    const y = centerY - nodeHeight / 2;
    const cx = x + node.width / 2;
    const rows = wrapLabel(node.label, Math.max(12, Math.floor((node.width - 30) / 8)));
    const text = rows.map((row, rowIndex) => `<tspan x="${cx}" dy="${rowIndex ? 18 : -(rows.length - 1) * 9}">${escapeHtml(row)}</tspan>`).join('');
    const shape = node.shape === 'decision'
      ? `<polygon points="${cx},${y} ${x + node.width},${centerY} ${cx},${y + nodeHeight} ${x},${centerY}" class="flowchart-decision"/>`
      : `<rect x="${x}" y="${y}" width="${node.width}" height="${nodeHeight}" rx="12" class="flowchart-node"/>`;
    return `${shape}<text x="${cx}" y="${centerY}" class="flowchart-label" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  }).join('');
  const svgEdges = edges.map((edge, index) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    const forward = to.index > from.index;
    if (forward) {
      const startX = from.x + from.width;
      const endX = to.x;
      const edgeY = centerY;
      const path = `<path d="M ${startX} ${edgeY} H ${endX - 9}" class="flowchart-edge" marker-end="url(#${arrowId})"/>`;
      const label = edge.label ? `<text x="${(startX + endX) / 2}" y="${edgeY - 12}" class="flowchart-edge-label" text-anchor="middle">${escapeHtml(edge.label)}</text>` : '';
      return path + label;
    }
    const startX = from.x + from.width / 2;
    const endX = to.x + to.width / 2;
    const routeY = 18 + index * 2;
    const path = `<path d="M ${startX} ${centerY - nodeHeight / 2} C ${startX} ${routeY}, ${endX} ${routeY}, ${endX} ${centerY - nodeHeight / 2}" class="flowchart-edge flowchart-edge-return" marker-end="url(#${arrowId})"/>`;
    const label = edge.label ? `<text x="${(startX + endX) / 2}" y="${routeY - 4}" class="flowchart-edge-label" text-anchor="middle">${escapeHtml(edge.label)}</text>` : '';
    return path + label;
  }).join('');

  return `<figure class="guide-flowchart" role="img" aria-label="Left-to-right flowchart"><div class="guide-flowchart-scroll"><svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" aria-hidden="true" focusable="false"><defs><marker id="${arrowId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" class="flowchart-arrow"/></marker></defs>${svgEdges}${svgNodes}</svg></div><figcaption>Flowchart · read from left to right</figcaption></figure>`;
}

function renderMarkdown(markdown, prefix) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  const headingCounts = new Map();
  let index = 0;
  let skippedTitle = false;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || /^\s*>\s*\*\*(Category|Last updated):/.test(line) || /^\s*\*\*(Recommended course|Language|Purpose):/.test(line)) { index++; continue; }
    if (!skippedTitle && /^#\s+/.test(line)) { skippedTitle = true; index++; continue; }
    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const code = [];
      index++;
      while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]);
      index++;
      const diagram = language.toLowerCase() === 'mermaid' ? renderFlowchart(code.join('\n'), prefix) : null;
      output.push(diagram || `<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^\|/.test(line) && index + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[index + 1])) {
      const headers = line.split('|').slice(1, -1).map(cell => cell.trim());
      index += 2;
      const rows = [];
      while (index < lines.length && /^\|/.test(lines[index])) {
        rows.push(lines[index].split('|').slice(1, -1).map(cell => cell.trim()));
        index++;
      }
      output.push(`<div class="guide-table-wrap"><table><thead><tr>${headers.map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((_, cell) => `<td>${inlineMarkdown(row[cell] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = Math.min(4, heading[1].length + 1);
      const title = heading[2].replace(/\s+#+\s*$/, '');
      const slug = slugifyHeading(title);
      const count = (headingCounts.get(slug) || 0) + 1;
      headingCounts.set(slug, count);
      output.push(`<h${level} id="${prefix}-${slug}${count > 1 ? `-${count}` : ''}">${inlineMarkdown(title)}</h${level}>`);
      index++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      while (index < lines.length && (ordered ? /^\s*\d+\.\s+/.test(lines[index]) : /^\s*[-*]\s+/.test(lines[index]))) {
        const text = lines[index].replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
        const task = text.match(/^\[([ xX])\]\s+(.*)$/);
        items.push(task
          ? `<li class="guide-task"><input type="checkbox" disabled${task[1].trim() ? ' checked' : ''}><span>${inlineMarkdown(task[2])}</span></li>`
          : `<li>${inlineMarkdown(text)}</li>`);
        index++;
      }
      output.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    if (/^\s*>/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(inlineMarkdown(lines[index++].replace(/^\s*>\s?/, '')));
      output.push(`<blockquote>${quote.join('<br>')}</blockquote>`);
      continue;
    }
    if (/^\s*---+\s*$/.test(line)) { output.push('<hr>'); index++; continue; }
    const paragraph = [line.trim()];
    index++;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3}\s|```|\||\s*>|\s*[-*]\s|\s*\d+\.\s|---+\s*$)/.test(lines[index])) paragraph.push(lines[index++].trim());
    output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
  }
  return output.join('\n');
}

function buildGuideIndex(panel) {
  const index = panel.querySelector('[data-guide-index]');
  const sectionHeading = panel.querySelector('.guide-section-heading h2');
  if (!index || !sectionHeading) return;

  const headings = [...panel.querySelectorAll('.guide-markdown h2, .guide-markdown h3, .guide-markdown h4')];
  const link = targetId => `<a href="#${targetId}" data-guide-target="${targetId}">`;
  index.innerHTML = `<ul class="guide-index-list"><li class="guide-index-group">${link(sectionHeading.id)}${escapeHtml(sectionHeading.textContent)}</a>${headings.length ? `<ul>${headings.map(heading => `<li class="guide-index-item ${heading.tagName.toLowerCase()}">${link(heading.id)}${escapeHtml(heading.textContent)}</a></li>`).join('')}</ul>` : ''}</li></ul>`;
  observeGuideHeadings(panel, index, sectionHeading, headings);
}

const guideIndexObservers = new WeakMap();

function observeGuideHeadings(panel, index, sectionHeading, headings) {
  guideIndexObservers.get(panel)?.disconnect();
  const indexedHeadings = [sectionHeading, ...headings];
  if (!('IntersectionObserver' in window) || !indexedHeadings.length) return;

  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!active) return;
    index.querySelectorAll('[aria-current="location"]').forEach(link => link.removeAttribute('aria-current'));
    index.querySelector(`[data-guide-target="${active.target.id}"]`)?.setAttribute('aria-current', 'location');
  }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
  indexedHeadings.forEach(heading => observer.observe(heading));
  guideIndexObservers.set(panel, observer);
}

document.querySelectorAll('.guide-index').forEach(index => {
  if (window.matchMedia('(hover: hover)').matches) {
    index.addEventListener('pointerenter', () => index.classList.add('guide-index-hover'));
    index.addEventListener('pointerleave', () => index.classList.remove('guide-index-hover'));
  }
});

document.querySelectorAll('[role="tabpanel"]').forEach(buildGuideIndex);
document.querySelectorAll('[data-guide-index]').forEach(index => index.addEventListener('click', event => {
  const link = event.target.closest('a[data-guide-target]');
  if (!link) return;
  event.preventDefault();
  document.getElementById(link.dataset.guideTarget)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start'
  });
}));

targets.forEach(target => {
  fetch(target.dataset.guideSource)
    .then(response => {
      if (!response.ok) throw new Error(`Guide request failed: ${response.status}`);
      return response.text();
    })
    .then(markdown => {
      target.innerHTML = renderMarkdown(markdown, target.id);
      buildGuideIndex(target.closest('[role="tabpanel"]'));
    })
    .catch(error => {
      console.error(error);
      target.innerHTML = '<p class="guide-error">This section could not load. Open the guide through a local web server.</p>';
      buildGuideIndex(target.closest('[role="tabpanel"]'));
    });
});

const tablist = document.querySelector('[role="tablist"]');
if (tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const activateTab = (tab, moveFocus = false) => {
    const wasSelected = tab.getAttribute('aria-selected') === 'true';
    tabs.forEach(candidate => {
      const active = candidate === tab;
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
      candidate.classList.toggle('guide-tab-active', active);
      document.getElementById(candidate.getAttribute('aria-controls')).hidden = !active;
    });
    if (moveFocus) tab.focus();
    if (!wasSelected) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      const heading = panel?.querySelector('.guide-section-heading h2');
      heading?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });
}
