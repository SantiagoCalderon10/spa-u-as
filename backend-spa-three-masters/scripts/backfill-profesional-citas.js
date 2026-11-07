import "dotenv/config";
import mongoose from "mongoose";

import { CitasModel } from "../src/modules/citas/models/entities/Cita.model.js";
// Se importan para registrar los modelos que usa el populate.
import { ProfesionalesModel } from "../src/modules/profesionales/models/entities/Profesionales.model.js";
import "../src/modules/usuarios/models/entities/Usuarios.model.js";

/**
 * Rellena `profesional.nombre` en las citas creadas antes de que existiera el
 * snapshot. Es necesario ejecutarlo UNA vez antes de dar de baja definitiva a
 * una profesional: si su perfil se elimina sin snapshot, el historial se queda
 * sin el nombre en la cita.
 *
 * Uso:
 *   node scripts/backfill-profesional-citas.js
 *   node scripts/backfill-profesional-citas.js --dry-run
 */

const { MONGO_URI = "mongodb://127.0.0.1:27017/three-masters" } = process.env;
const soloSimulacion = process.argv.includes("--dry-run");

async function ejecutar() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

  const pendientes = await CitasModel.find({
    $or: [
      { "profesional.nombre": { $exists: false } },
      { "profesional.nombre": null },
      { "profesional.nombre": "" },
    ],
  }).select("_id idProfesional profesional");

  console.log(`Citas sin snapshot de profesional: ${pendientes.length}`);

  if (pendientes.length === 0) return;

  let actualizadas = 0;
  let sinPerfil = 0;
  const nombresPorProfesional = new Map();

  for (const cita of pendientes) {
    const idProfesional = String(cita.idProfesional);

    if (!nombresPorProfesional.has(idProfesional)) {
      const profesional = await ProfesionalesModel.findById(cita.idProfesional)
        .populate("idUsuario", "nombrecompleto")
        .select("idUsuario");

      nombresPorProfesional.set(
        idProfesional,
        profesional?.idUsuario?.nombrecompleto || null
      );
    }

    const nombre = nombresPorProfesional.get(idProfesional);

    if (!nombre) {
      sinPerfil += 1;
      console.log(
        `  · ${cita._id}: la profesional ${cita.idProfesional} no existe o no tiene nombre. Se omite.`
      );
      continue;
    }

    if (!soloSimulacion) {
      await CitasModel.updateOne(
        { _id: cita._id },
        { $set: { "profesional.nombre": nombre } }
      );
    }

    actualizadas += 1;
  }

  console.log(
    soloSimulacion
      ? `Simulación: se actualizarían ${actualizadas} citas (${sinPerfil} sin perfil).`
      : `Actualizadas ${actualizadas} citas (${sinPerfil} sin perfil).`
  );
}

ejecutar()
  .catch((error) => {
    console.error("No se pudo completar el backfill:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
