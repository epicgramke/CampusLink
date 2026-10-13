
/* Campus Connect Kenya — Supabase-connected frontend */
'use strict';

const SUPABASE_URL = 'https://ojbzbkvruehrntdxktse.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA';

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

// Clearly marked demo content. These are not real database posts.
const SAMPLE_LISTINGS = [
  { category: 'marketplace', title: 'Scientific calculator', description: 'Example listing. Add a real product post when posting is enabled.', location: 'Campus', label: 'For sale' },
  { category: 'food', title: 'Campus lunch', description: 'Example menu. Confirm prices and availability with the vendor.', location: 'Campus area', label: 'Food' },
  { category: 'hostels', title: 'Student accommodation', description: 'Example room listing. Confirm rent, deposit and availability.', location: 'Near campus', label: 'Housing' },
  { category: 'jobs', title: 'Part-time opportunity', description: 'Example only. Verify the employer and job requirements.', location: 'Kenya', label: 'Job' },
  { category: 'internships', title: 'Attachment opportunity', description: 'Example only. Confirm the organisation and deadline.', location: 'Kenya', label: 'Career' },
  { category: 'lost-found', title: 'Lost item notice', description: 'Example notice. Do not post private or sensitive information.', location: 'Campus', label: 'Notice' },
  { category: 'events', title: 'Student community event', description: 'Example event. Add the real date and venue when publishing.', location: 'Campus', label: 'Event' },
  { category: 'announcements', title: 'Campus notice', description: 'Example announcement, not an official notice.', location: 'Campus', label: 'Notice' }
];

let supabaseClient = null;
let currentSession = null;
let renderNumber = 0;

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}

function currentRoute() {
  return (location.hash || '#login')
    .replace(/^#\/?/, '')
    .trim()
    .toLowerCase() || 'login';
}

function go(route) {
  location.hash = route;
}

function categoryById(id) {
  return CATEGORIES.find(category => category.id === id);
}

function displayName(user) {
  return user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] || 'Student';
}

function showMessage(message, type = 'success') {
  const box = document.getElementById('app-notice');
  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.className = `notice show ${type}`;
}

function showFatalError(message) {
  if (!app) {
    alert(message);
    return;
  }

  app.innerHTML = `
    <main class="auth-layout">
      <section class="auth-card">
        <p class="eyebrow">CAMPUS CONNECT KENYA</p>
        <h1>Unable to start</h1>
        <p class="muted">${escapeHTML(message)}</p>
        <button class="primary" onclick="location.reload()">
          Try again
        </button>
      </section>
    </main>`;
}

/* -------------------- LOGIN AND REGISTRATION -------------------- */

function renderAuth(mode = 'login', message = '') {
  const isRegister = mode === 'register';

  app.innerHTML = `
    <main class="auth-layout">
      <section class="auth-card">
        <p class="eyebrow">CAMPUS CONNECT KENYA</p>
        <h1>${isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p class="muted">
          ${isRegister
            ? 'Join your campus community.'
            : 'Sign in to continue.'}
        </p>

        <div id="app-notice" class="notice" role="status"></div>

        <form id="auth-form">
          ${isRegister ? `
            <div class="field">
              <label for="full-name">Full name</label>
              <input id="full-name" name="fullName"
                autocomplete="name" maxlength="80"
                required placeholder="Your full name">
            </div>` : ''}

          <div class="field">
            <label for="email">Email address</label>
            <input id="email" name="email" type="email"
              autocomplete="email" maxlength="254"
              required placeholder="you@example.com">
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password"
              autocomplete="${isRegister ? 'new-password' : 'current-password'}"
              minlength="6" required placeholder="At least 6 characters">
          </div>

          ${isRegister ? `
            <div class="field">
              <label for="confirm-password">Confirm password</label>
              <input id="confirm-password" name="confirmPassword"
                type="password" autocomplete="new-password"
                minlength="6" required placeholder="Enter password again">
            </div>` : ''}

          <button class="primary" id="auth-submit" type="submit">
            ${isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p class="auth-switch">
          ${isRegister ? 'Already registered?' : 'New to Campus Connect?'}
          <button class="text-button" id="auth-switch" type="button">
            ${isRegister ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </section>
    </main>`;

  document.getElementById('auth-switch').addEventListener('click', () => {
    go(isRegister ? 'login' : 'register');
  });

  if (message) showMessage(message);

  document.getElementById('auth-form').addEventListener(
    'submit', async event => {
      event.preventDefault();

      const form = event.currentTarget;
      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
      const submit = document.getElementById('auth-submit');

      if (isRegister) {
        const name = form.elements.fullName.value.trim();
        const confirmation = form.elements.confirmPassword.value;

        if (!name) return showMessage('Enter your full name.', 'error');
        if (password !== confirmation) {
          return showMessage('Your passwords do not match.', 'error');
        }
        if (password.length < 6) {
          return showMessage('Use at least 6 password characters.', 'error');
        }

        submit.disabled = true;
        submit.textContent = 'Creating account…';

        try {
          const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
              emailRedirectTo: `${location.origin}${location.pathname}#login`
            }
          });

          if (error) throw error;

          if (data.session) {
            currentSession = data.session;
            go('home');
            await render();
          } else {
            renderAuth(
              'login',
              'Account submitted. Check your email for a confirmation link, then sign in.'
            );
          }
        } catch (error) {
          showMessage(error.message || 'Registration failed.', 'error');
          submit.disabled = false;
          submit.textContent = 'Create account';
        }
      } else {
        submit.disabled = true;
        submit.textContent = 'Signing in…';

        try {
          const { data, error } =
            await supabaseClient.auth.signInWithPassword({
              email,
              password
            });

          if (error) throw error;

          currentSession = data.session;
          go('home');
          await render();
        } catch (error) {
          showMessage(error.message || 'Sign-in failed.', 'error');
          submit.disabled = false;
          submit.textContent = 'Sign in';
        }
      }
    }
  );
}

