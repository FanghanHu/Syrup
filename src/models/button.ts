import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Menu, MenuCreationAttributes } from "./menu";
import { Script, ScriptCreationAttributes } from "./script";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface ButtonAttributes {
    id: number;
    buttonName: string;
    translations?: object;
    parameters?: any;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface ButtonCreationAttributes extends Optional<ButtonAttributes, "id"> {
    Menu?: MenuCreationAttributes;
    MenuId?: number;
    Script?: ScriptCreationAttributes;
    ScriptId?: number;
};

/**
 * A button exists inside a menu, which has a script.
 * when pressed, the button will execute the script
 * depends on what the script does, it will either order an item, open a new menu, or etc.
 */
export class Button extends Model<ButtonAttributes, ButtonCreationAttributes> implements ButtonAttributes {
    public id!: number;
    public buttonName!: string;
    public translations?: object;
    public parameters?: any;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Menu
    public getMenu!: BelongsToGetAssociationMixin<Menu>;
    public setMenu!: BelongsToSetAssociationMixin<Menu, number>;
    public createMenu!: BelongsToCreateAssociationMixin<Menu>;
    public readonly Menu?: Menu;
    public MenuId?: number;

    //belongs to Script
    public getScript!: BelongsToGetAssociationMixin<Script>;
    public setScript!: BelongsToSetAssociationMixin<Script, number>;
    public createScript!: BelongsToCreateAssociationMixin<Script>;
    public readonly Script?: Script;
    public ScriptId?: number;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Button.belongsTo(db.Menu);
        Button.belongsTo(db.Script);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
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
            },
            parameters: {
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