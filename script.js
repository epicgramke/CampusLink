/* Campus Connect Kenya — complete front-end starter.
   Uses Supabase Auth and database when configured; otherwise provides a local demo mode.
   Only a Supabase publishable/anon key belongs in browser code. Never use service_role/secret keys here. */
'use strict';

const SUPABASE_URL = 'https://ojbzbkvruehrntdxktse.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA';
const DEMO_MODE = false; // Set true only if you intentionally want local demo data without backend auth.

const $ = (id) => document.getElementById(id);
const categories = {
  marketplace: { title: 'Marketplace', description: 'Buy and sell useful things with students around your campus.', icon: '🛍️' },
  food: { title: 'Food', description: 'Discover meals, snacks and food sellers near campus.', icon: '🍽️' },
  hostels: { title: 'Hostels', description: 'Find rooms, hostels and student accommodation.', icon: '🏠' },
  jobs: { title: 'Jobs', description: 'Explore part-time work and student-friendly opportunities.', icon: '💼' },
  internships: { title: 'Internships', description: 'Find attachments, internships and placements.', icon: '🎓' },
  'lost-found': { title: 'Lost & Found', description: 'Help reunite students with lost items.', icon: '🔎' }
};
const demoListings = [
  { id:'demo-1', category:'marketplace', title:'Study desk in good condition', description:'Compact desk suitable for a hostel room. Message for details.', price:2500, location:'Near campus', created_at:new Date(Date.now()-3600000).toISOString(), contact_email:'' },
  { id:'demo-2', category:'food', title:'Fresh chapati and beans', description:'Affordable lunch portions available around lunchtime.', price:120, location:'Campus area', created_at:new Date(Date.now()-7200000).toISOString(), contact_email:'' },
  { id:'demo-3', category:'hostels', title:'Single room available', description:'Ask for rent, amenities and viewing details before making payment.', price:null, location:'Near campus', created_at:new Date(Date.now()-86400000).toISOString(), contact_email:'' },
  { id:'demo-4', category:'jobs', title:'Weekend shop assistant', description:'Part-time opportunity. Confirm the employer and terms before accepting.', price:null, location:'Local area', created_at:new Date(Date.now()-172800000).toISOString(), contact_email:'' },
  { id:'demo-5', category:'internships', title:'IT attachment opportunity', description:'Entry-level placement information. Ask for official application details.', price:null, location:'Kenya', created_at:new Date(Date.now()-259200000).toISOString(), contact_email:'' },
  { id:'demo-6', category:'lost-found', title:'Found student notebook', description:'Found near a study area. Describe the cover to identify it.', price:null, location:'Campus', created_at:new Date(Date.now()-345600000).toISOString(), contact_email:'' }
];

let supabase = null;
let currentUser = null;
let profile = null;
let listings = [...demoListings];
let authMode = 'login';
let currentView = 'auth';
let toastTimer;

