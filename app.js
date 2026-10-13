/* Campus Connect Kenya — clean frontend + Supabase email authentication */
'use strict';

const SUPABASE_URL = 'https://ojbzbkvruehrntdxktse.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA';
const app = document.getElementById('app');

const CATEGORIES = [
  { id: 'marketplace', title: 'Marketplace', icon: '🛍️', description: 'Buy and sell on campus' },
  { id: 'food', title: 'Food', icon: '🍲', description: 'Meals and food vendors' },
  { id: 'hostels', title: 'Hostels', icon: '🏠', description: 'Rooms and accommodation' },
  { id: 'jobs', title: 'Jobs', icon: '💼', description: 'Part-time and full-time work' },
  { id: 'internships', title: 'Internships', icon: '🎓', description: 'Attachments and internships' },
  { id: 'lost-found', title: 'Lost & Found', icon: '🔎', description: 'Find or report an item' },
  { id: 'events', title: 'Events', icon: '🎉', description: 'Campus events and activities' },
  { id: 'announcements', title: 'Announcements', icon: '📣', description: 'Important campus notices' }
];

// These are clearly marked sample cards. They are not stored in the database.
const SAMPLE_LISTINGS = [
  { category: 'marketplace', title: 'Used scientific calculator', description: 'Good working condition. Meet on campus to check before buying.', location: 'Campus meet-up', label: 'For sale' },
  { category: 'food', title: 'Lunch specials', description: 'Add your daily menu and prices when publishing a real food listing.', location: 'Campus area', label: 'Food' },
  { category: 'hostels', title: 'Student room listing', description: 'Add rent, deposit, available date and contact details for a real room.', location: 'Near campus', label: 'Accommodation' },
  { category: 'jobs', title: 'Part-time opportunity', description: 'Check details, hours and requirements directly with the advertiser.', location: 'Campus area', label: 'Opportunity' },
  { category: 'internships', title: 'Attachment opportunity', description: 'Add the organisation, field, deadline and application instructions.', location: 'Kenya', label: 'Career' },
  { category: 'lost-found', title: 'Lost item notice', description: 'Describe the item and where it was last seen. Avoid posting private details.', location: 'Campus area', label: 'Notice' },
  { category: 'events', title: 'Student community event', description: 'Add the event date, venue, entry fee and organiser contact.', location: 'Campus', label: 'Event' },
  { category: 'announcements', title: 'Campus announcement', description: 'Use this category for verified notices and updates.', location: 'Campus', label: 'Notice' }
];

let supabaseClient = null;
let currentSession = null;
let renderNumber = 0;

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function currentRoute() {
  return (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase() || 'login';
}
function go(route) { window.location.hash = `#${route}`; }
function categoryById(id) { return CATEGORIES.find(item => item.id === id); }
function displayName(user) {
  return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
}
  function renderAuth(mode = 'login', message = '') {
  const isRegister = mode === 'register';

  app.innerHTML = `
    <main class="auth-layout">
      <section class="auth-card">
        <p class="eyebrow">STUDENT ACCESS</p>
        <h1>${isRegister ? 'Create your account' : 'WELCOME BACK'}</h1>
        <p class="muted">${isRegister ? 'Register to access the Campus Connect community.' : 'Sign in to continue to Campus Connect.'}</p>

        <div id="auth-notice" class="notice" role="status"></div>

        <form id="auth-form">
          ${isRegister ? `
            <div class="field">
              <label for="full-name">Full name</label>
              <input id="full-name" name="fullName" autocomplete="name" maxlength="80" required placeholder="Your full name">
            </div>
          ` : ''}

          <div class="field">
            <label for="email">Email address</label>
            <input id="email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com">
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" minlength="6" required placeholder="At least 6 characters">
          </div>

          ${isRegister ? `
            <div class="field">
              <label for="confirm-password">Confirm password</label>
              <input id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" minlength="6" required placeholder="Enter password again">
            </div>
          ` : ''}

          <button class="primary" type="submit" id="auth-submit">
            ${isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div class="auth-switch">
          ${isRegister ? 'Already have an account?' : 'New to Campus Connect?'}
          <button class="text-button" id="auth-switch" type="button">
            ${isRegister ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </section>
    </main>`;

  document.getElementById('auth-switch').addEventListener('click', () => {
    go(isRegister ? 'login' : 'register');
  });

  if (message) setNotice(message, 'success');

  document.getElementById('auth-form').addEventListener('submit', async event => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const submit = document.getElementById('auth-submit');

    if (isRegister) {
      const name = form.elements.fullName.value.trim();
      const confirmation = form.elements.confirmPassword.value;

      if (!name) return setNotice('Enter your full name.', 'error');
      if (password !== confirmation) return setNotice('The passwords do not match.', 'error');
      if (password.length < 6) return setNotice('Use a password with at least 6 characters.', 'error');

      submit.disabled = true;
      submit.textContent = 'Creating account…';

      const emailRedirectTo = `${window.location.origin}${window.location.pathname}#login`;

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo
        }
      });

      submit.disabled = false;
      submit.textContent = 'Create account';

      if (error) return setNotice(error.message, 'error');

      if (data.session) {
        currentSession = data.session;
        go('home');
      } else {
        setNotice(
          'Account created. Check your email for a confirmation link, then return here to sign in.',
          'success'
        );
      }
    } else {
      submit.disabled = true;
      submit.textContent = 'Signing in…';

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      submit.disabled = false;
      submit.textContent = 'Sign in';

      if (error) return setNotice(error.message, 'error');

      currentSession = data.session;
      go('home');
    }
  });
}

