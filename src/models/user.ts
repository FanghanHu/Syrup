import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface UserAttributes {
    id: number;
    fullName: string;
    username: string;
    password: string;
    accessCode: string;
    permissions: JSON;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
};

/**
 * A User can be a manager, a cashier or a server.
 * User contains a set of permissions which will override other broader defined permissions.
 * User also contain 2 sets of credentials, accessCode for employees and username,password for managers
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public fullName!: string;
    public username!: string;
    public password!: string;
    public accessCode!: string;
    public permissions!: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function UserFactory(sequelize: Sequelize): typeof User {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },
            accessCode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            permissions: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: "users",
            sequelize
        }
    );
    return User;
}