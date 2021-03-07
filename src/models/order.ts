import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";
import { Customer, CustomerCreationAttributes } from "./customer";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";
import { Table, TableCreationAttributes } from "./table";
import { User, UserCreationAttributes } from "./user";

/**
 * {@see OrderAttributes}
 */
export type OrderCache = {
    subtotal: number;
    tax: number;
    total: number;
    [x: string]: any;
} 

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
export interface OrderAttributes {
    id: number;
    orderNumber: string;
    status: string;
    /**
     * A cache data, may contain order subtotal, tax, total, or any additional data.
     * should be updated every time the order is modified, used to avoid unnecessary calculation
     */
    cache?: OrderCache;
    type: "Dine in" | "To Go" | "Pick up" | "Delivery";
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {
    Table?: TableCreationAttributes;
    TableId?: number;
    Customers?: CustomerCreationAttributes[];
    OrderItems?: OrderItemCreationAttributes[];
    Server?: UserCreationAttributes;
    ServerId?: number;

};

/**
 * An Order, which holds multiple OrderItems, depending on its type, it may link to a Table or a customer.
 */
export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public orderNumber!: string;
    public status!: string;
    public total?: number;
    public type!: "Dine in" | "To Go" | "Pick up" | "Delivery";

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Table
    public getTable!: BelongsToGetAssociationMixin<Table>;
    public setTable!: BelongsToSetAssociationMixin<Table, number>;
    public createTable!: BelongsToCreateAssociationMixin<Table>;
    public readonly Table?: Table;
    public TableId?: number;

    //belongs to many Customers
    public getCustomers!: BelongsToManyGetAssociationsMixin<Customer>;
    public countCustomers!: BelongsToManyCountAssociationsMixin;
    public hasCustomer!: BelongsToManyHasAssociationMixin<Customer, number>;
    public hasCustomers!: BelongsToManyHasAssociationsMixin<Customer, number>;
    public setCustomers!: BelongsToManySetAssociationsMixin<Customer, number>;
    public addCustomer!: BelongsToManyAddAssociationMixin<Customer, number>;
    public addCustomers!: BelongsToManyAddAssociationsMixin<Customer, number>;
    public removeCustomer!: BelongsToManyRemoveAssociationMixin<Customer, number>;
    public removeCustomers!: BelongsToManyRemoveAssociationsMixin<Customer, number>;
    public createCustomer!: BelongsToManyCreateAssociationMixin<Customer>;
    public readonly Customers?: Customer[];

    //has many OrderItem
    public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItem!: HasManyAddAssociationsMixin<OrderItem, number>;
    public hasOrderItem!: HasManyHasAssociationMixin<OrderItem, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;
    public createOrderItem!: HasManyCreateAssociationMixin<OrderItem>;
    public readonly OrderItems?: OrderItem[];

    //belongs to Server (User)
    public getServer!: BelongsToGetAssociationMixin<User>;
    public setServer!: BelongsToSetAssociationMixin<User, number>;
    public createServer!: BelongsToCreateAssociationMixin<User>;
    public readonly Server?: User;
    public ServerId?: number;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Order.belongsTo(db.Table);
        Order.belongsToMany(db.Customer, {through: "customerOrders"});
        Order.hasMany(db.OrderItem);
        Order.belongsTo(db.User, {as: "Server"})
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function OrderFactory(sequelize: Sequelize): typeof Order {
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            orderNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cache: {
                type: DataTypes.JSON,
                allowNull: true
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "orders",
            sequelize
        }
    );
    return Order;
}