/* CAMPUS CONNECT — BLACK & GOLD — KENYA */
const SUPABASE_URL = 'https://ojbzbkvruehrntdxktse.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA';

if (!window.supabase) {
  document.getElementById('app').innerHTML =
    '<p>SUPABASE FAILED TO LOAD. CHECK YOUR INTERNET CONNECTION AND INDEX.HTML.</p>';
  throw new Error('Supabase library missing');
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const sections = [
  { slug: 'marketplace', title: 'CAMPUS MARKETPLACE', desc: 'BUY AND SELL PRODUCTS AND SERVICES.' },
  { slug: 'food', title: 'CAMPUS FOOD', desc: 'DISCOVER MEALS AND FOOD VENDORS.' },
  { slug: 'hostels', title: 'HOSTELS & ACCOMMODATION', desc: 'FIND ACCOMMODATION NEAR CAMPUS.' },
  { slug: 'jobs', title: 'CAMPUS JOBS', desc: 'DISCOVER STUDENT-FRIENDLY JOBS.' },
  { slug: 'internships', title: 'INTERNSHIPS & ATTACHMENTS', desc: 'EXPLORE CAREER OPPORTUNITIES.' },
  { slug: 'lost-found', title: 'LOST & FOUND', desc: 'HELP STUDENTS FIND LOST BELONGINGS.' },
  { slug: 'events', title: 'CAMPUS EVENTS', desc: 'DISCOVER CAMPUS ACTIVITIES.' },
  { slug: 'announcements', title: 'ANNOUNCEMENTS', desc: 'READ CAMPUS ANNOUNCEMENTS.' }
];

const demoListings = {
  marketplace: [
    { name: 'WIRELESS EARPHONES', category: 'ELECTRONICS', price: 850 },
    { name: 'CAMPUS BACKPACK', category: 'FASHION', price: 1200 },
    { name: 'SCIENTIFIC CALCULATOR', category: 'EDUCATION', price: 650 },
    { name: 'SECOND-HAND TEXTBOOKS', category: 'EDUCATION', price: 400 }
  ],
  food: [
    { name: 'CHIPS AND SAUSAGE', category: 'SNACKS', price: 150 },
    { name: 'CHAPATI AND BEANS', category: 'MEALS', price: 100 },
    { name: 'PILAU', category: 'MEALS', price: 180 },
    { name: 'FRESH JUICE', category: 'DRINKS', price: 100 },
    { name: 'SMOKIE', category: 'SNACKS', price: 40 }
  ],
  hostels: [
    { name: 'SINGLE STUDENT ROOM', category: 'ACCOMMODATION', price: 5000 },
    { name: 'SHARED STUDENT ROOM', category: 'SHARED HOUSING', price: 3000 }
  ],
  jobs: [
    { name: 'PART-TIME SHOP ASSISTANT', category: 'PART-TIME', price: 0 },
    { name: 'CAMPUS SALES ASSISTANT', category: 'FLEXIBLE', price: 0 }
  ],
  internships: [
    { name: 'INDUSTRIAL ATTACHMENT', category: 'ATTACHMENT', price: 0 },
    { name: 'GRADUATE INTERNSHIP', category: 'INTERNSHIP', price: 0 }
  ],
  'lost-found': [
    { name: 'LOST STUDENT ID', category: 'LOST', price: 0 },
    { name: 'FOUND WATER BOTTLE', category: 'FOUND', price: 0 }
  ],
  events: [
    { name: 'STUDENT NETWORKING EVENT', category: 'NETWORKING', price: 0 },
    { name: 'CAMPUS TALENT SHOW', category: 'ENTERTAINMENT', price: 0 }
  ],
  announcements: [
    { name: 'WELCOME TO CAMPUS CONNECT', category: 'NOTICE', price: 0 },
    { name: 'SHARE CAMPUS UPDATES', category: 'COMMUNITY', price: 0 }
  ]
};

const app = document.getElementById('app');

let currentUser = null;
let currentProfile = null;
let authMessage = '';

function money(amount) {
  return 'KSH ' + Number(amount).toLocaleString('en-KE');
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[c]);
}

