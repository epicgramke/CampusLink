// CAMPUS CONNECT — Main Application
// Black & Gold | Kenya

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/>',
  shopping: '<path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  food: '<path d="M3 3v7a4 4 0 0 0 8 0V3M7 3v18M17 3v18M17 3c4 3 4 8 0 10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c4 3 8 3 12 0v-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-4.1A8.5 8.5 0 1 1 21 11.5Z"/>',
  house: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/>',
  wallet: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M16 14h2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"
    style="width:20px;height:20px;stroke:currentColor;fill:none;
    stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round">
    ${iconPaths[name] || iconPaths.arrow}
  </svg>`;
}

const sections = [
  { slug: 'marketplace', title: 'Campus Marketplace', short: 'Marketplace', desc: 'Buy and sell products and services.', icon: 'shopping' },
  { slug: 'food', title: 'Campus Food', short: 'Food', desc: 'Discover meals and order from food vendors.', icon: 'food' },
  { slug: 'hostels', title: 'Hostels & Accommodation', short: 'Hostels', desc: 'Find accommodation near campus.', icon: 'house' },
  { slug: 'jobs', title: 'Campus Jobs', short: 'Jobs', desc: 'Discover student-friendly jobs.', icon: 'briefcase' },
  { slug: 'internships', title: 'Internships & Attachments', short: 'Internships', desc: 'Explore career opportunities.', icon: 'cap' },
  { slug: 'lost-found', title: 'Lost & Found', short: 'Lost & Found', desc: 'Help students find lost belongings.', icon: 'search' },
  { slug: 'events', title: 'Campus Events', short: 'Events', desc: 'Discover campus activities.', icon: 'calendar' },
  { slug: 'announcements', title: 'Announcements', short: 'Updates', desc: 'Read campus announcements.', icon: 'message' }
];

const demoListings = {
  marketplace: [
    { name: 'Wireless Earphones', category: 'Electronics', price: 850, description: 'Affordable earphones for students.' },
    { name: 'Campus Backpack', category: 'Fashion', price: 1200, description: 'A practical bag for books and laptops.' },
    { name: 'Scientific Calculator', category: 'Education', price: 650, description: 'Useful for mathematics and engineering students.' },
    { name: 'Second-hand Textbooks', category: 'Education', price: 400, description: 'Save money on your study materials.' }
  ],
  food: [
    { name: 'Chips and Sausage', category: 'Snacks', price: 150, description: 'Fresh chips served with sausage.' },
    { name: 'Chapati and Beans', category: 'Meals', price: 100, description: 'A filling student-friendly meal.' },
    { name: 'Pilau', category: 'Meals', price: 180, description: 'A tasty Kenyan rice dish.' },
    { name: 'Fresh Juice', category: 'Drinks', price: 100, description: 'A refreshing fruit drink.' },
    { name: 'Smokie', category: 'Snacks', price: 40, description: 'A quick snack between classes.' }
  ],
  hostels: [
    { name: 'Single Student Room', category: 'Accommodation', price: 5000, description: 'Example monthly rent. Confirm availability with the owner.' },
    { name: 'Shared Student Room', category: 'Shared housing', price: 3000, description: 'Example monthly rent per student.' }
  ],
  jobs: [
    { name: 'Part-time Shop Assistant', category: 'Part-time', price: 0, description: 'Demo listing. Verify the employer and terms.' },
    { name: 'Campus Sales Assistant', category: 'Flexible', price: 0, description: 'Demo opportunity for interested students.' }
  ],
  internships: [
    { name: 'Industrial Attachment', category: 'Attachment', price: 0, description: 'Check course requirements and application deadlines.' },
    { name: 'Graduate Internship', category: 'Internship', price: 0, description: 'Explore entry-level career experience.' }
  ],
  'lost-found': [
    { name: 'Lost Student ID', category: 'Lost', price: 0, description: 'Post a notice without sharing sensitive ID details.' },
    { name: 'Found Water Bottle', category: 'Found', price: 0, description: 'Contact the owner to arrange collection.' }
  ],
  events: [
    { name: 'Student Networking Event', category: 'Networking', price: 0, description: 'Meet other students and share ideas.' },
    { name: 'Campus Talent Show', category: 'Entertainment', price: 0, description: 'Celebrate student creativity.' }
  ],
  announcements: [
    { name: 'Welcome to Campus Connect', category: 'Notice', price: 0, description: 'Your student community starts here.' },
    { name: 'Share Campus Updates', category: 'Community', price: 0, description: 'Help keep students informed.' }
  ]
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function money(amount) {
  return 'KSh ' + Number(amount).toLocaleString('en-KE');
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem('cc_profile')) || {
      name: '',
      college: '',
      course: '',
      year: ''
    };
  } catch {
    return { name: '', college: '', course: '', year: '' };
  }
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('cc_orders')) || [];
  } catch {
    return [];
  }
}

function header() {
  return `
    <div class="topline">
      <div class="wrap">
        <span>Built for students, by students</span>
        <span>Kenya · Your campus, connected</span>
      </div>
    </div>

    <header class="header">
      <div class="wrap headrow">
        <a class="brand" href="#home">
          <span class="logo">CC</span>
          <span>
            <span class="brand-name">Campus Connect</span><br>
            <span class="brand-tag">YOUR CAMPUS. YOUR COMMUNITY.</span>
          </span>
        </a>

        <button class="mobile-menu" id="menuBtn"
          aria-label="Open navigation">☰ Menu</button>

        <nav class="nav" id="nav">
          <a href="#home" data-route="home">Home</a>
          <a href="#marketplace" data-route="marketplace">Marketplace</a>
          <a href="#food" data-route="food">Food</a>
          <a href="#profile" data-route="profile">Profile</a>
          <a href="#hostels" data-route="hostels">Hostels</a>
          <a href="#jobs" data-route="jobs">Jobs</a>
          <a href="#events" data-route="events">Events</a>
          <a href="#announcements" data-route="announcements">Updates</a>
        </nav>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <div class="wrap">
        <span>© ${new Date().getFullYear()} Campus Connect Kenya</span>
        <span>Connecting students across Kenya.</span>
      </div>
    </footer>
  `;
}

function featureCards() {
  return `
    <div class="feature-grid">
      ${sections.map(section => `
        <a class="feature" href="#${section.slug}">
          <span class="iconbox">${icon(section.icon)}</span>
          <h3>${section.title}</h3>
          <p>${section.desc}</p>
        </a>
      `).join('')}
    </div>
  `;
}

function home() {
  const profile = getProfile();

  return `
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <span class="pill">Kenya's student community</span>
          <h1>Your campus.<br><span class="gold">Your opportunities.</span></h1>
          <p>
            Meet your student community, discover affordable food,
            buy and sell products, and explore opportunities across Kenya.
          </p>
          <div class="actions">
            <a class="btn" href="#marketplace">Explore Marketplace ${icon('arrow')}</a>
            <a class="btn outline" href="#food">Find Food</a>
          </div>
        </div>

        <aside class="hero-panel">
          <h3>${profile.name ? 'Welcome, ' + escapeHTML(profile.name) + '!' : 'Welcome to Campus Connect'}</h3>
          <p>Your student life, brought together in one place.</p>
          <div class="stats">
            <div class="stat"><b>Buy & Sell</b><span>Student marketplace</span></div>
            <div class="stat"><b>Order Food</b><span>Discover local menus</span></div>
            <div class="stat"><b>Find Jobs</b><span>Explore opportunities</span></div>
            <div class="stat"><b>Connect</b><span>Campus community</span></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head">
        <div>
          <h2>Explore Campus Connect</h2>
          <p>Everything students need, in one place.</p>
        </div>
      </div>
      ${featureCards()}
    </section>

    <section class="section wrap">
      <div class="banner">
        <div>
          <h2>Make your student life easier</h2>
          <p>Explore products, food, housing and campus opportunities.</p>
        </div>
        <a class="btn" href="#profile">Set Up Your Profile ${icon('arrow')}</a>
      </div>
      <div class="notice">
        Demo listings are examples only. Verify sellers, vendors and opportunities
        before sending money.
      </div>
    </section>
  `;
}

function listingCard(item, slug, index) {
  const isFood = slug === 'food';
  const isMarketplace = slug === 'marketplace';
  const showPrice = item.price > 0;

  return `
    <article class="card"
      data-search="${escapeHTML((item.name + ' ' + item.category + ' ' + item.description).toLowerCase())}">
      <span class="tag">${escapeHTML(item.category)}</span>
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.description)}</p>

      ${showPrice ? `<div class="meta">${money(item.price)}${slug === 'hostels' ? ' / month (example)' : ''}</div>` : ''}

      ${isFood || isMarketplace ? `
        <button class="btn order-btn" data-index="${index}" data-section="${slug}">
          ${isFood ? 'Add to Order' : 'Enquire / Buy'}
        </button>
      ` : `
        <button class="btn outline enquire" data-topic="${escapeHTML(item.name)}">
          Enquire
        </button>
      `}
    </article>
  `;
}

function listingPage(slug) {
  const titles = {
    marketplace: 'Campus Marketplace',
    food: 'Campus Food',
    hostels: 'Hostels & Accommodation',
    jobs: 'Campus Jobs',
    internships: 'Internships & Attachments',
    'lost-found': 'Lost & Found',
    events: 'Campus Events',
    announcements: 'Announcements'
  };

  const items = demoListings[slug] || [];
  const title = titles[slug] || 'Campus Connect';
  const food = slug === 'food';

  return `
    <section class="page-hero">
      <div class="wrap">
        <div class="crumb"><a href="#home">Home</a> / ${title}</div>
        <h1 class="page-title">${title}</h1>
        <p class="sub">${food
          ? 'Discover meals, snacks and drinks. Add items to your order.'
          : 'Explore listings and opportunities for students.'}</p>
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head">
        <div>
          <h2>${food ? 'Available Menu' : 'Explore Listings'}</h2>
          <p>Search the sample listings below.</p>
        </div>
      </div>

      <div class="searchbar">
        <input id="searchInput" type="search"
          placeholder="Search ${title.toLowerCase()}..."
          aria-label="Search listings">
        <select id="sortSelect" aria-label="Filter category">
          <option value="all">All categories</option>
          ${[...new Set(items.map(item => item.category))].map(category =>
            `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
          ).join('')}
        </select>
      </div>

      <div class="cards" id="listingCards">
        ${items.map((item, index) => listingCard(item, slug, index)).join('')}
      </div>

      <div class="empty" id="emptyState">No matching items found.</div>

      ${food ? foodCart() : ''}

      <div class="notice">
        These are demo listings. Prices and availability are not verified.
        Confirm details with the seller or vendor before paying.
      </div>
    </section>
  `;
}

function foodCart() {
  const orders = getOrders();
  const foodOrders = orders.filter(order => order.type === 'food');

  const total = foodOrders.reduce((sum, order) =>
    sum + order.price * order.quantity, 0);

  return `
    <section class="section">
      <div class="panel">
        <h2>Your Food Order</h2>
        <div id="cartItems">
          ${foodOrders.length ? foodOrders.map((order, index) => `
            <p>${escapeHTML(order.name)} × ${order.quantity}
              — ${money(order.price * order.quantity)}
              <button class="btn outline remove-order" data-index="${index}">Remove</button>
            </p>
          `).join('') : '<p class="sub">Your order is empty. Add food from the menu.</p>'}
        </div>

        <h3>Total: ${money(total)}</h3>

        <label for="paymentMethod">Payment method</label>
        <select id="paymentMethod">
          <option value="Cash">Cash on delivery / collection</option>
          <option value="MPesa">M-Pesa</option>
        </select>

        <div class="actions">
          <button class="btn" id="checkoutBtn">Place Demo Order</button>
          <button class="btn outline" id="clearCartBtn">Clear Order</button>
        </div>

        <p class="smallprint">
          M-Pesa is not connected yet. Selecting M-Pesa here does not charge you.
        </p>
      </div>
    </section>
  `;
}

function profilePage() {
  const profile = getProfile();
  const orders = getOrders();

  return `
    <section class="page-hero">
      <div class="wrap">
        <div class="crumb"><a href="#home">Home</a> / Profile</div>
        <h1 class="page-title">Student Profile</h1>
        <p class="sub">Manage your personal campus information.</p>
      </div>
    </section>

    <section class="section wrap">
      <div class="panel">
        <h2>Your Details</h2>
        <form id="profileForm">
          <p>
            <label for="studentName">Full name</label>
            <input id="studentName" name="name" required maxlength="80"
              placeholder="Enter your name" value="${escapeHTML(profile.name)}">
          </p>
          <p>
            <label for="college">College or university</label>
            <input id="college" name="college" maxlength="120"
              placeholder="Your institution" value="${escapeHTML(profile.college)}">
          </p>
          <p>
            <label for="course">Course</label>
            <input id="course" name="course" maxlength="120"
              placeholder="Your course" value="${escapeHTML(profile.course)}">
          </p>
          <p>
            <label for="studyYear">Year of study</label>
            <select id="studyYear" name="year">
              ${['', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Other'].map(year =>
                `<option value="${year}" ${profile.year === year ? 'selected' : ''}>${year || 'Select year'}</option>`
              ).join('')}
            </select>
          </p>
          <button class="btn" type="submit">Save Profile</button>
          <p id="profileMessage" class="sub" aria-live="polite"></p>
        </form>
      </div>

      <section class="section">
        <div class="panel">
          <h2>Your Recent Orders</h2>
          ${orders.length
            ? orders.map(order => `
              <p>${escapeHTML(order.name)} — ${money(order.price * order.quantity)}
                <span class="tag">${escapeHTML(order.type)}</span>
              </p>
            `).join('')
            : '<p class="sub">No orders saved on this device yet.</p>'}
        </div>
      </section>

      <div class="notice">
        This prototype saves profile and demo order information in this browser
        only. It does not create a secure student account or share data between devices.
      </div>
    </section>
  `;
}

function enquire(topic) {
  const message = 'Hello Campus Connect, I am interested in: ' + topic;
  const url = 'https://wa.me/?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener');
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('cc_orders', JSON.stringify(orders));
}