/* -------------------- NAVIGATION -------------------- */

function header(route) {
  const links = CATEGORIES.map(category => `
    <a href="#${category.id}"
      class="${route === category.id ? 'active' : ''}">
      ${category.icon} ${category.title}
    </a>
  `).join('');

  return `
    <header class="topbar">
      <div class="navwrap">
        <a class="brand" href="#home" aria-label="Campus Connect home">
          CAMPUS <span>CONNECT</span>
        </a>

        <button class="menu-toggle" id="menu-toggle"
          type="button" aria-expanded="false">
          ☰ Menu
        </button>

        <nav class="navlinks" id="main-navigation"
          aria-label="Main navigation" hidden>
          <a href="#home" class="${route === 'home' ? 'active' : ''}">
            Home
          </a>
          ${links}
          <a href="#profile" class="${route === 'profile' ? 'active' : ''}">
            My profile
          </a>
          <button class="logout" id="logout-button" type="button">
            Sign out
          </button>
        </nav>
      </div>
    </header>`;
}

function setupNavigation() {
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-navigation');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      nav.hidden = !nav.hidden;
      menu.setAttribute('aria-expanded', String(!nav.hidden));
      menu.textContent = nav.hidden ? '☰ Menu' : '✕ Close';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.hidden = true;
        menu.setAttribute('aria-expanded', 'false');
        menu.textContent = '☰ Menu';
      });
    });
  }

  const logout = document.getElementById('logout-button');
  if (logout) {
    logout.addEventListener('click', async () => {
      logout.disabled = true;
      logout.textContent = 'Signing out…';

      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        logout.disabled = false;
        logout.textContent = 'Sign out';
        alert(`Could not sign out: ${error.message}`);
      } else {
        currentSession = null;
        go('login');
        await render();
      }
    });
  }
}

/* -------------------- HOME AND CATEGORY CARDS -------------------- */

function categoryCards() {
  return CATEGORIES.map(category => `
    <a class="category-card" href="#${category.id}">
      <span class="category-icon">${category.icon}</span>
      <span>
        <strong>${category.title}</strong>
        <small>${category.description}</small>
      </span>
    </a>
  `).join('');
}

function listingCards(items) {
  if (!items.length) {
    return '<p class="empty">No listings in this category yet.</p>';
  }

  return `<div class="listing-grid">
    ${items.map(item => {
      const category = categoryById(item.category);
      return `
        <article class="listing-card">
          <div class="listing-top">
            <span class="tag">${escapeHTML(item.label)}</span>
            <span class="tag sample-tag">Demo</span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <div class="listing-meta">
            <span>📍 ${escapeHTML(item.location)}</span>
            <span>${category ? category.icon + ' ' + category.title : ''}</span>
          </div>
        </article>`;
    }).join('')}
  </div>`;
}

function renderHome() {
  return `${header('home')}
    <main class="page campus-home">
      <section class="home-intro">
        <p class="eyebrow">YOUR STUDENT COMMUNITY</p>
        <h1>Campus life, connected.</h1>
        <p class="muted">Discover opportunities, services and student life.</p>

        <form id="campus-search" class="campus-search">
          <input id="campus-search-input" type="search"
            placeholder="Search items, food, jobs, hostels…"
            aria-label="Search campus categories">
          <button type="submit" aria-label="Search">Search</button>
        </form>
      </section>

      <section>
        <h2 class="section-title">Explore campus life</h2>
        <div class="category-grid" id="campus-category-grid">
          ${categoryCards()}
        </div>
        <p id="campus-search-empty" class="empty" hidden>
          No matching categories found.
        </p>
      </section>

      <section>
        <h2 class="section-title">Explore listings</h2>
        <p class="muted small">Demonstration content — not live advertisements.</p>
        ${listingCards(SAMPLE_LISTINGS.slice(0, 3))}
      </section>

      <section>
        <h2 class="section-title">Careers and campus updates</h2>
        ${listingCards(SAMPLE_LISTINGS.filter(item =>
          ['internships', 'events', 'announcements'].includes(item.category)
        ))}
      </section>
    </main>
    <footer class="footer">Campus Connect Kenya</footer>`;
}