function getStyles() {
  return `
  <style>
    *{box-sizing:border-box}
    body{margin:0;background:#090909;color:#f5f5f5;font-family:Arial,sans-serif;text-transform:uppercase}
    input,select,button{font:inherit;text-transform:uppercase}
    .wrap{width:min(1120px,92%);margin:auto}
    .topline{background:#171717;color:#d9b34b;padding:10px;font-size:12px}
    .header{background:#0d0d0d;border-bottom:1px solid #383020;position:sticky;top:0;z-index:5}
    .headrow{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;flex-wrap:wrap}
    .brand{display:flex;align-items:center;gap:12px;color:white;text-decoration:none;font-weight:bold}
    .logo{border:2px solid #d9b34b;padding:10px;color:#d9b34b}
    .brand-tag{font-size:10px;color:#d9b34b}
    .nav{display:flex;gap:12px;flex-wrap:wrap}
    a{color:#d9b34b}
    .nav a{font-size:12px;text-decoration:none}
    .hero,.page-hero{padding:50px 0;background:linear-gradient(120deg,#16130c,#090909)}
    h1{font-size:clamp(30px,6vw,54px);line-height:1.12}
    h2{color:#d9b34b}
    p{line-height:1.7;color:#c9c9c9}
    .gold,.meta{color:#d9b34b}
    .btn,button{display:inline-block;padding:12px 16px;border:1px solid #d9b34b;background:#d9b34b;color:#111;text-decoration:none;cursor:pointer;border-radius:4px;font-weight:bold}
    .outline{background:transparent;color:#d9b34b}
    .section{padding:30px 0}
    .feature-grid,.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
    .feature,.card,.panel,.hero-panel{display:block;padding:20px;background:#141414;border:1px solid #393126;border-radius:8px;text-decoration:none;color:white}
    .feature h3,.card h3{color:#d9b34b}
    .tag,.pill{display:inline-block;border:1px solid #69572a;color:#d9b34b;padding:5px 8px;font-size:11px}
    input,select{width:100%;padding:12px;margin:6px 0 14px;background:#090909;color:white;border:1px solid #51462e;border-radius:4px}
    label{display:block;color:#d9b34b;margin-top:10px}
    .auth{max-width:500px;margin:30px auto;padding:24px;background:#141414;border:1px solid #51462e;border-radius:8px}
    .auth-links{display:flex;gap:16px;flex-wrap:wrap;margin:15px 0}
    .notice{margin-top:22px;padding:14px;border:1px solid #51462e;color:#c9c9c9;font-size:12px}
    .footer{border-top:1px solid #393126;padding:24px 0;margin-top:40px;color:#aaa;font-size:12px}
    .muted{font-size:12px;color:#aaa}
    @media(max-width:650px){.headrow{align-items:flex-start}.nav{gap:10px}.hero{padding:30px 0}}
  </style>`;
}
function header() {
  return `
    <div class="topline">
      <div class="wrap">
        CAMPUS CONNECT KENYA · YOUR CAMPUS, YOUR COMMUNITY
      </div>
    </div>

    <header class="header">
      <div class="wrap headrow">

        <a class="brand" href="#home">
          <span class="logo">CC</span>
          <span>
            CAMPUS CONNECT<br>
            <span class="brand-tag">YOUR CAMPUS. YOUR COMMUNITY.</span>
          </span>
        </a>

        <button
          class="mobile-menu"
          id="mobileMenuBtn"
          type="button"
          aria-expanded="false"
          aria-label="Open navigation menu"
        >☰</button>

        <nav class="nav" id="mainNav">
          <a href="#home">HOME</a>
          <a href="#marketplace">MARKETPLACE</a>
          <a href="#food">FOOD</a>
          <a href="#hostels">HOSTELS</a>
          <a href="#jobs">JOBS</a>
          <a href="#internships">INTERNSHIPS</a>
          <a href="#lost-found">LOST &amp; FOUND</a>
          <a href="#events">EVENTS</a>
          <a href="#announcements">UPDATES</a>
          ${currentUser
            ? '<a href="#profile">MY PROFILE</a>'
            : '<a href="#login">LOGIN</a>'}
        </nav>

      </div>
    </header>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap">© ${new Date().getFullYear()} CAMPUS CONNECT KENYA</div></footer>`;
}

