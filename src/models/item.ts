import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface ItemAttributes {
    id: number;
    itemName: string;
    price: string;
    tax: number;
    translation?: JSON;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface ItemCreationAttributes extends Optional<ItemAttributes, "id"> {
    OrderItems?: OrderItemCreationAttributes[];
};

/**
 * Represents an item that can be ordered
 * Note that orders does not directly link to Item, but uses OrderItem instead,
 * this is for keeping old order data unchanged while modifing item.
 */
export class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
    public id!: number;
    public itemName!: string;
    public price!: string;
    public tax!: number;
    public translation?: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many OrderItem
    public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItem!: HasManyAddAssociationsMixin<OrderItem, number>;
    public hasOrderItem!: HasManyHasAssociationMixin<OrderItem, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;
    public createOrderItem!: HasManyCreateAssociationMixin<OrderItem>;
    public readonly OrderItems?: OrderItem[];
    
    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Item.hasMany(db.OrderItem);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function ItemFactory(sequelize: Sequelize): typeof Item {
    Item.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tax: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            translation: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: "items",
            sequelize
        }
    );
    return Item;
}