function setNotice(message, type = 'success') {
  const box = document.getElementById('auth-notice');
  if (!box) return;
  box.className = `notice show ${type}`;
  box.textContent = message;
}
function header(route) {
  const categoryLinks = CATEGORIES.map(item => `
    <a href="#${item.id}" class="${route === item.id ? 'active' : ''}">
      ${item.title}
    </a>
  `).join('');

  return `
    <header class="topbar">
      <div class="navwrap">
        <a class="brand" href="#home" aria-label="Campus Connect home">
          CAMPUS <span>CONNECT</span>
        </a>

        <button
          class="menu-toggle"
          id="menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="main-navigation"
        >
          ☰ Menu
        </button>

        <nav class="navlinks" id="main-navigation"
             aria-label="Main navigation" hidden>
          <a href="#home" class="${route === 'home' ? 'active' : ''}">
            Home
          </a>
          ${categoryLinks}
          <a href="#profile" class="${route === 'profile' ? 'active' : ''}">
            My profile
          </a>
        </nav>
      </div>
    </header>`;
}

function categoryCards() {
  return CATEGORIES.map(item => `<a class="category-card" href="#${item.id}">
    <span class="category-icon" aria-hidden="true">${item.icon}</span><span><strong>${item.title}</strong><small>${item.description}</small></span>
  </a>`).join('');
}
function listingCards(items) {
  if (!items.length) return '<div class="empty">No sample listings are available for this category yet.</div>';
  return `<div class="listing-grid">${items.map(item => {
    const category = categoryById(item.category);
    return `<article class="listing-card"><div class="listing-top"><span class="tag">${escapeHTML(item.label)}</span><span class="tag sample-tag">Sample</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><div class="listing-meta"><span>📍 ${escapeHTML(item.location)}</span><span>${category ? category.icon + ' ' + category.title : ''}</span></div></article>`;
  }).join('')}</div>`;
}

function renderHome(user) {
  return `${header('home')}
    <main class="page campus-home">

      <section class="home-intro">
        <p class="eyebrow">YOUR STUDENT COMMUNITY</p>

        <form id="campus-search" class="campus-search">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            id="campus-search-input"
            type="search"
            placeholder="Search items, food, jobs, hostels..."
            aria-label="Search campus categories"
          >
          <button type="submit" aria-label="Search">⌕</button>
        </form>
      </section>

      <section aria-label="Campus Connect categories">
        <h2 class="section-title">EXPLORE CAMPUS LIFE</h2>

        <div class="category-grid" id="campus-category-grid">
          ${categoryCards()}
        </div>

        <p id="campus-search-empty" class="empty" hidden>
          No matching campus categories found.
        </p>
      </section>

      <section>
        <h2 class="section-title">Example listings</h2>
        <p class="muted small">
          These are sample listings, not live posts.
        </p>
        ${listingCards(SAMPLE_LISTINGS.slice(0, 3))}
      </section>

      <section>
        <h2 class="section-title">Announcements and activities</h2>
        ${listingCards(
          SAMPLE_LISTINGS.filter(item =>
            ['events', 'announcements', 'internships']
              .includes(item.category)
          )
        )}
      </section>

    </main>
    <footer class="footer">Campus Connect Kenya</footer>`;
}
}

