document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const resultado = document.getElementById("resultado");

  resultado.textContent = "⏳ Verificando...";
  resultado.className = "warning";

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      resultado.textContent = `✅ Bienvenido ${data.user.email}`;
      resultado.className = "success";

      // Redirigir al panel principal
      setTimeout(() => {
        window.location.href = "panel_principal.html";
      }, 1500);
    } else {
      resultado.textContent = "❌ Usuario o contraseña incorrectos";
      resultado.className = "error";
    }
  } catch (error) {
    resultado.textContent = "⚠️ Error al conectar con el servidor";
    resultado.className = "warning";
  }
});
