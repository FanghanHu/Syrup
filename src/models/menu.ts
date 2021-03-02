import { Button } from "./button";
import { Association, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types/lib/associations/has-many";

interface MenuAttributes {
    id: number;
    menuName: string;
}

interface MenuCreationAttributes extends Optional<MenuAttributes, "id"> {};

export class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    public id!: number;
    public menuName!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getButtons !: HasManyGetAssociationsMixin<Button>;
    public addButton !: HasManyAddAssociationsMixin<Button, number>;
    public hasButton !: HasManyHasAssociationMixin<Button, number>;
    public countButtons !: HasManyCountAssociationsMixin;
    public createButton !: HasManyCreateAssociationMixin<Button>;

    public readonly buttons?: Button[];

    public static associations: {
        buttons: Association<Menu, Button>;
    }
}

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