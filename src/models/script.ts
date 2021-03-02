import { Association, DataTypes, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, Optional, Sequelize } from "sequelize/types";
import { Button, ButtonCreationAttributes } from "./button";

interface ScriptAttributes {
    id: number;
    scriptName: string;
    data: JSON;
}

export interface ScriptCreationAttributes extends Optional<ScriptAttributes, "id"> {
    Buttons?: ButtonCreationAttributes[];
};

export class Script extends Model<ScriptAttributes, ScriptCreationAttributes> implements ScriptAttributes {
    public id!: number;
    public scriptName!: string;
    public data!: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many Button
    public getButtons !: HasManyGetAssociationsMixin<Button>;
    public addButton !: HasManyAddAssociationsMixin<Button, number>;
    public hasButton !: HasManyHasAssociationMixin<Button, number>;
    public countButtons !: HasManyCountAssociationsMixin;
    public createButton !: HasManyCreateAssociationMixin<Button>;

    public readonly buttons?: Button[];

    public static associations: {
        buttons: Association<Script, Button>;
    }
}

export default function ScriptFactory(sequelize: Sequelize): typeof Script {
    Script.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            scriptName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false
            }
        }, {
            tableName: "menus",
            sequelize
        }
    );
    return Script;
}