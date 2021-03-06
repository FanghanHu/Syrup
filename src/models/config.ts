import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface ConfigAttributes {
    id: number;
    data: {
        [key: string]: any
    };
    UserId?: number;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface ConfigCreationAttributes extends Optional<ConfigAttributes, "id"> {
    User?: UserCreationAttributes;
};

/**
 * A Config can be linked to a user or not, 
 * when not linked to a user, 
 * it contains config for the whole application,
 * when linked to a user,
 * it contains config for the application which only affect the user.
 */
export class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
    public id!: number;
    public data!: {
        [key: string]: any
    };

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to User
    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<User, number>;
    public createUser!: BelongsToCreateAssociationMixin<User>;
    public readonly User?: User;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Config.belongsTo(db.User);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function ConfigFactory(sequelize: Sequelize): typeof Config {
    Config.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {}
            }
        }, {
            tableName: "configs",
            sequelize
        }
    );
    return Config;
}