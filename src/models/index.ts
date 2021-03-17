'use strict';
require("dotenv").config();
import * as loadConfig from "../config/config.json";
import { Model, Sequelize } from 'sequelize';
import ButtonFactory from './button';
import ConfigFactory from './config';
import CustomerFactory, { Customer } from './customer';
import ItemFactory from './item';
import LogFactory from './log';
import MenuFactory from "./menu";
import OrderFactory from './order';
import OrderItemFactory from './order-item';
import PaymentFactory, { Payment } from './payment';
import RoleFactory from './role';
import ScriptFactory from './script';
import TableFactory from './table';
import TableAreaFactory from './table-area';
import UserFactory from './user';

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
  Customer: CustomerFactory(sequelize),
  Item: ItemFactory(sequelize),
  OrderItem: OrderItemFactory(sequelize),
  Log: LogFactory(sequelize),
  User: UserFactory(sequelize),
  Payment: PaymentFactory(sequelize),
  Role: RoleFactory(sequelize),
  Config: ConfigFactory(sequelize)
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