// TEST JS
document.body.insertAdjacentHTML('afterbegin', '<p style="color:red">JS LOADED</p>');

// --------------------
// 1️⃣ Supabase client
const supabase = supabase.createClient(
  'https://rckcnhdgqmnshrnebtzi.supabase.co', // replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja2NuaGRncW1uc2hybmVidHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzIzMTcsImV4cCI6MjA4MjcwODMxN30.ONVRe0lCq5kcEEMWJ6kHb7QYuAyqzZYlPwxCGNDYapg'                 // replace with your anon key
);

// --------------------
// 2️⃣ Grab elements
const registerScreen = document.getElementById('register-screen');
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');

const registerEmail = document.getElementById('email');
const registerPassword = document.getElementById('password');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');

const statusText = document.getElementById('status');

// --------------------
// 3️⃣ Helper: show screen
function showScreen(screen) {
  registerScreen.classList.remove('active');
  loginScreen.classList.remove('active');
  chatScreen.classList.remove('active');
  screen.classList.add('active');
}

// --------------------
// 4️⃣ Supabase connection test
async function testSupabase() {
  const { error } = await supabase.from('users').select('id').limit(1);

  if (error) {
    statusText.textContent = '❌ Supabase connection failed';
    statusText.style.color = 'red';
  } else {
    statusText.textContent = '✅ Supabase connected successfully';
    statusText.style.color = 'limegreen';
  }
}

testSupabase();

// --------------------
// 5️⃣ Register
registerBtn.addEventListener('click', async () => {
  const email = registerEmail.value;
  const password = registerPassword.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert('Register failed: ' + error.message);
    return;
  }

  showScreen(chatScreen);
});

// --------------------
// 6️⃣ Login
loginBtn.addEventListener('click', async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert('Login failed: ' + error.message);
    return;
  }

  showScreen(chatScreen);
});

// --------------------
// 7️⃣ Auto-login session
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) showScreen(chatScreen);
}

checkSession();

// --------------------
// 8️⃣ Switch links
document.getElementById('to-login').addEventListener('click', () => {
  showScreen(loginScreen);
});

document.getElementById('to-register').addEventListener('click', () => {
  showScreen(registerScreen);
});