function client() {
  if (DEMO_MODE) return null;
  if (!window.supabase || !window.supabase.createClient) throw new Error('Supabase library could not load. Check your internet connection and reload.');
  if (!supabase) supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } });
  return supabase;
}
function status(el, message, kind='error') {
  el.textContent = message; el.className = `status show ${kind}`;
}
function clearStatus(el) { el.textContent=''; el.className='status'; }
function toast(message) {
  const box=$('toast'); box.textContent=message; box.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.classList.remove('show'),3200);
}
function safe(value='') {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function money(price) {
  if (price === null || price === undefined || price === '') return 'Contact for price';
  return `KES ${Number(price).toLocaleString('en-KE')}`;
}
function niceDate(value) {
  try { return new Intl.DateTimeFormat('en-KE',{day:'numeric',month:'short'}).format(new Date(value)); } catch { return ''; }
}
function categoryIcon(category) { return categories[category]?.icon || '✦'; }

function setAuthMode(mode) {
  authMode=mode;
  const signup=mode==='signup';
  $('login-tab').classList.toggle('selected',!signup);
  $('signup-tab').classList.toggle('selected',signup);
  $('login-tab').setAttribute('aria-selected',String(!signup));
  $('signup-tab').setAttribute('aria-selected',String(signup));
  $('auth-title').innerHTML=signup?'Join <span>Campus Connect!</span>':'Welcome back!';
  $('auth-subtitle').textContent=signup?'Create your student community account.':'Log in to your campus community.';
  $('auth-submit').innerHTML=signup?'Create Account <span>→</span>':'Log In <span>→</span>';
  document.querySelectorAll('.signup-only').forEach(el=>el.classList.toggle('hidden',!signup));
  $('auth-extra').classList.toggle('hidden',signup);
  $('auth-password').autocomplete=signup?'new-password':'current-password';
  $('auth-name').required=signup;
  $('auth-switch').innerHTML=signup?'Already have an account? <button class="link-button" id="switch-auth" type="button">Log in</button>':`Don't have an account? <button class="link-button" id="switch-auth" type="button">Sign up</button>`;
$('auth-switch').addEventListener('click', (event) => {
  if (event.target.closest('#switch-auth')) {
    setAuthMode(
      document.querySelector('.signup-only')?.classList.contains('hidden')
        ? 'signup'
        : 'login'
    );
  }
});
  clearStatus($('auth-status'));
}
$('login-tab').addEventListener('click',()=>setAuthMode('login'));
$('signup-tab').addEventListener('click',()=>setAuthMode('signup'));
$('switch-auth').addEventListener('click',()=>setAuthMode('signup'));
$('reveal-password').addEventListener('click',()=>{const input=$('auth-password');input.type=input.type==='password'?'text':'password';});
$('year').textContent=new Date().getFullYear();

function showView(name) {
  const allowed=['auth','home','marketplace','food','hostels','jobs','internships','lost-found','profile'];
  if(!allowed.includes(name)) name='home';
  if(name!=='auth'&&!currentUser&&!DEMO_MODE){name='auth';toast('Log in or create an account to continue.');}
  currentView=name;
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  const element=$(name==='auth'?'auth-view':name==='home'?'home-view':name==='profile'?'profile-view':'listing-view');
  element.classList.add('active');
  if(name!=='auth'&&name!=='home'&&name!=='profile') renderCategory(name);
  if(name==='home') renderHomeListings();
  if(name==='profile') renderProfile();
  document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===name || (name==='auth'&&el.dataset.nav==='home')));
  $('topnav').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
}
function navigate(name) { if(name==='auth'){showView('auth');return;} showView(name); }
function renderListingCard(item) {
  const cat=categories[item.category]||{title:'Campus',icon:'✦'};
  const description=String(item.description||'').slice(0,130);
  return `<article class="listing-card"><div class="listing-art">${categoryIcon(item.category)}</div><div class="listing-body"><span class="listing-category">${safe(cat.title)}</span><h3>${safe(item.title)}</h3><p>${safe(description)}</p><div class="listing-meta"><span>${safe(item.location||'Campus community')} · ${safe(niceDate(item.created_at))}</span><span class="price">${safe(money(item.price))}</span></div>${item.contact_email?`<button class="button outline contact-button" data-contact="${safe(item.contact_email)}">Contact poster</button>`:''}</div></article>`;
}
function renderHomeListings() {
  const el=$('home-listings'); const latest=[...listings].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,3);
  el.innerHTML=latest.map(renderListingCard).join('');
  if(!latest.length) el.innerHTML='<p class="muted">No listings yet. Create the first post!</p>';
}
function renderCategory(category) {
  const info=categories[category]||categories.marketplace;
  $('listing-kicker').textContent='EXPLORE CAMPUS LIFE';
  $('listing-title').textContent=info.title;
  $('listing-description').textContent=info.description;
  $('listing-search').value='';
  const results=listings.filter(x=>x.category===category);
  drawListingResults(results);
}
function drawListingResults(items) {
  const el=$('listing-results'); const empty=$('listing-empty');
  el.innerHTML=items.map(renderListingCard).join('');
  empty.classList.toggle('hidden',items.length!==0);
  el.classList.toggle('hidden',items.length===0);
}
function filteredCurrentCategory() {
  const category=currentView;
  const q=$('listing-search').value.trim().toLowerCase();
  let items=listings.filter(item=>item.category===category && `${item.title} ${item.description} ${item.location}`.toLowerCase().includes(q));
  if($('listing-sort').value==='oldest') items.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  else items.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  return items;
}
$('listing-search').addEventListener('input',()=>drawListingResults(filteredCurrentCategory()));
$('listing-sort').addEventListener('change',()=>drawListingResults(filteredCurrentCategory()));