function setupCampusSearch() {
  const form = document.getElementById('campus-search');
  const input = document.getElementById('campus-search-input');
  const grid = document.getElementById('campus-category-grid');
  const empty = document.getElementById('campus-search-empty');

  if (!form || !input || !grid || !empty) return;

  function filter() {
    const query = input.value.trim().toLowerCase();
    let count = 0;

    grid.querySelectorAll('.category-card').forEach(card => {
      const matches = card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) count++;
    });

    empty.hidden = count !== 0;
  }

  input.addEventListener('input', filter);
  form.addEventListener('submit', event => {
    event.preventDefault();
    filter();
  });
}

/* -------------------- CATEGORY PAGES -------------------- */

function renderCategory(id) {
  const category = categoryById(id);
  if (!category) return renderHome();

  const items = SAMPLE_LISTINGS.filter(item => item.category === id);

  return `${header(id)}
    <main class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">CAMPUS CONNECT</p>
          <h1>${category.icon} ${category.title}</h1>
          <p class="muted">${category.description}</p>
        </div>
        <a class="text-button" href="#home">← Back home</a>
      </div>

      <div class="notice show">
        These are demonstration listings, not real user posts.
      </div>

      ${listingCards(items)}

      <p class="muted small">
        Real posting and database-backed listings need a listings table
        and secure database policies in Supabase.
      </p>
    </main>
    <footer class="footer">Campus Connect Kenya</footer>`;
}

/* -------------------- PROFILE -------------------- */

function renderProfile(user) {
  const metadata = user.user_metadata || {};
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : '—';

  return `${header('profile')}
    <main class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">ACCOUNT</p>
          <h1>My profile</h1>
          <p class="muted">Your signed-in account details.</p>
        </div>
      </div>

      <section class="profile-panel">
        <div class="profile-row">
          <span class="muted">Full name</span>
          <strong>${escapeHTML(metadata.full_name || 'Not added')}</strong>
        </div>
        <div class="profile-row">
          <span class="muted">Email</span>
          <strong>${escapeHTML(user.email || '')}</strong>
        </div>
        <div class="profile-row">
          <span class="muted">Member since</span>
          <strong>${escapeHTML(joined)}</strong>
        </div>
      </section>
    </main>
    <footer class="footer">Campus Connect Kenya</footer>`;
}

/* -------------------- PAGE ROUTING -------------------- */

async function render() {
  const thisRender = ++renderNumber;

  if (!supabaseClient) return;

  const { data, error } = await supabaseClient.auth.getSession();
  if (thisRender !== renderNumber) return;

  if (error) {
    showFatalError(`Could not read your session: ${error.message}`);
    return;
  }

  currentSession = data.session;
  const route = currentRoute();
  const isAuthRoute = ['login', 'register'].includes(route);

  if (!currentSession) {
    if (!isAuthRoute) {
      if (location.hash !== '#login') location.hash = '#login';
      renderAuth('login');
      return;
    }

    renderAuth(route === 'register' ? 'register' : 'login');
    return;
  }

  if (isAuthRoute || !route) {
    if (location.hash !== '#home') location.hash = '#home';
    app.innerHTML = renderHome();
    setupNavigation();
    setupCampusSearch();
    return;
  }

  if (route === 'home') {
    app.innerHTML = renderHome();
    setupNavigation();
    setupCampusSearch();
    return;
  }

  if (route === 'profile') {
    app.innerHTML = renderProfile(currentSession.user);
    setupNavigation();
    return;
  }

  if (categoryById(route)) {
    app.innerHTML = renderCategory(route);
    setupNavigation();
    return;
  }

  go('home');
}

/* -------------------- STARTUP -------------------- */

async function start() {
  if (!app) {
    throw new Error('Could not find the #app element in index.html.');
  }

  if (!window.supabase ||
      typeof window.supabase.createClient !== 'function') {
    showFatalError(
      'The Supabase library did not load. Check that index.html loads Supabase before script.js.'
    );
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentSession = session;

    if (event === 'SIGNED_OUT') {
      if (location.hash !== '#login') location.hash = '#login';
      renderAuth('login');
    } else if (event === 'SIGNED_IN') {
      if (['', 'login', 'register'].includes(currentRoute())) {
        if (location.hash !== '#home') location.hash = '#home';
      }
      render();
    }
  });

  window.addEventListener('hashchange', () => render());

  if (!location.hash) location.hash = '#login';
  await render();
}

start().catch(error => {
  console.error('Campus Connect startup error:', error);
  showFatalError(
    'The website could not start. Check index.html, the Supabase settings and the browser console.'
  );
});
