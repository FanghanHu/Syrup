
import Table from "react-bootstrap/esm/Table";
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";

interface OrderAttributes {
    id: number;
    orderNumber: string;
    status: string;
    total: number;
    type: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {
    // Buttons?: ButtonCreationAttributes[];
};

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public orderNumber!: string;
    public status!: string;
    public total!: number;
    public type!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Table
    public getTable !: BelongsToGetAssociationMixin<Table>;
    public setTable !: BelongsToSetAssociationMixin<Table, number>;
    public createTable !: BelongsToCreateAssociationMixin<Table>;
    public readonly table?: Table;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Order.belongsTo(db.Table);
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