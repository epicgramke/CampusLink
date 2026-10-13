/* CAMPUS CONNECT KENYA
   Clean JavaScript entry point.
   Authentication is required for all private pages.
*/

(() => {
  "use strict";

  const SUPABASE_URL =
    "https://ojbzbkvruehrntdxktse.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA";

  const app = document.getElementById("app");

  const categories = [
    {
      id: "marketplace",
      name: "Marketplace",
      icon: "🛍️",
      description: "Buy and sell items within your campus."
    },
    {
      id: "food",
      name: "Food",
      icon: "🍲",
      description: "Discover campus food and meal offers."
    },
    {
      id: "hostels",
      name: "Hostels",
      icon: "🏠",
      description: "Find student accommodation."
    },
    {
      id: "jobs",
      name: "Jobs",
      icon: "💼",
      description: "Explore job opportunities."
    },
    {
      id: "internships",
      name: "Internships",
      icon: "🎓",
      description: "Find internship opportunities."
    },
    {
      id: "lost-found",
      name: "Lost & Found",
      icon: "🔎",
      description: "Report or find missing belongings."
    },
    {
      id: "events",
      name: "Events",
      icon: "📅",
      description: "Discover campus events."
    },
    {
      id: "announcements",
      name: "Announcements",
      icon: "📢",
      description: "Read important campus notices."
    }
  ];

  let supabase;
  let currentUser = null;
  let authReady = false;
  let notice = "";
  let noticeIsError = false;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function setNotice(message, isError = false) {
    notice = message;
    noticeIsError = isError;
  }

  function showMessage(message, isError = false) {
    const box = document.getElementById("message");
    if (!box) return;

    box.textContent = message;
    box.className = "message show" + (isError ? " error" : "");
  }

  function currentRoute() {
    return (location.hash || "#login").slice(1);
  }

  function go(route) {
    location.hash = route;
  }

  function authScreen(mode) {
    const registering = mode === "register";

    app.innerHTML = `
      <main class="auth-wrap">
        <section class="auth-card">
          <div class="brand">
            <span class="brand-mark">C</span>
            CAMPUS CONNECT
          </div>

          <h1>${registering ? "Create your account" : "Welcome back"}</h1>

          <p class="muted">
            ${registering
              ? "Register to access your campus community."
              : "Sign in to continue to your campus community."}
          </p>

          <div id="message" class="message"></div>

          <form id="auth-form">
            ${registering ? `
              <div class="field">
                <label for="full-name">Full name</label>
                <input id="full-name" name="fullName"
                  type="text" autocomplete="name"
                  maxlength="100" required>
              </div>
            ` : ""}

            <div class="field">
              <label for="email">Email address</label>
              <input id="email" name="email" type="email"
                autocomplete="email" maxlength="254" required>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password"
                autocomplete="${registering ? "new-password" : "current-password"}"
                minlength="6" required>
            </div>

            <button class="btn btn-full" type="submit">
              ${registering ? "Create account" : "Sign in"}
            </button>
          </form>

          <div class="auth-switch">
            ${registering
              ? `Already have an account?
                 <a href="#login">Sign in</a>`
              : `New to Campus Connect?
                 <a href="#register">Create an account</a>`}
          </div>
        </section>
      </main>
    `;

    if (notice) {
      showMessage(notice, noticeIsError);
      notice = "";
      noticeIsError = false;
    }

    document.getElementById("auth-form")
      .addEventListener("submit", handleAuth);
  }

  async function handleAuth(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);

    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const fullName = String(data.get("fullName") || "").trim();

    button.disabled = true;
    button.textContent = "Please wait...";

    try {
      if (currentRoute() === "register") {
        if (!fullName) {
          throw new Error("Please enter your full name.");
        }

        const { data: result, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        if (result.session) {
          currentUser = result.user;
          setNotice("Account created successfully.");
          go("home");
          await render();
        } else {
          showMessage(
            "Registration received. Check your email for a verification link, then sign in."
          );
          button.disabled = false;
          button.textContent = "Create account";
        }

      } else {
        const { data: result, error } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (error) throw error;

        currentUser = result.user;
        setNotice("You are signed in.");
        go("home");
        await render();
      }
    } catch (error) {
      showMessage(error.message || "Something went wrong.", true);
      button.disabled = false;
      button.textContent =
        currentRoute() === "register" ? "Create account" : "Sign in";
    }
  }

  function header(route) {
    const navItems = [
      ["home", "Home"],
      ["marketplace", "Marketplace"],
      ["food", "Food"],
      ["hostels", "Hostels"],
      ["jobs", "Jobs"],
      ["internships", "Internships"],
      ["lost-found", "Lost & Found"],
      ["events", "Events"],
      ["announcements", "Announcements"]
    ];

    return `
      <header class="site-header">
        <a class="brand" href="#home">
          <span class="brand-mark">C</span>CAMPUS CONNECT
        </a>

        <nav class="nav" aria-label="Main navigation">
          ${navItems.map(([id, label]) => `
            <a href="#${id}" class="${route === id ? "active" : ""}">
              ${label}
            </a>
          `).join("")}

          <a href="#profile" class="${route === "profile" ? "active" : ""}">
            My profile
          </a>

          <button id="logout" class="btn btn-outline" type="button">
            Sign out
          </button>
        </nav>
      </header>
    `;
  }

  function categoryCards() {
    return categories.map(category => `
      <a class="category-card" href="#${category.id}">
        <span class="category-icon">${category.icon}</span>
        <strong>${escapeHTML(category.name)}</strong>
        <small>${escapeHTML(category.description)}</small>
      </a>
    `).join("");
  }

  function homePage() {
    return `
      <h1 class="page-heading">Campus dashboard</h1>
      <p class="muted">
        Welcome to your student community.
      </p>

      <h2 class="section-heading">Explore campus services</h2>

      <div class="grid">
        ${categoryCards()}
      </div>
    `;
  }

  function categoryPage(route) {
    const category = categories.find(item => item.id === route);

    if (!category) {
      return `
        <h1 class="page-heading">Page not found</h1>
        <p class="muted">Choose a section from the navigation.</p>
        <a class="btn" href="#home">Back to dashboard</a>
      `;
    }

    return `
      <h1 class="page-heading">
        ${category.icon} ${escapeHTML(category.name)}
      </h1>

      <p class="muted">${escapeHTML(category.description)}</p>

      <div class="empty-state">
        <h3>No listings displayed yet</h3>
        <p>
          This section needs its database listing functions connected
          before real posts can appear here.
        </p>
        <a class="btn btn-outline" href="#home">Back to dashboard</a>
      </div>
    `;
  }

  function profilePage() {
    const email = currentUser?.email || "";
    const name =
      currentUser?.user_metadata?.full_name || "Campus member";

    return `
      <h1 class="page-heading">My profile</h1>

      <section class="panel">
        <h2>${escapeHTML(name)}</h2>
        <p class="muted">Email: ${escapeHTML(email)}</p>
        <p class="muted">
          Your account is signed in through Supabase.
        </p>
        <button id="logout-profile" class="btn" type="button">
          Sign out
        </button>
      </section>
    `;
  }

  function dashboard(route) {
    let content;

    if (route === "home") {
      content = homePage();
    } else if (route === "profile") {
      content = profilePage();
    } else {
      content = categoryPage(route);
    }

    app.innerHTML = `
      ${header(route)}
      <main class="page">
        ${content}
      </main>
      <footer>Campus Connect Kenya</footer>
    `;

    document.getElementById("logout")
      ?.addEventListener("click", signOut);

    document.getElementById("logout-profile")
      ?.addEventListener("click", signOut);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Could not sign out: " + error.message);
      return;
    }

    currentUser = null;
    go("login");
    await render();
  }

  async function render() {
    if (!authReady) {
      app.innerHTML = '<main class="loading">Loading Campus Connect...</main>';
      return;
    }

    const route = currentRoute();

    // Visitors must authenticate before accessing private pages.
    if (!currentUser) {
      if (route !== "login" && route !== "register") {
        go("login");
        authScreen("login");
        return;
      }

      authScreen(route);
      return;
    }

    // Signed-in users should not stay on the login/register screen.
    if (route === "login" || route === "register" || !route) {
      go("home");
      dashboard("home");
      return;
    }

    dashboard(route);
  }

  async function start() {
    if (!window.supabase) {
      app.innerHTML = `
        <main class="auth-wrap">
          <section class="auth-card">
            <h1>Connection problem</h1>
            <p class="muted">
              The Supabase library did not load.
              Check your internet connection and reload the page.
            </p>
          </section>
        </main>
      `;
      return;
    }

    supabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      app.innerHTML = `
        <main class="auth-wrap">
          <section class="auth-card">
            <h1>Unable to load your session</h1>
            <p class="muted">${escapeHTML(error.message)}</p>
            <a class="btn" href="#login">Return to login</a>
          </section>
        </main>
      `;
      return;
    }

    currentUser = data.session?.user || null;
    authReady = true;

    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      authReady = true;
      void render();
    });

    window.addEventListener("hashchange", () => {
      void render();
    });

    if (!location.hash) {
      location.hash = currentUser ? "home" : "login";
    }

    await render();
  }

  start().catch(error => {
    console.error("Campus Connect startup error:", error);
    app.innerHTML = `
      <main class="auth-wrap">
        <section class="auth-card">
          <h1>Campus Connect could not start</h1>
          <p class="muted">
            Reload the page. If the problem continues, check the browser console.
          </p>
        </section>
      </main>
    `;
  });
})();
