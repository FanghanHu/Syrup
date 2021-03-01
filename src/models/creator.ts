import { DataTypes } from "sequelize/types";
import defineModel from "./sequelize-typed";
import sequelize from "./syrup-db";

export default defineModel({
    sequelize: sequelize,
    name: "Creator",
    structure: {
        name: {
            type: DataTypes.STRING,
            instanceType: {} as string
        }
    }
});