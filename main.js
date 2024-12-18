// Simulated database and JWT functions
const SECRET_KEY = "monSecretSuperSecurise";
const users = [];
const adminRole = "admin";
const adminUsername = "admin";
const adminPassword = "admin";
users.push({ email: adminUsername, password: adminPassword, role: adminRole });
console.log(users);

// Logic for showing the forms
function showLoginForm() {
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('registerForm').classList.remove('active');
}

function showRegisterForm() {
  document.getElementById('registerForm').classList.add('active');
  document.getElementById('loginForm').classList.remove('active');
}


 
// Convert expiration time to milliseconds
function parseExpiration(expiration) {
  const match = expiration.match(/(\d+)([smhd])/);
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}



// Handle registration
document.getElementById("registerFormElement").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = "user";

  if (users.some((user) => user.email === email)) {
    document.getElementById("output").textContent = "Cet utilisateur existe déjà !";
    return;
  }

  users.push({ email, password, role });
  document.getElementById("output").textContent = "Inscription réussie !";
});

// Handle login
document.getElementById("loginFormElement").addEventListener("submit", (e) => {
  e.preventDefault();
 
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    document.getElementById("output").textContent = "Identifiants invalides !";
    return;
  }
  const role = user.role;

  const token = generateJWT({ email, role }, SECRET_KEY);
  console.log(token);
  localStorage.setItem("jwtToken", token);
  document.getElementById("output").textContent = `Connexion réussie ! Token : ${token}`;
});

 
