import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Order, OrderCreationAttributes } from "./order";

interface OrderItemAttributes {
    id: number;
    itemData: JSON;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {
    Order ?: OrderCreationAttributes;
};

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public itemData!: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Order
    public getOrder !: BelongsToGetAssociationMixin<Order>;
    public setOrder !: BelongsToSetAssociationMixin<Order, number>;
    public createOrder !: BelongsToCreateAssociationMixin<Order>;
    public readonly Order ?: Order;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        OrderItem.belongsTo(db.Order);
    }
}

export default function OrderItemFactory(sequelize: Sequelize): typeof OrderItem {
    OrderItem.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            itemData: {
                type: DataTypes.JSON,
                allowNull: false
            }
        }, {
            tableName: "order-items",
            sequelize
        }
    );
    return OrderItem;
}