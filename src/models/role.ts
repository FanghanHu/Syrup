import { Sequelize, Model, Optional, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin} from "sequelize";
import { DatabaseType } from ".";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface RoleAttributes {
    id: number;
    roleName: string;
    permissions?: object;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {
    Users?: UserCreationAttributes[];
};

/**
 * A User can have multiple Roles, and A Role can have multiple Users,
 * Roles provide a set of permissions which can be overrided by user's permission
 */
export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public roleName!: string;
    public permissions?: object;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to many Users
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
    public countUsers!: BelongsToManyCountAssociationsMixin;
    public hasUser!: BelongsToManyHasAssociationMixin<User, number>;
    public hasUsers!: BelongsToManyHasAssociationsMixin<User, number>;
    public setUsers!: BelongsToManySetAssociationsMixin<User, number>;
    public addUser!: BelongsToManyAddAssociationMixin<User, number>;
    public addUsers!: BelongsToManyAddAssociationsMixin<User, number>;
    public removeUser!: BelongsToManyRemoveAssociationMixin<User, number>;
    public removeUsers!: BelongsToManyRemoveAssociationsMixin<User, number>;
    public createUser!: BelongsToManyCreateAssociationMixin<User>;
    public readonly Users?: User[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Role.belongsToMany(db.User, {through: "userRoles"});
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function RoleFactory(sequelize: Sequelize): typeof Role {
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            roleName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permissions: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: "roles",
            sequelize
        }
    );
    return Role;
}