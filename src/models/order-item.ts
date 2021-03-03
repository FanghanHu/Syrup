import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Order, OrderCreationAttributes } from "./order";
import { OrderModifier, OrderModifierCreationAttributes } from "./order-modifier";
import { User } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface OrderItemAttributes {
    id : number;
    itemData : JSON;
    status : string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {
    Order?: OrderCreationAttributes;
    OrderModifiers?: OrderModifierCreationAttributes[];
};

/**
 * OrderItems captures the current state of an Item, allow the user to modify it while keeping Item unchanged
 * OrderItems can link to multiple OrderModifier, allow them to modify this item
 */
export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public itemData!: JSON;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Order
    public getOrder!: BelongsToGetAssociationMixin<Order>;
    public setOrder!: BelongsToSetAssociationMixin<Order, number>;
    public createOrder!: BelongsToCreateAssociationMixin<Order>;
    public readonly Order?: Order;

    //belongs to Server (User)
    public getServer!: BelongsToGetAssociationMixin<User>;
    public setServer!: BelongsToSetAssociationMixin<User, number>;
    public createServer!: BelongsToCreateAssociationMixin<User>;
    public readonly Server?: User;

    //has many OrderModifier
    public getOrderModifiers!: HasManyGetAssociationsMixin<OrderModifier>;
    public addOrderModifier!: HasManyAddAssociationsMixin<OrderModifier, number>;
    public hasOrderModifier!: HasManyHasAssociationMixin<OrderModifier, number>;
    public countOrderModifiers!: HasManyCountAssociationsMixin;
    public createOrderModifier!: HasManyCreateAssociationMixin<OrderModifier>;
    public readonly OrderModifiers?: OrderModifier[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        OrderItem.belongsTo(db.Order);
        OrderItem.belongsTo(db.User, {as: "Server"})
        OrderItem.hasMany(db.OrderModifier);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
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
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "order-items",
            sequelize
        }
    );
    return OrderItem;
}