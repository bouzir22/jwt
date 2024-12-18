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

// Generate JWT
function generateJWT(payload, secretKey, expiresIn = "1h") {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadBase64 = btoa(JSON.stringify({ ...payload, exp: Date.now() + parseExpiration(expiresIn) }));
  const signature = CryptoJS.HmacSHA256(`${header}.${payloadBase64}`, secretKey).toString(CryptoJS.enc.Base64);
  return `${header}.${payloadBase64}.${signature}`;
}

// Verify JWT
function verifyJWT(token) {
  const [header, payloadBase64, signature] = token.split(".");
  const validSignature = CryptoJS.HmacSHA256(`${header}.${payloadBase64}`, SECRET_KEY).toString(CryptoJS.enc.Base64);
   if (validSignature !== signature) {
    return { valid: false, message: "Signature invalide" };
  }

  const payload = JSON.parse(atob(payloadBase64));

  if (Date.now() > payload.exp) {
    return { valid: false, message: "Le token a expiré" };
  }

  return { valid: true, payload };
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

 
