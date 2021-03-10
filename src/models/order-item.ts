import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyAddAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin} from "sequelize";
import { DatabaseType } from ".";
import { Item, ItemCreationAttributes } from "./item";
import { Order, OrderCreationAttributes } from "./order";
import { OrderModifier, OrderModifierCreationAttributes } from "./order-modifier";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface OrderItemAttributes {
    id : number;
    amount: number;
    itemData : object;
    status :  "VOIDED" | "ORDERED" | "NEW";
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {
    Order?: OrderCreationAttributes;
    OrderId?: number;
    OrderModifiers?: OrderModifierCreationAttributes[];
    Server?: UserCreationAttributes;
    ServerId?: number;
    Item?: ItemCreationAttributes;
    ItemId?: number;
};

/**
 * OrderItems captures the current state of an Item, allow the user to modify it while keeping Item unchanged
 * OrderItems can link to multiple OrderModifier, allow them to modify this item
 */
export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public amount!: number;
    public itemData!: object;
    public status!: "VOIDED" | "ORDERED" | "NEW";

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Order
    public getOrder!: BelongsToGetAssociationMixin<Order>;
    public setOrder!: BelongsToSetAssociationMixin<Order, number>;
    public createOrder!: BelongsToCreateAssociationMixin<Order>;
    public readonly Order?: Order;
    public OrderId?: number;

    //belongs to Server (User)
    public getServer!: BelongsToGetAssociationMixin<User>;
    public setServer!: BelongsToSetAssociationMixin<User, number>;
    public createServer!: BelongsToCreateAssociationMixin<User>;
    public readonly Server?: User;
    public ServerId?: number;

    //has many OrderModifier
    public getOrderModifiers!: HasManyGetAssociationsMixin<OrderModifier>;
    public countOrderModifiers!: HasManyCountAssociationsMixin;
    public hasOrderModifier!: HasManyHasAssociationMixin<OrderModifier, number>;
    public hasOrderModifiers!: HasManyHasAssociationsMixin<OrderModifier, number>;
    public setOrderModifiers!: HasManySetAssociationsMixin<OrderModifier, number>;
    public addOrderModifier!: HasManyAddAssociationMixin<OrderModifier, number>;
    public addOrderModifiers!: HasManyAddAssociationsMixin<OrderModifier, number>;
    public removeOrderModifier!: HasManyRemoveAssociationMixin<OrderModifier, number>;
    public removeOrderModifiers!: HasManyRemoveAssociationsMixin<OrderModifier, number>;
    public createOrderModifier!: HasManyCreateAssociationMixin<OrderModifier>;
    public readonly OrderModifiers?: OrderModifier[];

    //belongs to Item
    public getItem!: BelongsToGetAssociationMixin<Item>;
    public setItem!: BelongsToSetAssociationMixin<Item, number>;
    public createItem!: BelongsToCreateAssociationMixin<Item>;
    public readonly Item?: Item;
    public ItemId?: number;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        OrderItem.belongsTo(db.Item);
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
            amount: {
                type: DataTypes.FLOAT,
                defaultValue: 1,
                allowNull: false
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