async function loadListings() {
  if(DEMO_MODE) { listings=[...demoListings]; return; }
  try {
    const sb=client();
    const {data,error}=await sb.from('listings').select('*').eq('is_active',true).order('created_at',{ascending:false}).limit(100);
    if(error) throw error;
    listings=data||[];
  } catch(error) {
    console.warn('Could not load Supabase listings:',error.message);
    listings=[...demoListings];
    if(currentUser) toast('Database listings are not configured yet; showing sample listings.');
  }
}
async function loadProfile() {
  if(!currentUser) {profile=null;return;}
  const metadata=currentUser.user_metadata||{};
  profile={id:currentUser.id,display_name:metadata.display_name||metadata.full_name||currentUser.email?.split('@')[0]||'Campus member',campus:metadata.campus||''};
  if(DEMO_MODE) return;
  try {
    const {data,error}=await client().from('profiles').select('id,display_name,campus,email').eq('id',currentUser.id).maybeSingle();
    if(error) throw error;
    if(data) profile={...profile,...data};
  } catch(error) { console.warn('Profile table may need setup:',error.message); }
}
async function refreshApp() {
  await loadProfile(); await loadListings();
  if(currentUser){showView('home');renderProfile();}else showView(DEMO_MODE?'home':'auth');
}
function renderProfile() {
  const name=profile?.display_name||currentUser?.email?.split('@')[0]||'Campus member';
  $('profile-name').textContent=name;
  $('profile-email').textContent=currentUser?.email||'Demo preview';
  $('profile-campus').textContent=profile?.campus||'Add your college or university';
  $('profile-avatar').textContent=(name.trim()[0]||'C').toUpperCase();
  $('edit-name').value=profile?.display_name||'';
  $('edit-campus').value=profile?.campus||'';
  const mine=listings.filter(x=>x.user_id===currentUser?.id || (DEMO_MODE&&String(x.id).startsWith('demo-')));
  $('my-listings').innerHTML=mine.map(renderListingCard).join('')||'<p class="muted">You have not posted anything yet.</p>';
}

