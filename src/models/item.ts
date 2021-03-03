import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";

interface ItemAttributes {
    id: number;
    itemName: string;
    price: string;
    tax: number;
    translation?: JSON;
}

export interface ItemCreationAttributes extends Optional<ItemAttributes, "id"> {
    OrderItems ?: OrderItemCreationAttributes[];
};

export class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
    public id!: number;
    public itemName!: string;
    public price!: string;
    public tax!: number;
    public translation?: JSON;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

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
        Item.hasMany(db.OrderItem);
    }
}

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