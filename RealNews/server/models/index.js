// server/models/index.js  (ESM-compatible)
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import SequelizePkg from "sequelize";

// __dirname / __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Sequelize, DataTypes } = SequelizePkg;

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
console.log("Environment:", env);

// If config.js is CommonJS (module.exports = {...}), default import gives the object.
import configFile from "../config/config.js";
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files in this directory (except this file), ESM-friendly
const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.endsWith(".js")
  );

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  const moduleUrl = pathToFileURL(fullPath).href;

  // Works for both ESM `export default` and CJS `module.exports = ...`
  const mod = await import(moduleUrl);
  const initModel = mod.default;
  if (typeof initModel !== "function") {
    throw new Error(
      `Model file "${file}" must export default a function (sequelize, DataTypes) => Model`
    );
  }
  const model = initModel(sequelize, DataTypes);
  db[model.name] = model;
}

// Run associations if any
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
