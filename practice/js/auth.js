// Auth logic - fake but realistic
const VALID_USERS = [
  { username: 'admin', password: '123456', name: 'Admin User' },
  { username: 'tester', password: 'abc123', name: 'Ha Giang Tester' },
];

function isLoggedIn() {
  return sessionStorage.getItem('pw_user') !== null;
}

function getCurrentUser() {
  const u = sessionStorage.getItem('pw_user');
  return u ? JSON.parse(u) : null;
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = getBasePath() + 'index.html';
  }
}

function getBasePath() {
  // Works for both local and GitHub Pages
  const path = window.location.pathname;
  const pagesIdx = path.indexOf('/pages/');
  if (pagesIdx !== -1) return path.substring(0, pagesIdx) + '/';
  return './';
}

function logout() {
  sessionStorage.removeItem('pw_user');
  window.location.href = getBasePath() + 'index.html';
}

function renderNav(activePage) {
  const user = getCurrentUser();
  const base = getBasePath() + 'pages/';
  const pages = [
    { href: 'home.html', label: 'Home' },
    { href: 'elements.html', label: 'Elements' },
    { href: 'table.html', label: 'Table' },
    { href: 'iframe-page.html', label: 'IFrame' },
    { href: 'dialogs.html', label: 'Dialogs' },
    { href: 'upload.html', label: 'Upload' },
    { href: 'dragdrop.html', label: 'Drag & Drop' },
    { href: 'calendar.html', label: 'Calendar' },
    { href: 'windows.html', label: 'Windows' },
    { href: 'scroll.html', label: 'Scroll' },
  ];
  const links = pages.map(p =>
    `<a href="${base}${p.href}" class="${p.href === activePage ? 'active' : ''}" data-testid="nav-${p.href.replace('.html','')}">${p.label}</a>`
  ).join('');

  return `
    <nav class="navbar" id="navbar">
      <a class="logo" href="${base}home.html">🎭 PW Practice</a>
      ${links}
      <div class="user-badge">
        <span id="nav-username">${user ? user.name : ''}</span>
        <button class="btn-logout" onclick="logout()" id="btn-logout">Logout</button>
      </div>
    </nav>
  `;
}
