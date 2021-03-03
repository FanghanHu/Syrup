import { Sequelize, Model, Optional, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyHasAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManyCreateAssociationMixin} from "sequelize";
import { DatabaseType } from ".";
import { Order, OrderCreationAttributes } from "./order";

interface CustomerAttributes {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    note: string;
}

export interface CustomerCreationAttributes extends Optional<CustomerAttributes, "id"> {
    Orders ?: OrderCreationAttributes;
};

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public phone!: string;
    public address!: string;
    public city!: string;
    public state!: string;
    public zip!: string;
    public note!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to many orders
    public getOrders !: BelongsToManyGetAssociationsMixin<Order>;
    public countOrders !: BelongsToManyCountAssociationsMixin;
    public hasOrder !: BelongsToManyHasAssociationMixin<Order, number>;
    public hasOrders !: BelongsToManyHasAssociationsMixin<Order, number>;
    public setOrders !: BelongsToManySetAssociationsMixin<Order, number>;
    public addOrder !: BelongsToManyAddAssociationMixin<Order, number>;
    public addOrders !: BelongsToManyAddAssociationsMixin<Order, number>;
    public removeOrder !: BelongsToManyRemoveAssociationMixin<Order, number>;
    public removeOrders !: BelongsToManyRemoveAssociationsMixin<Order, number>;
    public createOrder !: BelongsToManyCreateAssociationMixin<Order>;
    public readonly Orders ?: Order[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Customer.belongsToMany(db.Order, {through: "customerOrders"})
    }
}

export default function CustomerFactory(sequelize: Sequelize): typeof Customer {
    Customer.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            lastName: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            phone: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            address: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            city: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            state: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            zip: {
                type: DataTypes.STRING,
                allowNull: true
            }
            ,
            note: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            tableName: "customers",
            sequelize
        }
    );
    return Customer;
}