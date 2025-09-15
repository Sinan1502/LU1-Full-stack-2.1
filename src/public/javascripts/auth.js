const API_BASE = "http://localhost:3000";

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const pwd = document.getElementById("pwd").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pwd }),
      credentials: "include"
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Login mislukt!");
    }
  });
}

// Registreren
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const pwd = document.getElementById("pwd").value;

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pwd })
    });

    if (res.ok) {
      alert("Registratie succesvol! Je kan nu inloggen.");
      window.location.href = "/";
    } else if (res.status === 409) {
      alert("Gebruikersnaam bestaat al!");
    } else {
      alert("Registratie mislukt!");
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "GET",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout fout:", err);
    }
    setTimeout(() => { window.location.href = "/"; }, 100);
  });
}
