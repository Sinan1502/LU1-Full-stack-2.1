const API_BASE = "";

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
      Swal.fire({
        icon: "success",
        title: "Inloggen gelukt!",
        text: "Welkom terug ",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "/dashboard";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Inloggen mislukt",
        text: "Controleer je gebruikersnaam en wachtwoord"
      });
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
      Swal.fire({
        icon: "success",
        title: "Registratie gelukt!",
        text: "Je kunt nu inloggen.",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "/";
      });
    } else if (res.status === 409) {
      Swal.fire({
        icon: "warning",
        title: "Gebruikersnaam bestaat al!",
        text: "Kies een andere naam."
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Registratie mislukt",
        text: "Probeer het later opnieuw."
      });
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

      Swal.fire({
        icon: "success",
        title: "Je bent uitgelogd",
        text: "Tot de volgende keer!",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "/";
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Fout bij uitloggen!",
        text: "Probeer het later opnieuw."
      });
    }
  });
}
