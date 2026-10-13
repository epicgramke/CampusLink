/* Campus Connect Kenya — Login and Signup with Supabase Auth */
'use strict';

const SUPABASE_URL = 'https://ojbzbkvruehrntdxktse.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA';

const $ = (id) => document.getElementById(id);

const form = $('auth-form');
const emailInput = $('email');
const passwordInput = $('password');
const submitButton = $('submit-button');
const submitLabel = $('submit-label');
const statusBox = $('status-message');
const googleButton = $('google-button');
const switchButton = $('switch-mode');
const switchCopy = $('switch-copy');
const formTitle = $('form-title');
const formSubtitle = $('form-subtitle');
const loginOptions = $('login-options');
const forgotButton = $('forgot-password');
const passwordToggle = $('toggle-password');
const yearElement = $('year');

let mode = 'login';
let supabaseClient = null;
let busy = false;

if (yearElement) {
yearElement.textContent = new Date().getFullYear();
}

function showMessage(message, type = 'error') {
if (!statusBox) return;
statusBox.textContent = message;
statusBox.className = "status-message visible ${type}";
}

function clearMessage() {
if (!statusBox) return;
statusBox.textContent = '';
statusBox.className = 'status-message';
}

function friendlyError(error) {
const message = error?.message || 'Something went wrong. Please try again.';

if (/invalid login credentials/i.test(message)) {
return 'Incorrect email or password. Check your details or create an account.';
}

if (/email not confirmed/i.test(message)) {
return 'Please confirm your email using the link sent to your inbox.';
}

if (/user already registered/i.test(message)) {
return 'This email already has an account. Please log in instead.';
}

if (/password should be at least/i.test(message)) {
return 'Your password must contain at least 6 characters.';
}

if (/rate limit|too many requests/i.test(message)) {
return 'Too many attempts. Please wait a moment and try again.';
}

if (/failed to fetch|networkerror/i.test(message)) {
return 'Connection failed. Check your internet and try again.';
}

return message;
}

function setBusy(isBusy, label = '') {
busy = isBusy;

if (submitButton) submitButton.disabled = isBusy;
if (googleButton) googleButton.disabled = isBusy;
if (switchButton) switchButton.disabled = isBusy;
if (forgotButton) forgotButton.disabled = isBusy;

if (submitLabel) {
submitLabel.textContent = isBusy
? label
: mode === 'login'
? 'Log In'
: 'Create Account';
}
}

function setMode(nextMode) {
mode = nextMode;
clearMessage();

const signingUp = mode === 'signup';

if (formTitle) {
formTitle.innerHTML = signingUp
? 'Join <span>Campus Connect!</span>'
: 'Welcome <span>Back!</span>';
}

if (formSubtitle) {
formSubtitle.textContent = signingUp
? 'Create your student community account'
: 'Log in to your Campus Connect account';
}

if (submitLabel) {
submitLabel.textContent = signingUp ? 'Create Account' : 'Log In';
}

if (passwordInput) {
passwordInput.autocomplete = signingUp
? 'new-password'
: 'current-password';

passwordInput.placeholder = signingUp
  ? 'Create a password (6+ characters)'
  : 'Password';

}

if (loginOptions) loginOptions.hidden = signingUp;
if (forgotButton) forgotButton.hidden = signingUp;

if (switchCopy) {
switchCopy.firstChild.textContent = signingUp
? 'Already have an account? '
: "Don't have an account? ";
}

if (switchButton) {
switchButton.textContent = signingUp ? 'Log In' : 'Sign Up';
}
}

function getClient() {
if (!window.supabase ||
typeof window.supabase.createClient !== 'function') {
throw new Error(
'Supabase did not load. Check your internet connection and reload the page.'
);
}

if (!supabaseClient) {
supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY,
{
auth: {
persistSession: true,
autoRefreshToken: true,
detectSessionInUrl: true
}
}
);
}

return supabaseClient;
}

if (switchButton) {
switchButton.addEventListener('click', () => {
if (!busy) setMode(mode === 'login' ? 'signup' : 'login');
});
}

if (passwordToggle && passwordInput) {
passwordToggle.addEventListener('click', () => {
const reveal = passwordInput.type === 'password';

passwordInput.type = reveal ? 'text' : 'password';
passwordToggle.setAttribute(
  'aria-label',
  reveal ? 'Hide password' : 'Show password'
);

});
}

if (form) {
form.addEventListener('submit', async (event) => {
event.preventDefault();

if (busy) return;
clearMessage();

const email = emailInput?.value.trim() || '';
const password = passwordInput?.value || '';

if (!email) return showMessage('Enter your email address.');

if (!emailInput.checkValidity()) {
  return showMessage('Enter a valid email address.');
}

if (!password) return showMessage('Enter your password.');

if (mode === 'signup' && password.length < 6) {
  return showMessage('Choose a password with at least 6 characters.');
}

setBusy(true, mode === 'login' ? 'Logging in...' : 'Creating account...');

try {
  const client = getClient();

  if (mode === 'login') {
    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    showMessage('Login successful! Opening Campus Connect...', 'success');

    window.location.assign(
      new URL('./home.html', window.location.href).href
    );

    return;
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.href.split('#')[0].split('?')[0]
    }
  });

  if (error) throw error;

  if (data.session) {
    showMessage('Account created successfully!', 'success');

    window.location.assign(
      new URL('./home.html', window.location.href).href
    );

    return;
  }

  showMessage(
    'Account created! Check your email to confirm your account before logging in.',
    'success'
  );

  setMode('login');
} catch (error) {
  showMessage(friendlyError(error));
} finally {
  setBusy(false);
}

});
}

if (googleButton) {
googleButton.addEventListener('click', async () => {
if (busy) return;

clearMessage();
setBusy(true, 'Connecting to Google...');

try {
  const client = getClient();

  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href.split('#')[0].split('?')[0]
    }
  });

  if (error) throw error;
} catch (error) {
  showMessage(friendlyError(error));
  setBusy(false);
}

});
}

if (forgotButton) {
forgotButton.addEventListener('click', async () => {
if (busy) return;

clearMessage();

const email = emailInput?.value.trim() || '';

if (!email || !emailInput.checkValidity()) {
  emailInput?.focus();
  return showMessage(
    'Enter your valid email address first, then tap Forgot password again.'
  );
}

setBusy(true, 'Sending reset link...');

try {
  const client = getClient();

  const redirectTo =
    window.location.href.split('#')[0].split('?')[0];

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo
  });

  if (error) throw error;

  showMessage(
    'If password recovery is enabled, check your email for a password reset link.',
    'success'
  );
} catch (error) {
  showMessage(friendlyError(error));
} finally {
  setBusy(false);
}

});
}

async function checkExistingSession() {
try {
const client = getClient();
const { data, error } = await client.auth.getSession();

if (error) throw error;

if (data.session) {
  showMessage(
    'You are already signed in on this device.',
    'success'
  );
}

} catch (error) {
console.warn('Supabase initialization:', error.message);
}
}

checkExistingSession();
