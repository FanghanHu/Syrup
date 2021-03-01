import { DataTypes } from "sequelize/types";
import defineModel from "./sequelize-typed";
import sequelize from "./syrup-db";

export default defineModel({
    sequelize: sequelize,
    name: "User",
    structure: {
        name: {
            type: DataTypes.STRING,
            instanceType: {} as string
        },
        age : {
            type: DataTypes.FLOAT,
            instanceType: {} as number
        }
    }
});