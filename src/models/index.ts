'use strict';
require("dotenv").config();

import { Sequelize } from 'sequelize';
import ButtonFactory from './button';
import MenuFactory from "./menu";
import ScriptFactory from './script';
import TableFactory from './table';
import TableAreaFactory from './table-areas';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize : Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  sequelize,
  Sequelize,
  Menu: MenuFactory(sequelize),
  Button: ButtonFactory(sequelize),
  Script: ScriptFactory(sequelize),
  Table: TableFactory(sequelize),
  TableArea: TableAreaFactory(sequelize)
}

db.Menu.hasMany(db.Button);
db.Button.belongsTo(db.Menu);

db.Script.hasMany(db.Button);
db.Button.belongsTo(db.Script);

db.TableArea.hasMany(db.Table);
db.Table.belongsTo(db.TableArea);

export default db;