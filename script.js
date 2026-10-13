let supabaseClient=null;
let signUpMode=false;

document.addEventListener("DOMContentLoaded",async()=>{
  if(window.CAMPUS_CONFIG?.SUPABASE_URL?.startsWith("http") && window.CAMPUS_CONFIG?.SUPABASE_ANON_KEY && window.supabase){
    supabaseClient=window.supabase.createClient(CAMPUS_CONFIG.SUPABASE_URL,CAMPUS_CONFIG.SUPABASE_ANON_KEY);
    const {data}=await supabaseClient.auth.getSession();
    if(data.session) showHome();
    supabaseClient.auth.onAuthStateChange((event,session)=>{
      if(session) showHome(); else if(event==="SIGNED_OUT") showAuth();
    });
  }
  document.getElementById("auth-form").addEventListener("submit",handleAuth);
  document.getElementById("switch-mode").addEventListener("click",switchMode);
  document.getElementById("toggle-password").addEventListener("click",()=>{
    const p=document.getElementById("password");p.type=p.type==="password"?"text":"password";
  });
  document.getElementById("forgot-password").addEventListener("click",forgotPassword);
  document.getElementById("google-button").addEventListener("click",googleLogin);
});

function showHome(){document.getElementById("auth-page").classList.add("hidden");document.getElementById("home-page").classList.remove("hidden")}
function showAuth(){document.getElementById("home-page").classList.add("hidden");document.getElementById("auth-page").classList.remove("hidden")}
function setStatus(msg,type="error"){const el=document.getElementById("status-message");el.textContent=msg;el.className="status-message visible "+type}
function switchMode(){
  signUpMode=!signUpMode;
  document.getElementById("auth-title").innerHTML=signUpMode?"Create <span>Account!</span>":"Welcome <span>Back!</span>";
  document.getElementById("auth-subtitle").textContent=signUpMode?"Create your Campus Connect account":"Log in to your Campus Connect account";
  document.getElementById("submit-label").textContent=signUpMode?"Sign Up":"Log In";
  document.getElementById("switch-copy").innerHTML=signUpMode?`Already have an account? <button type="button" id="switch-mode">Log In</button>`:`Don't have an account? <button type="button" id="switch-mode">Sign Up</button>`;
  document.getElementById("switch-mode").onclick=switchMode;
  document.getElementById("login-options").style.display=signUpMode?"none":"flex";
}
async function handleAuth(e){
  e.preventDefault(); const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
  if(!email||password.length<6){setStatus("Enter a valid email and a password of at least 6 characters.");return}
  if(!supabaseClient){setStatus("Supabase is not configured yet. Add your public Supabase URL and anon/publishable key in config.js.");return}
  const btn=document.getElementById("submit-button");btn.disabled=true;
  let result=signUpMode?await supabaseClient.auth.signUp({email,password}):await supabaseClient.auth.signInWithPassword({email,password});
  btn.disabled=false;
  if(result.error){setStatus(result.error.message);return}
  if(signUpMode){setStatus("Account created. Check your email if confirmation is required.","success")}else showHome();
}
async function googleLogin(){
  if(!supabaseClient){setStatus("Supabase is not configured yet. Add your public Supabase URL and anon/publishable key in config.js.");return}
  const {error}=await supabaseClient.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});
  if(error)setStatus(error.message);
}
async function forgotPassword(){
  const email=document.getElementById("email").value.trim();
  if(!email){setStatus("Enter your email address first.");return}
  if(!supabaseClient){setStatus("Configure Supabase first.");return}
  const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
  if(error)setStatus(error.message);else setStatus("Password reset email sent.","success");
}
async function logout(){if(supabaseClient)await supabaseClient.auth.signOut();showAuth()}
function toggleMenu(){document.getElementById("menuPanel").classList.toggle("open")}
function openCategory(name){showToast(name+" — section ready to open")}
function doSearch(e){e.preventDefault();const q=document.getElementById("searchInput").value.trim();showToast(q?`Searching for "${q}"`:"Type something to search");return false}
function showToast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2200)}
