'use strict';
require("dotenv").config();

import { Model, Sequelize } from 'sequelize';
import ButtonFactory from './button';
import CustomerFactory, { Customer } from './customer';
import MenuFactory from "./menu";
import OrderFactory from './order';
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
  TableArea: TableAreaFactory(sequelize),
  Order: OrderFactory(sequelize),
  Customer: CustomerFactory(sequelize)
}

type DatabaseType = typeof db;
type AssociatedModel = {
  associate?: (db: DatabaseType) => void;
}

for(const key in db) {
  const model = (db[key] as AssociatedModel);
  if(model.associate) {
    model.associate(db);
  }
}

export { DatabaseType }
export default db;