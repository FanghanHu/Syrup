import { DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Optional, Sequelize } from "sequelize";
import { DatabaseType } from ".";
import { Button, ButtonCreationAttributes } from "./button";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface ScriptAttributes {
    id: number;
    scriptName: string;
    data: object;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface ScriptCreationAttributes extends Optional<ScriptAttributes, "id"> {
    Buttons?: ButtonCreationAttributes[];
};

/**
 * A Script can be assigned to a Button, when pressed, the Script will be executed inside the current context
 * Some script are pre-existing, some are user defined.
 */
export class Script extends Model<ScriptAttributes, ScriptCreationAttributes> implements ScriptAttributes {
    public id!: number;
    public scriptName!: string;
    public data!: object;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many Button
    public getButtons!: HasManyGetAssociationsMixin<Button>;
    public countButtons!: HasManyCountAssociationsMixin;
    public hasButton!: HasManyHasAssociationMixin<Button, number>;
    public hasButtons!: HasManyHasAssociationsMixin<Button, number>;
    public setButtons!: HasManySetAssociationsMixin<Button, number>;
    public addButton!: HasManyAddAssociationMixin<Button, number>;
    public addButtons!: HasManyAddAssociationsMixin<Button, number>;
    public removeButton!: HasManyRemoveAssociationMixin<Button, number>;
    public removeButtons!: HasManyRemoveAssociationsMixin<Button, number>;
    public createButton!: HasManyCreateAssociationMixin<Button>;
    public readonly Buttons?: Button[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Script.hasMany(db.Button);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
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
            tableName: "scripts",
            sequelize
        }
    );
    return Script;
}