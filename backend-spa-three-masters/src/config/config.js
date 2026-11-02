import "dotenv/config";

function leerOrigenes(valor) {
  return String(valor || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origen) => origen.trim())
    .filter(Boolean);
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    "Falta JWT_SECRET en las variables de entorno. Copia .env.example y define un secreto largo y aleatorio."
  );
}

if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 caracteres.");
}

export const config = Object.freeze({
  puerto: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/three-masters",
  jwtSecret,
  jwtExpira: process.env.JWT_EXPIRA || "8h",
  corsOrigenes: leerOrigenes(process.env.CORS_ORIGENES),
});
