import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Modifier, ModifierCreationAttributes } from "./modifier";
import { OrderItem, OrderItemCreationAttributes } from "./order-item";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface OrderModifierAttributes {
    id: number;
    modifierData: object;
    status : string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface OrderModifierCreationAttributes extends Optional<OrderModifierAttributes, "id"> {
    Modifier?: ModifierCreationAttributes;
    ModifierId?: number;
    OrderItem?: OrderItemCreationAttributes;
    OrderItemId?: number;
    Server?: UserCreationAttributes;
    ServerId?: number;
};

/**
 * An OrderModifier holds a copy of modifier at the time of ordering this modifier,
 * It allows user to change the modifier without altering the original Modifier, and it 
 * keeps old order information the same when changing Modifier.
 */
export class OrderModifier extends Model<OrderModifierAttributes, OrderModifierCreationAttributes> implements OrderModifierAttributes {
    public id!: number;
    public modifierData!: object;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Modifier
    public getModifier!: BelongsToGetAssociationMixin<Modifier>;
    public setModifier!: BelongsToSetAssociationMixin<Modifier, number>;
    public createModifier!: BelongsToCreateAssociationMixin<Modifier>;
    public readonly Modifier?: Modifier;
    public ModifierId?: number;

    //belongs to OrderItem
    public getOrderItem!: BelongsToGetAssociationMixin<OrderItem>;
    public setOrderItem!: BelongsToSetAssociationMixin<OrderItem, number>;
    public createOrderItem!: BelongsToCreateAssociationMixin<OrderItem>;
    public readonly OrderItem?: OrderItem;
    public OrderItemId?: number;

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
        OrderModifier.belongsTo(db.Modifer);
        OrderModifier.belongsTo(db.OrderItem);
        OrderModifier.belongsTo(db.User, {as: "Server"})
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function OrderModifierFactory(sequelize: Sequelize): typeof OrderModifier {
    OrderModifier.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            modifierData: {
                type: DataTypes.JSON,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "order-modifiers",
            sequelize
        }
    );
    return OrderModifier;
}