import { DataTypes } from "sequelize/types";
import defineModel from "./sequelize-typed";
import sequelize from "./syrup-db";

export default defineModel({
    sequelize: sequelize,
    name: "Project",
    structure: {
        projectName: {
            type: DataTypes.STRING,
            instanceType: {} as string
        },
        cost : {
            type: DataTypes.FLOAT,
            instanceType: {} as number
        }
    }
});