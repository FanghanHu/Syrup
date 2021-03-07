import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface LogAttributes {
    id: number;
    type: string;
    data: object;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface LogCreationAttributes extends Optional<LogAttributes, "id"> {
    User?: UserCreationAttributes;
    UserId?: number;
};

/**
 * A button exists inside a menu, which has a script.
 * when pressed, the button will execute the script
 * depends on what the script does, it will either order an item, open a new menu, or etc.
 */
export class Log extends Model<LogAttributes, LogCreationAttributes> implements LogAttributes {
    public id!: number;
    public type!: string;
    public data!: object;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to User
    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<User, number>;
    public createUser!: BelongsToCreateAssociationMixin<User>;
    public readonly User?: User;
    public UserId?: number;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Log.belongsTo(db.User);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function LogFactory(sequelize: Sequelize): typeof Log {
    Log.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false
            }
        }, {
            tableName: "logs",
            sequelize
        }
    );
    return Log;
}