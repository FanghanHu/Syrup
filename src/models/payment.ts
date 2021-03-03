import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, Order} from "sequelize";
import { DatabaseType } from ".";
import { OrderCreationAttributes } from "./order";

interface PaymentAttributes {
    id: number;
    type: string;
    status?: string;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {
    order?: OrderCreationAttributes;
};

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: number;
    public type!: string;
    public status?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to Order
    public getOrder !: BelongsToGetAssociationMixin<Order>;
    public setOrder !: BelongsToSetAssociationMixin<Order, number>;
    public createOrder !: BelongsToCreateAssociationMixin<Order>;
    public readonly Order?: Order;

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Payment.belongsTo(db.Order);
    }
}

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