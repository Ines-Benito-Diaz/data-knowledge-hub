const target = document.querySelector('#guide-content');

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

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
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
      output.push(`<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
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
      output.push(`<h${level}>${inlineMarkdown(title)}</h${level}>`);
      index++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      while (index < lines.length && (ordered ? /^\s*\d+\.\s+/.test(lines[index]) : /^\s*[-*]\s+/.test(lines[index]))) {
        items.push(`<li>${inlineMarkdown(lines[index].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))}</li>`);
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

fetch(document.body.dataset.guideSource)
  .then(response => {
    if (!response.ok) throw new Error(`Git reference request failed: ${response.status}`);
    return response.text();
  })
  .then(markdown => { target.innerHTML = renderMarkdown(markdown); })
  .catch(error => {
    console.error(error);
    target.innerHTML = '<p class="guide-error">The Git reference could not load. Open this guide through a local web server.</p>';
  });