function home() {
  return `
    <section class="hero"><div class="wrap">
      <span class="pill">KENYA'S STUDENT COMMUNITY</span>

      <p>MEET STUDENTS, DISCOVER FOOD, BUY AND SELL PRODUCTS, FIND ACCOMMODATION AND EXPLORE OPPORTUNITIES ACROSS KENYA.</p>

      ${currentUser ? `<p>WELCOME, ${escapeHTML(currentProfile?.full_name || currentUser.email)}!</p>` :
        '<p>JOIN YOUR CAMPUS COMMUNITY.</p><a class="btn" href="#register">CREATE ACCOUNT</a> <a class="btn outline" href="#login">LOGIN</a>'}
    </div></section>

    <section class="section wrap"><h2>EXPLORE CAMPUS CONNECT</h2>
      <div class="feature-grid">${sections.map(s => `
        <a class="feature" href="#${s.slug}"><span class="gold">✦</span>
        <h3>${s.title}</h3><p>${s.desc}</p></a>`).join('')}
      </div>
    </section>

    <section class="section wrap"><div class="panel">
      <h2>YOUR CAMPUS. YOUR COMMUNITY.</h2>
      <p>START EXPLORING CAMPUS LIFE IN ONE PLACE.</p>
      <a class="btn" href="#register">JOIN CAMPUS CONNECT</a>
    </div><div class="notice">SAMPLE LISTINGS ARE DEMONSTRATIONS. VERIFY SELLERS, RENTALS AND JOBS BEFORE SENDING MONEY.</div></section>`;
}

function authPage(mode) {
  const registering = mode === 'register';
  return `
    <section class="section wrap"><div class="auth">
      <h1>${registering ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</h1>
      <p>${registering ? 'REGISTER AS A STUDENT. ADMIN ACCESS REQUIRES SEPARATE APPROVAL.' : 'LOGIN TO YOUR CAMPUS CONNECT ACCOUNT.'}</p>
      <form id="authForm">
        ${registering ? `
          <label for="fullName">FULL NAME</label>
          <input id="fullName" name="fullName" required maxlength="80" autocomplete="name" placeholder="YOUR FULL NAME">
          <label for="campus">COLLEGE OR UNIVERSITY</label>
          <input id="campus" name="campus" required maxlength="120" placeholder="YOUR COLLEGE OR UNIVERSITY">
        ` : ''}
        <label for="email">EMAIL ADDRESS</label>
        <input id="email" name="email" type="email" required autocomplete="email" placeholder="YOU@example.com">
        <label for="password">PASSWORD</label>
        <input id="password" name="password" type="password" required minlength="8" autocomplete="${registering ? 'new-password' : 'current-password'}" placeholder="AT LEAST 8 CHARACTERS">
        <button type="submit">${registering ? 'REGISTER' : 'LOGIN'}</button>
      </form>
      <p id="authMessage" aria-live="polite">${escapeHTML(authMessage)}</p>
      <div class="auth-links">
        ${registering ? '<a href="#login">ALREADY HAVE AN ACCOUNT? LOGIN</a>' : '<a href="#register">NEW STUDENT? REGISTER</a>'}
        <a href="#home">BACK HOME</a>
      </div>
      <p class="muted">CAMPUS ADMINISTRATORS MUST BE APPROVED SEPARATELY. THIS FORM CANNOT GRANT ADMIN PRIVILEGES.</p>
    </div></section>`;
}

function listingPage(slug) {
  const items = demoListings[slug] || [];
  const title = sections.find(s => s.slug === slug)?.title || 'CAMPUS CONNECT';
  return `<section class="page-hero"><div class="wrap"><a href="#home">HOME</a><h1>${title}</h1>
    <p>EXPLORE SAMPLE LISTINGS. CONTACT DETAILS AND LIVE INVENTORY ARE NOT CONNECTED YET.</p></div></section>
    <section class="section wrap"><div class="cards">${items.map(item => `
      <article class="card"><span class="tag">${item.category}</span><h3>${item.name}</h3>
      ${item.price > 0 ? `<p class="meta">${money(item.price)}${slug === 'hostels' ? ' / MONTH (EXAMPLE)' : ''}</p>` : ''}
      <p>DEMO LISTING. CONFIRM DETAILS BEFORE PAYING.</p>
      <button class="outline enquire" data-name="${item.name}">ENQUIRE</button></article>`).join('')}
    </div></section>`;
}

