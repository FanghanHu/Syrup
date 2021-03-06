import { Button, ButtonCreationAttributes } from "./button";
import { Association, DataTypes, HasManyAddAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface MenuAttributes {
    id: number;
    menuName: string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface MenuCreationAttributes extends Optional<MenuAttributes, "id"> {
    Buttons?: ButtonCreationAttributes[];
};

/**
 * A Menu can hold multiple Buttons, Buttons can lead towards different Menu.
 */
export class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    public id!: number;
    public menuName!: string;

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
        Menu.hasMany(db.Button, {onDelete: "CASCADE"});
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function MenuFactory(sequelize: Sequelize): typeof Menu {
    Menu.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            menuName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "menus",
            sequelize
        }
    );
    return Menu;
}