const themeStorageKey = 'data-knowledge-hub-theme';
let activeTheme = 'light';

try {
  activeTheme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
} catch {
  activeTheme = 'light';
}

document.documentElement.dataset.theme = activeTheme;

function renderThemeButton(button) {
  const darkMode = activeTheme === 'dark';
  const icon = darkMode
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2.5 12h2m15 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.3 8.3 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg>';
  const label = darkMode ? 'Light mode' : 'Dark mode';
  button.innerHTML = `${icon}<span>${label}</span>`;
  button.setAttribute('aria-label', `Switch to ${label.toLowerCase()}`);
  button.setAttribute('aria-pressed', String(darkMode));
  button.title = `Switch to ${label.toLowerCase()}`;
}

function setTheme(theme) {
  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181417' : '#f2ede6');
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The current theme still works for this page when storage is unavailable.
  }
  const button = document.querySelector('.theme-toggle');
  if (button) renderThemeButton(button);
}

function addThemeButton() {
  if (document.querySelector('.theme-toggle')) return;
  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.type = 'button';
  renderThemeButton(button);
  button.addEventListener('click', () => setTheme(activeTheme === 'dark' ? 'light' : 'dark'));

  button.classList.add('theme-toggle-floating');
  document.body.append(button);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addThemeButton, { once: true });
else addThemeButton();