function render() {
  const slug = location.hash.slice(1) || 'home';

  let content;

  if (slug === 'home') {
    content = home();
  } else if (slug === 'profile') {
    content = profilePage();
  } else if (demoListings[slug]) {
    content = listingPage(slug);
  } else {
    content = home();
  }

  app.innerHTML = header() + content + footer();

  const titles = {
    home: 'Home',
    profile: 'Profile',
    marketplace: 'Marketplace',
    food: 'Food',
    hostels: 'Hostels',
    jobs: 'Jobs',
    internships: 'Internships',
    'lost-found': 'Lost & Found',
    events: 'Events',
    announcements: 'Announcements'
  };

  document.title = (titles[slug] || 'Home') + ' | Campus Connect';

  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('nav')?.classList.toggle('open');
  });

  document.querySelectorAll('.nav a').forEach(link => {
    if (link.dataset.route === slug) link.classList.add('active');

    link.addEventListener('click', () => {
      document.getElementById('nav')?.classList.remove('open');
    });
  });

  const search = document.getElementById('searchInput');
  const category = document.getElementById('sortSelect');

  function filterListings() {
    const query = (search?.value || '').toLowerCase();
    const selected = category?.value || 'all';
    let visible = 0;

    document.querySelectorAll('#listingCards .card').forEach(card => {
      const matchesText = card.dataset.search.includes(query);
      const tag = card.querySelector('.tag')?.textContent || '';
      const matchesCategory = selected === 'all' || tag === selected;

      card.style.display = matchesText && matchesCategory ? '' : 'none';
      if (matchesText && matchesCategory) visible++;
    });

    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  }

  search?.addEventListener('input', filterListings);
  category?.addEventListener('change', filterListings);

  document.querySelectorAll('.enquire').forEach(button => {
    button.addEventListener('click', () => enquire(button.dataset.topic));
  });

  document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.section;
      const index = Number(button.dataset.index);
      const item = demoListings[type]?.[index];

      if (!item) return;

      if (type === 'marketplace') {
        enquire(item.name + ' (' + money(item.price) + ')');
        return;
      }

      const orders = getOrders();
      const existing = orders.find(order =>
        order.type === 'food' && order.name === item.name
      );

      if (existing) {
        existing.quantity += 1;
        localStorage.setItem('cc_orders', JSON.stringify(orders));
      } else {
        saveOrder({
          type: 'food',
          name: item.name,
          price: item.price,
          quantity: 1
        });
      }

      render();
    });
  });

  document.querySelectorAll('.remove-order').forEach(button => {
    button.addEventListener('click', () => {
      const orders = getOrders();
      const foodOrders = orders.filter(order => order.type === 'food');
      const removed = foodOrders[Number(button.dataset.index)];

      const remaining = orders.filter(order => order !== removed);
      localStorage.setItem('cc_orders', JSON.stringify(remaining));
      render();
    });
  });

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    const remaining = getOrders().filter(order => order.type !== 'food');
    localStorage.setItem('cc_orders', JSON.stringify(remaining));
    render();
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const orders = getOrders().filter(order => order.type === 'food');

    if (!orders.length) {
      alert('Please add food to your order first.');
      return;
    }

    const payment = document.getElementById('paymentMethod')?.value || 'Cash';

    if (payment === 'MPesa') {
      alert('M-Pesa is not connected yet. No payment has been made. Please select cash for this demo.');
      return;
    }

    alert('Demo order saved! Arrange payment and collection directly with the vendor. No real payment has been made.');
    location.hash = 'profile';
  });

  document.getElementById('profileForm')?.addEventListener('submit', event => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const profile = {
      name: String(form.get('name') || '').trim(),
      college: String(form.get('college') || '').trim(),
      course: String(form.get('course') || '').trim(),
      year: String(form.get('year') || '')
    };

    localStorage.setItem('cc_profile', JSON.stringify(profile));

    const message = document.getElementById('profileMessage');
    if (message) message.textContent = 'Profile saved on this device.';

    render();

    const updatedMessage = document.getElementById('profileMessage');
    if (updatedMessage) updatedMessage.textContent = 'Profile saved on this device.';
  });
}

window.addEventListener('hashchange', render);
render();
