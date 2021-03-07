import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, Order} from "sequelize";
import { DatabaseType } from ".";
import { OrderCreationAttributes } from "./order";
import { User, UserCreationAttributes } from "./user";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface PaymentAttributes {
    id: number;
    type: string;
    status?: string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {
    Order?: OrderCreationAttributes;
    OrderId?: number;
    Server?: UserCreationAttributes;
    ServerId?: number;
};

/**
 * A Payment towards an Order, must be made by an User.
 */
export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: number;
    public type!: string;
    public status?: string;

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

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Payment.belongsTo(db.Order);
        Payment.belongsTo(db.User, {as: "Server"});
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function PaymentFactory(sequelize: Sequelize): typeof Payment {
    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "payments",
            sequelize
        }
    );
    return Payment;
}