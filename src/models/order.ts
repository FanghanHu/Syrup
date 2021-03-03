
import Table from "react-bootstrap/esm/Table";
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";
import { Customer, CustomerCreationAttributes } from "./customer";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";
import { TableCreationAttributes } from "./table";

interface OrderAttributes {
    id: number;
    orderNumber: string;
    status: string;
    total?: number;
    type: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {
    Table ?: TableCreationAttributes;
    Customers ?: CustomerCreationAttributes[];
    OrderItems ?: OrderItemCreationAttributes[];
};

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public orderNumber!: string;
    public status!: string;
    public total?: number;
    public type!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Table
    public getTable !: BelongsToGetAssociationMixin<Table>;
    public setTable !: BelongsToSetAssociationMixin<Table, number>;
    public createTable !: BelongsToCreateAssociationMixin<Table>;
    public readonly Table?: Table;

    //belongs to many Customers
    public getCustomers !: BelongsToManyGetAssociationsMixin<Customer>;
    public countCustomers !: BelongsToManyCountAssociationsMixin;
    public hasCustomer !: BelongsToManyHasAssociationMixin<Customer, number>;
    public hasCustomers !: BelongsToManyHasAssociationsMixin<Customer, number>;
    public setCustomers !: BelongsToManySetAssociationsMixin<Customer, number>;
    public addCustomer !: BelongsToManyAddAssociationMixin<Customer, number>;
    public addCustomers !: BelongsToManyAddAssociationsMixin<Customer, number>;
    public removeCustomer !: BelongsToManyRemoveAssociationMixin<Customer, number>;
    public removeCustomers !: BelongsToManyRemoveAssociationsMixin<Customer, number>;
    public createCustomer !: BelongsToManyCreateAssociationMixin<Customer>;
    public readonly Customers ?: Customer[];

    //has many OrderItem
    public getOrderItems !: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItem !: HasManyAddAssociationsMixin<OrderItem, number>;
    public hasOrderItem !: HasManyHasAssociationMixin<OrderItem, number>;
    public countOrderItems !: HasManyCountAssociationsMixin;
    public createOrderItem !: HasManyCreateAssociationMixin<OrderItem>;
    public readonly OrderItems?: OrderItem[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Order.belongsTo(db.Table);
        Order.belongsToMany(db.Customer, {through: "customerOrders"});
        Order.hasMany(db.OrderItem);
    }
}

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
            total: {
                type: DataTypes.FLOAT,
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