function profilePage() {
  if (!currentUser) return `<section class="section wrap"><div class="auth"><h1>LOGIN REQUIRED</h1><a class="btn" href="#login">LOGIN</a></div></section>`;
  return `<section class="section wrap"><div class="panel"><h1>MY PROFILE</h1>
    <p>EMAIL: ${escapeHTML(currentUser.email)}</p>
    <p>NAME: ${escapeHTML(currentProfile?.full_name || '')}</p>
    <p>CAMPUS ID: ${escapeHTML(currentProfile?.campus_id || 'NOT SET')}</p>
    <button id="logoutBtn">LOG OUT</button>
    <p id="profileMessage"></p></div></section>`;
}

async function refreshSession() {
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  currentProfile = null;
  if (currentUser) {
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('full_name, role, campus_id')
      .eq('id', currentUser.id)
      .maybeSingle();
    if (!error) currentProfile = profile;
  }
}

async function register(form) {
  const fullName = String(form.get('fullName') || '').trim();
  const campusName = String(form.get('campus') || '').trim();
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');

  if (!fullName || !campusName || !email || password.length < 8) {
    throw new Error('PLEASE COMPLETE ALL FIELDS. PASSWORD MUST BE AT LEAST 8 CHARACTERS.');
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;

  if (data.session && data.user) {
    const { error: profileError } = await supabaseClient.from('profiles')
      .update({ full_name: fullName })
      .eq('id', data.user.id);
    if (profileError) {
      throw new Error('ACCOUNT CREATED, BUT PROFILE SETUP NEEDS ATTENTION: ' + profileError.message);
    }
    authMessage = 'ACCOUNT CREATED. PLEASE LOG IN.';
  } else {
    authMessage = 'REGISTRATION RECEIVED. CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT, THEN LOG IN. YOUR CAMPUS NAME WILL NEED TO BE LINKED AFTER SIGN-IN.';
  }
  location.hash = 'login';
}

async function login(form) {
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await refreshSession();
  authMessage = '';
  location.hash = 'home';
}

function bindPage(slug) {
  const form = document.getElementById('authForm');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const message = document.getElementById('authMessage');
    submitButton.disabled = true;
    if (message) message.textContent = 'PLEASE WAIT...';
    try {
      const formData = new FormData(form);
      if (slug === 'register') await register(formData);
      else await login(formData);
    } catch (error) {
      if (message) message.textContent = String(error.message || 'SOMETHING WENT WRONG. PLEASE TRY AGAIN.').toUpperCase();
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    currentUser = null;
    currentProfile = null;
    location.hash = 'home';
    render();
  });

  document.querySelectorAll('.enquire').forEach(button => {
    button.addEventListener('click', () => {
      const msg = encodeURIComponent('HELLO CAMPUS CONNECT. I AM INTERESTED IN: ' + button.dataset.name);
      window.open('https://wa.me/?text=' + msg, '_blank', 'noopener');
    });
  });
}

async function render() {
  const requestedPage = location.hash.slice(1) || 'login';

  await refreshSession();

  if (!currentUser && !['login', 'register'].includes(requestedPage)) {
    location.hash = 'login';
    return;
  }

  let slug = requestedPage;
  let content;

  if (slug === 'home') content = home();
  else if (slug === 'register') content = authPage('register');
  else if (slug === 'login') content = authPage('login');
  else if (slug === 'profile') content = profilePage();
  else if (demoListings[slug]) content = listingPage(slug);
  else {
    slug = 'home';
    content = home();
  }

  app.innerHTML = getStyles() + header() + content + footer();
  document.title = 'CAMPUS CONNECT | ' + slug.toUpperCase();
  bindPage(slug);
}

window.addEventListener('hashchange', render);
supabaseClient.auth.onAuthStateChange(() => {
  refreshSession().then(() => render());
});
render();