$('auth-form').addEventListener('submit',async event=>{
  event.preventDefault();clearStatus($('auth-status'));
  const email=$('auth-email').value.trim(),password=$('auth-password').value;
  if(!email||!$('auth-email').checkValidity())return status($('auth-status'),'Enter a valid email address.');
  if(password.length<6)return status($('auth-status'),'Password must be at least 6 characters.');
  const btn=$('auth-submit');btn.disabled=true;btn.textContent=authMode==='login'?'Logging in…':'Creating account…';
  try{
    if(DEMO_MODE){currentUser={id:'demo-user',email,user_metadata:{display_name:$('auth-name').value.trim()||'Demo Student',campus:$('auth-campus').value.trim()}};profile={display_name:currentUser.user_metadata.display_name,campus:currentUser.user_metadata.campus};status($('auth-status'),'Demo mode: you are signed in locally. Configure Supabase for real accounts.','success');setTimeout(()=>showView('home'),600);return;}
    const sb=client();
    if(authMode==='login'){
      const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;
      currentUser=data.user;await refreshApp();toast('Welcome back!');
    }else{
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:$('auth-name').value.trim(),campus:$('auth-campus').value.trim()},emailRedirectTo:location.origin+location.pathname}});if(error)throw error;
      if(data.session){currentUser=data.user;await refreshApp();toast('Account created successfully.');}
      else status($('auth-status'),'Account created. Check your email for the confirmation link, then log in.','success');
    }
  }catch(error){status($('auth-status'),friendlyError(error));}
  finally{btn.disabled=false;btn.innerHTML=authMode==='signup'?'Create Account <span>→</span>':'Log In <span>→</span>';}
});
function friendlyError(error){const m=error?.message||'Something went wrong. Please try again.';if(/invalid login credentials/i.test(m))return'Email or password is incorrect.';if(/email not confirmed/i.test(m))return'Confirm your email using the link we sent, then log in.';if(/user already registered/i.test(m))return'This email already has an account. Try logging in.';if(/rate limit/i.test(m))return'Too many attempts. Wait a little and try again.';return m;}
$('google-login').addEventListener('click',async()=>{
  try{if(DEMO_MODE){toast('Google sign-in requires Supabase and Google OAuth configuration.');return;}const {error}=await client().auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)throw error;}
  catch(error){status($('auth-status'),friendlyError(error));}
});
$('forgot-password').addEventListener('click',async()=>{
  const email=$('auth-email').value.trim();if(!email||!$('auth-email').checkValidity())return status($('auth-status'),'Enter your email address first.');
  try{const {error}=await client().auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error)throw error;status($('auth-status'),'If password recovery is enabled, a reset link has been sent. Check your inbox and spam folder.','success');}
  catch(error){status($('auth-status'),friendlyError(error));}
});
async function createListing(values) {
  const item={id:`local-${Date.now()}`,...values,created_at:new Date().toISOString(),user_id:currentUser?.id||null};
  if(DEMO_MODE){listings.unshift(item);return item;}
  const {data,error}=await client().from('listings').insert({...values,user_id:currentUser.id,is_active:true}).select().single();
  if(error)throw error;listings.unshift(data);return data;
}
$('create-post-button').addEventListener('click',openPostDialog);
document.querySelectorAll('[data-action="create-post"]').forEach(el=>el.addEventListener('click',openPostDialog));
function openPostDialog() {
  if(!currentUser&&!DEMO_MODE){toast('Please log in before posting.');showView('auth');return;}
  $('post-form').reset();$('post-category').value=categories[currentView]?currentView:'marketplace';
  $('post-contact').value=currentUser?.email||'';
  clearStatus($('post-status'));$('post-dialog').showModal();
}
$('post-form').addEventListener('submit',async event=>{
  event.preventDefault();clearStatus($('post-status'));
  const title=$('post-title').value.trim(),description=$('post-description').value.trim();
  if(!title||!description)return status($('post-status'),'Please fill in the title and description.');
  const values={title,description,category:$('post-category').value,price:$('post-price').value===''?null:Number($('post-price').value),location:$('post-location').value.trim(),contact_email:$('post-contact').value.trim()||currentUser?.email||null};
  const btn=$('save-post-button');btn.disabled=true;btn.textContent='Publishing…';
  try{await createListing(values);$('post-dialog').close();renderHomeListings();if(categories[currentView])renderCategory(currentView);if(currentView==='profile')renderProfile();toast(DEMO_MODE?'Listing added to this preview.':'Listing published successfully.');}
  catch(error){status($('post-status'),`Could not publish listing: ${friendlyError(error)}. Check the Supabase setup guide.`);}
  finally{btn.disabled=false;btn.textContent='Publish listing →';}
});
$('edit-profile-button').addEventListener('click',()=>{clearStatus($('profile-status'));$('profile-dialog').showModal();});
$('profile-form').addEventListener('submit',async event=>{
  event.preventDefault();const display_name=$('edit-name').value.trim(),campus=$('edit-campus').value.trim();
  try{
    if(!display_name)return status($('profile-status'),'Enter your display name.');
    if(DEMO_MODE){profile={...profile,display_name,campus};currentUser.user_metadata={...currentUser.user_metadata,display_name,campus};}
    else{
      const {error:authError}=await client().auth.updateUser({data:{display_name,campus}});if(authError)throw authError;
      const {error}=await client().from('profiles').upsert({id:currentUser.id,email:currentUser.email,display_name,campus,updated_at:new Date().toISOString()});if(error)throw error;
      profile={...profile,display_name,campus};
    }
    $('profile-dialog').close();renderProfile();toast('Profile updated.');
  }catch(error){status($('profile-status'),friendlyError(error));}
});
$('logout-button').addEventListener('click',async()=>{
  try{if(!DEMO_MODE){const {error}=await client().auth.signOut();if(error)throw error;}currentUser=null;profile=null;showView('auth');toast('You have logged out.');}
  catch(error){toast(friendlyError(error));}
});
$('nav-account').addEventListener('click',()=>currentUser?showView('profile'):showView('auth'));
$('menu-toggle').addEventListener('click',()=>{const open=$('topnav').classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',event=>{
  const go=event.target.closest('[data-go]');if(go){showView(go.dataset.go);return;}
  const nav=event.target.closest('[data-nav]');if(nav){event.preventDefault();showView(nav.dataset.nav);return;}
  const contact=event.target.closest('[data-contact]');if(contact){location.href=`mailto:${encodeURIComponent(contact.dataset.contact)}`;return;}
  const close=event.target.closest('[data-close-dialog]');if(close)close.closest('dialog')?.close();
});
function globalSearch() {
  const q=$('global-search').value.trim().toLowerCase();
  if(!q){showView('marketplace');return;}
  const results=listings.filter(x=>`${x.title} ${x.description} ${x.location} ${categories[x.category]?.title||''}`.toLowerCase().includes(q));
  showView('marketplace');
  $('listing-title').textContent='Search results';
  $('listing-description').textContent=`Results for “${q}”`;
  $('listing-search').value=q;
  $('listing-results').innerHTML=results.map(renderListingCard).join('');
  $('listing-empty').classList.toggle('hidden',results.length!==0);
  $('listing-results').classList.toggle('hidden',results.length===0);
}
$('search-button').addEventListener('click',globalSearch);
$('global-search').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();globalSearch();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('dialog[open]').forEach(d=>d.close());});

(async function init(){
  setAuthMode('login');
  if(DEMO_MODE){currentUser={id:'demo-user',email:'demo@campusconnect.local',user_metadata:{display_name:'Demo Student',campus:'Demo Campus'}};profile={display_name:'Demo Student',campus:'Demo Campus'};listings=[...demoListings];showView('home');renderHomeListings();return;}
  try{
    const sb=client();
    const {data,error}=await sb.auth.getSession();if(error)throw error;
    currentUser=data.session?.user||null;
    sb.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;if(currentUser){loadProfile().then(()=>{if(currentView==='auth')showView('home');});}else if(currentView!=='auth')showView('auth');});
    await loadListings();
    if(currentUser){await loadProfile();showView('home');}else showView('auth');
    $('nav-account').textContent=currentUser?'My profile':'Log in';
  }catch(error){
    console.error('App initialization:',error);
    listings=[...demoListings];
    status($('auth-status'),'The page loaded, but Supabase could not connect. Check your internet connection and Supabase settings. You can still view the design; real authentication needs Supabase.','error');
    showView('auth');
  }
})();
