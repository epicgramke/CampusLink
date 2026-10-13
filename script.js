/* Campus Connect Kenya — login and signup with Supabase Auth.
   This browser code uses only the project's public/publishable key.
   Never place a Supabase service_role or secret key in frontend code. */
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
const passwordField = $('password-field');

let mode = 'login';
let supabase = null;

$('year').textContent = new Date().getFullYear();

function showMessage(message, type = 'error') {
  statusBox.textContent = message;
  statusBox.className = `status-message visible ${type}`;
}
function clearMessage() {
  statusBox.textContent = '';
  statusBox.className = 'status-message';
}
function setBusy(busy, label) {
  submitButton.disabled = busy;
  googleButton.disabled = busy;
  submitLabel.textContent = busy ? label : (mode === 'login' ? 'Log In' : 'Create Account');
}
function friendlyError(error) {
  const message = (error && error.message) ? error.message : 'Something went wrong. Please try again.';
  if (/invalid login credentials/i.test(message)) return 'Email or password is incorrect. Check your details or create an account.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email using the link we sent you, then log in.';
  if (/user already registered/i.test(message)) return 'An account already exists for this email. Try logging in instead.';
  if (/password should be at least/i.test(message)) return 'Choose a password with at least 6 characters.';
  if (/rate limit/i.test(message)) return 'Too many attempts. Please wait a little and try again.';
  return message;
}
function setMode(nextMode) {
  mode = nextMode;
  clearMessage();
  const signingUp = mode === 'signup';
  formTitle.innerHTML = signingUp ? 'Join <span>Campus Connect!</span>' : 'Welcome <span>Back!</span>';
  formSubtitle.textContent = signingUp
    ? 'Create your student community account'
    : 'Log in to your Campus Connect account';
  submitLabel.textContent = signingUp ? 'Create Account' : 'Log In';
  passwordInput.autocomplete = signingUp ? 'new-password' : 'current-password';
  passwordInput.placeholder = signingUp ? 'Create a password (6+ characters)' : 'Password';
  loginOptions.hidden = signingUp;
  forgotButton.hidden = signingUp;
  switchCopy.firstChild.textContent = signingUp ? 'Already have an account? ' : "Don't have an account? ";
  switchButton.textContent = signingUp ? 'Log In' : 'Sign Up';
}
switchButton.addEventListener('click', () => setMode(mode === 'login' ? 'signup' : 'login'));

$('toggle-password').addEventListener('click', () => {
  const reveal = passwordInput.type === 'password';
  passwordInput.type = reveal ? 'text' : 'password';
  $('toggle-password').setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
});

function getClient() {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error('The Supabase library did not load. Check your internet connection and reload this page.');
  }
  if (!supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return supabase;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email) return showMessage('Enter your email address.');
  if (!emailInput.checkValidity()) return showMessage('Enter a valid email address.');
  if (!password) return showMessage('Enter your password.');
  if (mode === 'signup' && password.length < 6) return showMessage('Choose a password with at least 6 characters.');

  setBusy(true, mode === 'login' ? 'Logging in…' : 'Creating account…');
  try {
    const client = getClient();
    if (mode === 'login') {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showMessage('You are logged in successfully. Your session is saved on this device.', 'success');
      // The home page will be added in the next build step.
      window.location.href = new URL('./home.html', window.location.href).href;
    } else {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.href.split('#')[0].split('?')[0] }
      });
      if (error) throw error;
      if (data.session) {
        showMessage('Your account has been created. You are signed in.', 'success');
      } else {
        showMessage('Account created. Check your email for the confirmation link, then return here to log in.', 'success');
        setMode('login');
      }
    }
  } catch (error) {
    showMessage(friendlyError(error));
  } finally {
    setBusy(false);
  }
});

googleButton.addEventListener('click', async () => {
  clearMessage();
  googleButton.disabled = true;
  try {
    const client = getClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href.split('#')[0].split('?')[0] }
    });
    if (error) throw error;
  } catch (error) {
    showMessage(friendlyError(error));
    googleButton.disabled = false;
  }
});

forgotButton.addEventListener('click', async () => {
  clearMessage();
  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    emailInput.focus();
    return showMessage('Enter your email address above first, then tap Forgot password again.');
  }
  forgotButton.disabled = true;
  try {
    const client = getClient();
    const redirectTo = window.location.href.split('#')[0].split('?')[0];
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    showMessage('If password recovery is enabled, a reset link will be sent to your email. Check your inbox and spam folder.', 'success');
  } catch (error) {
    showMessage(friendlyError(error));
  } finally {
    forgotButton.disabled = false;
  }
});

// A sign-in redirect returns here; detect the session so users get a clear message.
(async function checkExistingSession() {
  try {
    const client = getClient();
    const { data, error } = await client.auth.getSession();
    if (!error && data.session) {
      showMessage('You are already signed in on this device. You can continue to the home page when it is ready.', 'success');
    }
  } catch (error) {
    // Keep the page usable for previewing even when offline or not connected.
    console.warn('Supabase initialization:', error.message);
  }
})();
