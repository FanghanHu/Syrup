import { Sequelize, Model, Optional, DataTypes, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasOneCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Config, ConfigCreationAttributes } from "./config";
import { Log, LogCreationAttributes } from "./log";
import { Order, OrderCreationAttributes } from "./order";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";
import { OrderModifier, OrderModifierCreationAttributes } from "./order-modifier";
import { Payment, PaymentCreationAttributes } from "./payment";
import { Role, RoleCreationAttributes } from "./role";
import '../utils/hashing';

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface UserAttributes {
    id: number;
    fullName: string;
    username?: string;
    password?: string;
    accessCode?: string;
    permissions?: JSON;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
    Order?: OrderCreationAttributes;
    Logs?: LogCreationAttributes[];
    OrderItems?: OrderItemCreationAttributes[];
    OrderModifiers?: OrderModifierCreationAttributes[];
    Payments?: PaymentCreationAttributes[];
    Roles?: RoleCreationAttributes[];
    Config?: ConfigCreationAttributes;
};

/**
 * A User can be a manager, a cashier or a server, or multiple Roles at once
 * User contains a set of permissions which will override other broader defined permissions.
 * User also contain 2 sets of credentials, accessCode for employees and username,password for managers
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public fullName!: string;
    public username?: string;
    public password?: string;
    public accessCode?: string;
    public permissions?: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    
    //has many Log
    public getLogs!: HasManyGetAssociationsMixin<Log>;
    public addLog!: HasManyAddAssociationsMixin<Log, number>;
    public hasLog!: HasManyHasAssociationMixin<Log, number>;
    public countLogs!: HasManyCountAssociationsMixin;
    public createLog!: HasManyCreateAssociationMixin<Log>;
    public readonly Logs?: Log[];

    //has many Order
    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrder!: HasManyAddAssociationsMixin<Order, number>;
    public hasOrder!: HasManyHasAssociationMixin<Order, number>;
    public countOrders!: HasManyCountAssociationsMixin;
    public createOrder!: HasManyCreateAssociationMixin<Order>;
    public readonly Orders?: Order[];

    //has many OrderItem
    public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItem!: HasManyAddAssociationsMixin<OrderItem, number>;
    public hasOrderItem!: HasManyHasAssociationMixin<OrderItem, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;
    public createOrderItem!: HasManyCreateAssociationMixin<OrderItem>;
    public readonly OrderItems?: OrderItem[];

    //has many OrderModifier
    public getOrderModifiers!: HasManyGetAssociationsMixin<OrderModifier>;
    public addOrderModifier!: HasManyAddAssociationsMixin<OrderModifier, number>;
    public hasOrderModifier!: HasManyHasAssociationMixin<OrderModifier, number>;
    public countOrderModifiers!: HasManyCountAssociationsMixin;
    public createOrderModifier!: HasManyCreateAssociationMixin<OrderModifier>;
    public readonly OrderModifiers?: OrderModifier[];

    //has many Payment
    public getPayments!: HasManyGetAssociationsMixin<Payment>;
    public addPayment!: HasManyAddAssociationsMixin<Payment, number>;
    public hasPayment!: HasManyHasAssociationMixin<Payment, number>;
    public countPayments!: HasManyCountAssociationsMixin;
    public createPayment!: HasManyCreateAssociationMixin<Payment>;
    public readonly Payments?: Payment[];

    //belongs to many Roles
    public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
    public countRoles!: BelongsToManyCountAssociationsMixin;
    public hasRole!: BelongsToManyHasAssociationMixin<Role, number>;
    public hasRoles!: BelongsToManyHasAssociationsMixin<Role, number>;
    public setRoles!: BelongsToManySetAssociationsMixin<Role, number>;
    public addRole!: BelongsToManyAddAssociationMixin<Role, number>;
    public addRoles!: BelongsToManyAddAssociationsMixin<Role, number>;
    public removeRole!: BelongsToManyRemoveAssociationMixin<Role, number>;
    public removeRoles!: BelongsToManyRemoveAssociationsMixin<Role, number>;
    public createRole!: BelongsToManyCreateAssociationMixin<Role>;
    public readonly Roles?: Role[];

    //has one Config
    public getConfig!: HasOneGetAssociationMixin<Config>
    public setConfig!: HasOneSetAssociationMixin<Config, number>
    public createConfig!: HasOneCreateAssociationMixin<Config>
    public readonly Config?: Config;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        User.hasMany(db.Log);

        //using alias "Server"
        User.hasMany(db.Order, {foreignKey: "ServerId"});
        User.hasMany(db.OrderItem, {foreignKey: "ServerId"});
        User.hasMany(db.OrderModifier, {foreignKey: "ServerId"});
        User.hasMany(db.Payment, {foreignKey: "ServerId"});

        User.belongsToMany(db.Role, {through: "userRoles"});
        User.hasOne(db.Config);
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
                allowNull: true,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
                set(value:string) {
                    //hash the password
                    this.setDataValue('password', value.sha256());
                }
            },
            accessCode: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
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