const API_BASE = "http://localhost:3000";

console.log("auth.js geladen");



// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  console.log("loginForm gevonden");
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
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
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

const usernameSpan = document.getElementById("username");
if (usernameSpan) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    window.location.href = "/";
  } else {
    const payload = JSON.parse(atob(token.split('.')[1]));
    usernameSpan.textContent = payload.username;
  }
}
//uitloggen
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
    localStorage.removeItem("accessToken");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  });
}


