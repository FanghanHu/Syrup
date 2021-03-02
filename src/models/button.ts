import { Sequelize, Model, Optional, DataTypes, Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { Menu } from "./menu";

interface ButtonAttributes {
    id: number;
    buttonName: string;
    translations?: object;
}

interface ButtonCreationAttributes extends Optional<ButtonAttributes, "id"> {};

export class Button extends Model<ButtonAttributes, ButtonCreationAttributes> implements ButtonAttributes {
    public id!: number;
    public buttonName!: string;
    translations?: object;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getMenu !: BelongsToGetAssociationMixin<Menu>;
    public setMenu !: BelongsToSetAssociationMixin<Menu, number>;
    public createMenu !: BelongsToCreateAssociationMixin<Menu>;

    public readonly menu?: Menu;

    public static associations: {
        menu: Association<Button, Menu>;
    }
}

export default function ButtonFactory(sequelize: Sequelize): typeof Button {
    Button.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            buttonName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            translations: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: "buttons",
            sequelize
        }
    );
    return Button;
}