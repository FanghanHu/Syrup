import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";

interface UserAttributes {
    id: number;
    fullName: string;
    username: string;
    password: string;
    accessCode: string;
    permissions: JSON;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
};

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