function header(route) {
  const categoryLinks = CATEGORIES.map(item => `
    <a href="#${item.id}"
       class="${route === item.id ? 'active' : ''}">
      ${item.title}
    </a>
  `).join('');

  return `
    <header class="topbar">
      <div class="navwrap">
        <a class="brand" href="#home" aria-label="Campus Connect home">
          CAMPUS <span>CONNECT</span>
        </a>

        <button
  class="menu-toggle"
  id="menu-toggle"
  type="button"
  onclick="const n=document.getElementById('main-navigation'); n.hidden=!n.hidden; this.textContent=n.hidden?'☰ Menu':'✕ Close';"
>
  ☰ Menu
</button>

        <nav class="navlinks"
             id="main-navigation"
             aria-label="Main navigation"
             hidden>
          <a href="#home"
             class="${route === 'home' ? 'active' : ''}">
            Home
          </a>

          ${categoryLinks}

          <a href="#profile"
             class="${route === 'profile' ? 'active' : ''}">
            My profile
          </a>

          <button class="logout" id="logout-button" type="button">
            Sign out
          </button>
        </nav>
      </div>
    </header>`;
}
function renderProfile(user) {
  const metadata = user.user_metadata || {};
  const joined = user.created_at ? new Date(user.created_at).toLocaleDateString() : '—';
  return `${header('profile')}<main class="page"><div class="page-head"><div><p class="eyebrow">ACCOUNT</p><h1>My profile</h1><p class="muted">Your signed-in account details.</p></div></div>
    <section class="profile-panel"><div class="profile-row"><span class="muted">Full name</span><strong>${escapeHTML(metadata.full_name || 'Not added')}</strong></div>
    <div class="profile-row"><span class="muted">Email</span><strong>${escapeHTML(user.email || '')}</strong></div>
    <div class="profile-row"><span class="muted">Member since</span><strong>${escapeHTML(joined)}</strong></div></section>
    </main><footer class="footer">Campus Connect Kenya</footer>`;
}

async function render() {
  const thisRender = ++renderNumber;
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.auth.getSession();
  if (thisRender !== renderNumber) return;
  if (error) return showConfigError(`Could not read your sign-in session: ${error.message}`);
  currentSession = data.session;
  const route = currentRoute();
  const isAuthRoute = route === 'login' || route === 'register';

  // Every page except login/register requires an authenticated Supabase session.
  if (!currentSession && !isAuthRoute) {
    if (window.location.hash !== '#login') window.location.hash = '#login';
    renderAuth('login');
    return;
  }
  if (currentSession && isAuthRoute) {
    if (window.location.hash !== '#home') window.location.hash = '#home';
    renderHome(currentSession.user);
    return;
  }
  if (!currentSession) {
    renderAuth(route === 'register' ? 'register' : 'login');
    return;
  }

  if (route === 'home') app.innerHTML = renderHome(currentSession.user);
  else if (route === 'profile') app.innerHTML = renderProfile(currentSession.user);
  else if (categoryById(route)) app.innerHTML = renderCategory(currentSession.user, route);
  else {
    window.location.hash = '#home';
    app.innerHTML = renderHome(currentSession.user);
  }
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    const { error: signOutError } = await supabaseClient.auth.signOut();
    if (signOutError) {
      logoutButton.disabled = false;
      alert(`Could not sign out: ${signOutError.message}`);
    } else {
      currentSession = null;
      go('login');
    }
  });
}

async function start() {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    return showConfigError('The Supabase library did not load. Check your internet connection and reload the page.');
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  window.addEventListener('hashchange', render);
  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentSession = session;
    if (event === 'SIGNED_OUT') {
      if (window.location.hash !== '#login') window.location.hash = '#login';
      renderAuth('login');
    } else if (event === 'SIGNED_IN' && ['login', 'register', ''].includes(currentRoute())) {
      if (window.location.hash !== '#home') window.location.hash = '#home';
      renderHome(session.user);
    }
  });
  if (!window.location.hash) window.location.hash = '#login';
  await render();
}

start().catch(error => {
  console.error('Campus Connect startup error:', error);
  showConfigError('The website could not start. Open the browser console for more details, then verify the Supabase configuration.');
});
