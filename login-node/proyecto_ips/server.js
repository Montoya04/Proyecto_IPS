const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🧱 Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(__dirname));

// 🔗 Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginbd",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

// 🧠 Ruta de login con registro automático
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Datos incompletos" });
  }

  const checkUser = "SELECT * FROM usuarios WHERE email = ?";
  db.query(checkUser, [email], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (result.length > 0) {
      const user = result[0];
      if (user.password === password) {
        res.json({ success: true, user });
      } else {
        res.json({
          success: false,
          message: "Usuario o contraseña incorrectos",
        });
      }
    } else {
      // Si el usuario no existe, lo crea automáticamente
      const insertUser =
        "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)";
      const rol = "paciente"; // por defecto

      db.query(insertUser, [email, password, rol], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });

        res.json({
          success: true,
          user: { id: result.insertId, email, password, rol },
          message: "Usuario registrado e iniciado sesión",
        });
      });
    }
  });
});

// 🌐 Ruta para mostrar el login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
