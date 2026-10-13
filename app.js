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
        <CAMPUS CONNECT<br>
9*{box-sizing:border-box} :root{--bg:#090909;--panel:#141414;--panel2:#1d1d1d;--gold:#d9b34b;--gold2:#f2d77d;--text:#f7f5ee;--muted:#b6b2a5;--line:#393224;--green:#25d366}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.55}a{color:inherit;text-decoration:none}button,input,select,textarea{font:inherit}.wrap{width:min(1120px,92%);margin:auto}.topline{background:#111;border-bottom:1px solid var(--line);font-size:.8rem;color:var(--muted);padding:7px 0}.topline .wrap{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.header{position:sticky;top:0;z-index:10;background:#0b0b0bf2;backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.headrow{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;min-width:max-content}.logo{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold2),#9e7419);color:#111;font-weight:950;font-size:1.1rem}.brand-name{font-size:1.1rem;font-weight:850;line-height:1.15}.brand-tag{font-size:.63rem;letter-spacing:.13em;color:var(--gold);margin-top:3px}.nav{display:flex;align-items:center;justify-content:flex-end;gap:5px;flex-wrap:wrap}.nav a{padding:8px 10px;border-radius:9px;color:#e8e3d7;font-size:.84rem}.nav a:hover,.nav a.active{background:#2a2417;color:var(--gold2)}.nav .nav-cta{background:var(--gold);color:#111;font-weight:800}.hero{padding:55px 0 38px;background:radial-gradient(ellipse at 80% 10%,#72581f3d,transparent 40%),linear-gradient(180deg,#111,transparent)}.hero-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:32px;align-items:center}.pill{display:inline-flex;border:1px solid #6d5726;border-radius:99px;padding:5px 11px;color:var(--gold2);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}.hero h1{font-size:clamp(2.4rem,5.6vw,4.4rem);line-height:1.02;letter-spacing:-.045em;margin:17px 0}.gold{color:var(--gold)}.hero p{color:var(--muted);max-width:620px}.btn{border:1px solid var(--gold);background:var(--gold);color:#111;border-radius:10px;padding:11px 15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;cursor:pointer}.btn:hover{filter:brightness(1.08);transform:translateY(-1px)}.btn.outline{background:transparent;color:var(--gold2)}.btn.whatsapp{background:var(--green);border-color:var(--green);color:#062a13}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:21px}.hero-panel,.panel{border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#1c1a14,#111);padding:22px}.hero-panel h3{color:var(--gold2);margin:0 0 7px}.hero-panel p{font-size:.9rem;margin:0 0 16px}.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.stat{border:1px solid #342b18;background:#0d0d0d;border-radius:12px;padding:12px}.stat b{display:block;font-size:1.2rem;color:var(--gold2)}.stat span{font-size:.77rem;color:var(--muted)}.section{padding:30px 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap;margin-bottom:18px}.section-head h2,.page-title{margin:0;font-size:clamp(1.55rem,3vw,2.1rem);line-height:1.15}.section-head p,.sub{color:var(--muted);margin:6px 0 0}.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.feature{display:block;padding:17px;border:1px solid var(--line);border-radius:15px;background:var(--panel);min-height:154px;transition:.2s}.feature:hover{transform:translateY(-3px);border-color:var(--gold);background:#19170f}.iconbox{width:44px;height:44px;display:grid;place-items:center;margin-bottom:13px;border:1px solid #5a4a25;background:linear-gradient(145deg,#292313,#171717);border-radius:12px;color:var(--gold2)}.iconbox svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.feature h3{font-size:1rem;margin:0 0 5px}.feature p{font-size:.82rem;color:var(--muted);margin:0}.section-icon{display:inline-flex;vertical-align:middle;align-items:center;justify-content:center;width:34px;height:34px;margin-right:8px;border:1px solid #5a4a25;background:#17150f;border-radius:10px;color:var(--gold2)}.section-icon svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{border:1px solid var(--line);background:var(--panel);border-radius:15px;padding:18px;display:flex;flex-direction:column;align-items:flex-start}.card h3{margin:2px 0 7px;font-size:1.05rem}.card p{margin:0 0 15px;color:var(--muted);font-size:.9rem;flex:1}.tag{display:inline-block;border:1px solid #6d5726;color:var(--gold2);border-radius:99px;padding:3px 9px;font-size:.7rem;margin-bottom:10px}.meta{font-size:.78rem;color:#d7cba9;margin-bottom:13px}.card .btn{width:100%;margin-top:auto}.banner{border:1px solid #705a24;border-radius:16px;background:linear-gradient(120deg,#211b0d,#121212);padding:23px;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}.banner h2{margin:0 0 5px}.banner p{margin:0;color:var(--muted);font-size:.9rem}.page-hero{padding:36px 0 24px;background:radial-gradient(ellipse at 80% 0%,#72581f2b,transparent 45%),#0e0e0e;border-bottom:1px solid var(--line)}.crumb{color:var(--gold2);font-size:.82rem;margin-bottom:12px}.searchbar{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}.searchbar input,.searchbar select{background:#151515;border:1px solid var(--line);border-radius:10px;padding:12px;color:var(--text);min-width:0}.searchbar input{flex:1;min-width:180px}.notice{border-left:3px solid var(--gold);background:#17150f;padding:13px 15px;border-radius:0 10px 10px 0;color:#d9d2bd;font-size:.86rem;margin-top:16px}.footer{border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:.83rem;margin-top:25px}.footer .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.mobile-menu{display:none;background:transparent;color:var(--gold2);border:1px solid var(--line);border-radius:9px;padding:8px}.empty{display:none;color:var(--muted);padding:20px;text-align:center}.smallprint{font-size:.78rem;color:var(--muted)}@media(max-width:900px){.headrow{align-items:flex-start;flex-wrap:wrap}.nav{justify-content:flex-start}.feature-grid{grid-template-columns:repeat(2,1fr)}.hero-grid{grid-template-columns:1fr .8fr}}@media(max-width:650px){.headrow{gap:12px}.brand{min-width:0}.mobile-menu{display:block;margin-left:auto}.nav{display:none;width:100%;flex-direction:column;align-items:stretch;padding:8px 0}.nav.open{display:flex}.nav a{padding:11px 12px}.hero{padding:35px 0 25px}.hero-grid{grid-template-columns:1fr}.hero h1{font-size:2.8rem}.cards{grid-template-columns:1fr}.feature-grid{gap:9px}.feature{padding:13px;min-height:143px}.section{padding:24px 0}.topline .wrap{font-size:.72rem}.page-hero{padding:28px 0 20px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none!important}}
/* CAMPUS CONNECT MOBILE NAVIGATION FIX */
@media (max-width: 650px) {
  .header .headrow {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .header .brand {
    min-width: 0;
    flex-shrink: 1;
  }

  .header .mobile-menu {
    display: block;
    flex-shrink: 0;
    margin-left: auto;
    background: #17150f;
    color: #f2d77d;
    border: 1px solid #d9b34b;
    border-radius: 9px;
    padding: 8px 12px;
    font-size: 22px;
    cursor: pointer;
  }

  .header .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 10px;
    background: #0b0b0b;
    border: 1px solid #393224;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 12px 24px #0009;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 20;
  }

  .header .nav.open {
    display: flex;
  }

  .header .nav a {
    display: block;
    padding: 12px;
    border-bottom: 1px solid #29251c;
  function getStyles() {
  return `
  <style>
    *{box-sizing:border-box}

    :root{
      --bg:#0A0A0A;
      --panel:#101010;
      --gold:#C6A15B;
      --gold-light:#E0C58A;
      --white:#F5F2EA;
      --muted:#BDBDBD;
      --line:#423722;
    }

    html{scroll-behavior:smooth}

    body{
      margin:0;
      background:var(--bg);
      color:var(--white);
      font-family:Arial,sans-serif;
      text-transform:uppercase;
    }

    input,select,button{font:inherit;text-transform:uppercase}

    .wrap{width:min(1120px,92%);margin:auto}

    .topline{
      background:#111;
      color:var(--gold);
      padding:10px;
      font-size:12px;
    }

    .header{
      background:var(--bg);
      border-bottom:1px solid var(--line);
      position:sticky;
      top:0;
      z-index:5;
    }

    .headrow{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:16px 0;
      flex-wrap:wrap;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      color:var(--white);
      text-decoration:none;
      font-weight:bold;
      .brand-tag{
      font-size:10px;
      color:var(--gold);
      letter-spacing:1.5px;
    }

    .nav{display:flex;gap:12px;flex-wrap:wrap}

    a{color:var(--gold-light)}

    .nav a{
      font-size:12px;
      text-decoration:none;
    }

    .nav a:hover{color:var(--white)}

    .mobile-menu{
      background:#181818;
      color:var(--gold);
      border:1px solid var(--line);
      border-radius:10px;
      padding:12px 16px;
    }

    .hero,.page-hero{
      padding:36px 0;
      background:var(--bg);
    }

    h1{
      font-size:clamp(30px,6vw,54px);
      line-height:1.12;
      color:var(--white);
    }

    h2{
      color:var(--white);
      font-size:clamp(22px,4vw,30px);
    }

    h3{color:var(--white)}

    p{
      line-height:1.8;
      color:var(--muted);
    }

    .gold,.meta{color:var(--gold-light)}

    .btn,button{
      display:inline-block;
      padding:12px 16px;
      border:1px solid var(--gold);
      background:var(--gold);
      color:#0A0A0A;
      text-decoration:none;
      cursor:pointer;
      border-radius:5px;
      font-weight:bold;
      transition:background .2s,border-color .2s;
    }

    .btn:hover,button:hover{
      background:var(--gold-light);
      border-color:var(--gold-light);
    }

    .outline{
      background:transparent;
      color:var(--gold-light);
    }

    .section{padding:30px 0}

    .feature-grid,.cards{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .feature,.card,.panel,.hero-panel{
      display:block;
      padding:20px;
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:10px;
      text-decoration:none;
      color:var(--white);
      min-width:0;
      transition:border-color .2s,background .2s;
    }

    .feature:hover,.card:hover{
      border-color:var(--gold);
      background:#15130F;
    }

    .feature h3,.card h3{
      color:var(--white);
      line-height:1.5;
    }

    .feature p,.card p{
      color:var(--muted);
      font-size:14px;
    }

    .tag,.pill{
      display:inline-block;
      border:1px solid var(--line);
      color:var(--gold-light);
      padding:7px 10px;
      font-size:11px;
      border-radius:20px;
    }

    input,select{
      width:100%;
      padding:12px;
      margin:6px 0 14px;
      background:#090909;
      color:var(--white);
      border:1px solid var(--line);
      border-radius:5px;
    }

    label{
      display:block;
      color:var(--gold-light);
      margin-top:10px;
    }

    .auth{
      max-width:500px;
      margin:30px auto;
      padding:24px;
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:10px;
    }

    .auth-links{
      display:flex;
      gap:16px;
      flex-wrap:wrap;
      margin:15px 0;
    }

    .notice{
      margin-top:22px;
      padding:14px;
      border:1px solid var(--line);
      border-radius:8px;
      color:var(--muted);
      font-size:12px;
    }

    .footer{
      border-top:1px solid var(--line);
      padding:24px 0;
      margin-top:40px;
      color:#999;
      font-size:12px;
    }

    .muted{font-size:12px;color:#999}

    @media(max-width:650px){
      .headrow{align-items:center}
      .nav{gap:10px}
      .hero{padding:26px 0}
      .feature-grid,.cards{gap:12px}
      .feature,.card{padding:15px}
      .feature h3,.card h3{font-size:15px}
      .feature p,.card p{font-size:12px}
    }

    @media(max-width:360px){
      .feature-grid,.cards{grid-template-columns:1fr}
    }
  </style>`;
      }9*{box-sizing:border-box} :root{--bg:#090909;--panel:#141414;--panel2:#1d1d1d;--gold:#d9b34b;--gold2:#f2d77d;--text:#f7f5ee;--muted:#b6b2a5;--line:#393224;--green:#25d366}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.55}a{color:inherit;text-decoration:none}button,input,select,textarea{font:inherit}.wrap{width:min(1120px,92%);margin:auto}.topline{background:#111;border-bottom:1px solid var(--line);font-size:.8rem;color:var(--muted);padding:7px 0}.topline .wrap{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.header{position:sticky;top:0;z-index:10;background:#0b0b0bf2;backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.headrow{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;min-width:max-content}.logo{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold2),#9e7419);color:#111;font-weight:950;font-size:1.1rem}.brand-name{font-size:1.1rem;font-weight:850;line-height:1.15}.brand-tag{font-size:.63rem;letter-spacing:.13em;color:var(--gold);margin-top:3px}.nav{display:flex;align-items:center;justify-content:flex-end;gap:5px;flex-wrap:wrap}.nav a{padding:8px 10px;border-radius:9px;color:#e8e3d7;font-size:.84rem}.nav a:hover,.nav a.active{background:#2a2417;color:var(--gold2)}.nav .nav-cta{background:var(--gold);color:#111;font-weight:800}.hero{padding:55px 0 38px;background:radial-gradient(ellipse at 80% 10%,#72581f3d,transparent 40%),linear-gradient(180deg,#111,transparent)}.hero-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:32px;align-items:center}.pill{display:inline-flex;border:1px solid #6d5726;border-radius:99px;padding:5px 11px;color:var(--gold2);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}.hero h1{font-size:clamp(2.4rem,5.6vw,4.4rem);line-height:1.02;letter-spacing:-.045em;margin:17px 0}.gold{color:var(--gold)}.hero p{color:var(--muted);max-width:620px}.btn{border:1px solid var(--gold);background:var(--gold);color:#111;border-radius:10px;padding:11px 15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;cursor:pointer}.btn:hover{filter:brightness(1.08);transform:translateY(-1px)}.btn.outline{background:transparent;color:var(--gold2)}.btn.whatsapp{background:var(--green);border-color:var(--green);color:#062a13}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:21px}.hero-panel,.panel{border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#1c1a14,#111);padding:22px}.hero-panel h3{color:var(--gold2);margin:0 0 7px}.hero-panel p{font-size:.9rem;margin:0 0 16px}.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.stat{border:1px solid #342b18;background:#0d0d0d;border-radius:12px;padding:12px}.stat b{display:block;font-size:1.2rem;color:var(--gold2)}.stat span{font-size:.77rem;color:var(--muted)}.section{padding:30px 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap;margin-bottom:18px}.section-head h2,.page-title{margin:0;font-size:clamp(1.55rem,3vw,2.1rem);line-height:1.15}.section-head p,.sub{color:var(--muted);margin:6px 0 0}.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.feature{display:block;padding:17px;border:1px solid var(--line);border-radius:15px;background:var(--panel);min-height:154px;transition:.2s}.feature:hover{transform:translateY(-3px);border-color:var(--gold);background:#19170f}.iconbox{width:44px;height:44px;display:grid;place-items:center;margin-bottom:13px;border:1px solid #5a4a25;background:linear-gradient(145deg,#292313,#171717);border-radius:12px;color:var(--gold2)}.iconbox svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.feature h3{font-size:1rem;margin:0 0 5px}.feature p{font-size:.82rem;color:var(--muted);margin:0}.section-icon{display:inline-flex;vertical-align:middle;align-items:center;justify-content:center;width:34px;height:34px;margin-right:8px;border:1px solid #5a4a25;background:#17150f;border-radius:10px;color:var(--gold2)}.section-icon svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{border:1px solid var(--line);background:var(--panel);border-radius:15px;padding:18px;display:flex;flex-direction:column;align-items:flex-start}.card h3{margin:2px 0 7px;font-size:1.05rem}.card p{margin:0 0 15px;color:var(--muted);font-size:.9rem;flex:1}.tag{display:inline-block;border:1px solid #6d5726;color:var(--gold2);border-radius:99px;padding:3px 9px;font-size:.7rem;margin-bottom:10px}.meta{font-size:.78rem;color:#d7cba9;margin-bottom:13px}.card .btn{width:100%;margin-top:auto}.banner{border:1px solid #705a24;border-radius:16px;background:linear-gradient(120deg,#211b0d,#121212);padding:23px;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}.banner h2{margin:0 0 5px}.banner p{margin:0;color:var(--muted);font-size:.9rem}.page-hero{padding:36px 0 24px;background:radial-gradient(ellipse at 80% 0%,#72581f2b,transparent 45%),#0e0e0e;border-bottom:1px solid var(--line)}.crumb{color:var(--gold2);font-size:.82rem;margin-bottom:12px}.searchbar{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}.searchbar input,.searchbar select{background:#151515;border:1px solid var(--line);border-radius:10px;padding:12px;color:var(--text);min-width:0}.searchbar input{flex:1;min-width:180px}.notice{border-left:3px solid var(--gold);background:#17150f;padding:13px 15px;border-radius:0 10px 10px 0;color:#d9d2bd;font-size:.86rem;margin-top:16px}.footer{border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:.83rem;margin-top:25px}.footer .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.mobile-menu{display:none;background:transparent;color:var(--gold2);border:1px solid var(--line);border-radius:9px;padding:8px}.empty{display:none;color:var(--muted);padding:20px;text-align:center}.smallprint{font-size:.78rem;color:var(--muted)}@media(max-width:900px){.headrow{align-items:flex-start;flex-wrap:wrap}.nav{justify-content:flex-start}.feature-grid{grid-template-columns:repeat(2,1fr)}.hero-grid{grid-template-columns:1fr .8fr}}@media(max-width:650px){.headrow{gap:12px}.brand{min-width:0}.mobile-menu{display:block;margin-left:auto}.nav{display:none;width:100%;flex-direction:column;align-items:stretch;padding:8px 0}.nav.open{display:flex}.nav a{padding:11px 12px}.hero{padding:35px 0 25px}.hero-grid{grid-template-columns:1fr}.hero h1{font-size:2.8rem}.cards{grid-template-columns:1fr}.feature-grid{gap:9px}.feature{padding:13px;min-height:143px}.section{padding:24px 0}.topline .wrap{font-size:.72rem}.page-hero{padding:28px 0 20px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none!important}}
/* CAMPUS CONNECT MOBILE NAVIGATION FIX */
@media (max-width: 650px) {
  .header .headrow {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .header .brand {
    min-width: 0;
    flex-shrink: 1;
  }

  .header .mobile-menu {
    display: block;
    flex-shrink: 0;
    margin-left: auto;
    background: #17150f;
    color: #f2d77d;
    border: 1px solid #d9b34b;
    border-radius: 9px;
    padding: 8px 12px;
    font-size: 22px;
    cursor: pointer;
  }

  .header .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 10px;
    background: #0b0b0b;
    border: 1px solid #393224;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 12px 24px #0009;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 20;
  }

  .header .nav.open {
    display: flex;
  }

  .header .nav a {
    display: block;
    padding: 12px;
    border-bottom: 1px solid #29251c;
  function getStyles() {
  return `
  <style>
    *{box-sizing:border-box}

    :root{
      --bg:#0A0A0A;
      --panel:#101010;
      --gold:#C6A15B;
      --gold-light:#E0C58A;
      --white:#F5F2EA;
      --muted:#BDBDBD;
      --line:#423722;
    }

    html{scroll-behavior:smooth}

    body{
      margin:0;
      background:var(--bg);
      color:var(--white);
      font-family:Arial,sans-serif;
      text-transform:uppercase;
    }

    input,select,button{font:inherit;text-transform:uppercase}

    .wrap{width:min(1120px,92%);margin:auto}

    .topline{
      background:#111;
      color:var(--gold);
      padding:10px;
      font-size:12px;
    }

    .header{
      background:var(--bg);
      border-bottom:1px solid var(--line);
      position:sticky;
      top:0;
      z-index:5;
    }

    .headrow{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:16px 0;
      flex-wrap:wrap;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      color:var(--white);
      text-decoration:none;
      font-weight:bold;
      .brand-tag{
      font-size:10px;
      color:var(--gold);
      letter-spacing:1.5px;
    }

    .nav{display:flex;gap:12px;flex-wrap:wrap}

    a{color:var(--gold-light)}

    .nav a{
      font-size:12px;
      text-decoration:none;
    }

    .nav a:hover{color:var(--white)}

    .mobile-menu{
      background:#181818;
      color:var(--gold);
      border:1px solid var(--line);
      border-radius:10px;
      padding:12px 16px;
    }

    .hero,.page-hero{
      padding:36px 0;
      background:var(--bg);
    }

    h1{
      font-size:clamp(30px,6vw,54px);
      line-height:1.12;
      color:var(--white);
    }

    h2{
      color:var(--white);
      font-size:clamp(22px,4vw,30px);
    }

    h3{color:var(--white)}

    p{
      line-height:1.8;
      color:var(--muted);
    }

    .gold,.meta{color:var(--gold-light)}

    .btn,button{
      display:inline-block;
      padding:12px 16px;
      border:1px solid var(--gold);
      background:var(--gold);
      color:#0A0A0A;
      text-decoration:none;
      cursor:pointer;
      border-radius:5px;
      font-weight:bold;
      transition:background .2s,border-color .2s;
    }

    .btn:hover,button:hover{
      background:var(--gold-light);
      border-color:var(--gold-light);
    }

    .outline{
      background:transparent;
      color:var(--gold-light);
    }

    .section{padding:30px 0}

    .feature-grid,.cards{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .feature,.card,.panel,.hero-panel{
      display:block;
      padding:20px;
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:10px;
      text-decoration:none;
      color:var(--white);
      min-width:0;
      transition:border-color .2s,background .2s;
    }

    .feature:hover,.card:hover{
      border-color:var(--gold);
      background:#15130F;
    }

    .feature h3,.card h3{
      color:var(--white);
      line-height:1.5;
    }

    .feature p,.card p{
      color:var(--muted);
      font-size:14px;
    }

    .tag,.pill{
      display:inline-block;
      border:1px solid var(--line);
      color:var(--gold-light);
      padding:7px 10px;
      font-size:11px;
      border-radius:20px;
    }

    input,select{
      width:100%;
      padding:12px;
      margin:6px 0 14px;
      background:#090909;
      color:var(--white);
      border:1px solid var(--line);
      border-radius:5px;
    }

    label{
      display:block;
      color:var(--gold-light);
      margin-top:10px;
    }

    .auth{
      max-width:500px;
      margin:30px auto;
      padding:24px;
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:10px;
    }

    .auth-links{
      display:flex;
      gap:16px;
      flex-wrap:wrap;
      margin:15px 0;
    }

    .notice{
      margin-top:22px;
      padding:14px;
      border:1px solid var(--line);
      border-radius:8px;
      color:var(--muted);
      font-size:12px;
    }

    .footer{
      border-top:1px solid var(--line);
      padding:24px 0;
      margin-top:40px;
      color:#999;
      font-size:12px;
    }

    .muted{font-size:12px;color:#999}

    @media(max-width:650px){
      .headrow{align-items:center}
      .nav{gap:10px}
      .hero{padding:26px 0}
      .feature-grid,.cards{gap:12px}
      .feature,.card{padding:15px}
      .feature h3,.card h3{font-size:15px}
      .feature p,.card p{font-size:12px}
    }

    @media(max-width:360px){
      .feature-grid,.cards{grid-template-columns:1fr}
    }
  </style>`;
        }
<a class="brand" href="#home">
  <img
    class="site-logo"
    src="campus-connect-logo.png"
    alt="Campus Connect — Your Campus, Your Community"
  >
</a>


<a class="brand" href="#home">
  <img
    class="site-logo"
    src="campus-connect-logo.png"
    alt="Campus Connect — Your Campus, Your Community"
  >
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
