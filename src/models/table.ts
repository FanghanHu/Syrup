import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional, Order, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";
import { OrderCreationAttributes } from "./order";
import { TableArea, TableAreaCreationAttributes } from "./table-area";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface TableAttributes {
    id: number;
    tableName: string;
    x: number;
    y: number;
    icon: string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface TableCreationAttributes extends Optional<TableAttributes, "id"> {
    TableArea?: TableAreaCreationAttributes;
    orders?: OrderCreationAttributes[];
};

/**
 * A Table inside a TableArea, used in dine in orders.
 */
export class Table extends Model<TableAttributes, TableCreationAttributes> implements TableAttributes {
    public id!: number;
    public tableName!: string;
    public x!: number;
    public y!: number;
    public icon!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //belongs to TableArea
    public getTableArea !: BelongsToGetAssociationMixin<TableArea>;
    public setTableArea !: BelongsToSetAssociationMixin<TableArea, number>;
    public createTableArea !: BelongsToCreateAssociationMixin<TableArea>;
    public readonly TableArea?: TableArea;

    //has many Order
    public getOrders !: HasManyGetAssociationsMixin<Order>;
    public addOrder !: HasManyAddAssociationsMixin<Order, number>;
    public hasOrder !: HasManyHasAssociationMixin<Order, number>;
    public countOrders !: HasManyCountAssociationsMixin;
    public createOrder !: HasManyCreateAssociationMixin<Order>;
    public readonly Orders?: Order[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Table.belongsTo(db.TableArea);
        Table.hasMany(db.Order);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function TableFactory(sequelize: Sequelize): typeof Table {
    Table.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            tableName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            x: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }, 
            y: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }, 
            icon: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: "tables",
            sequelize
        }
    );
    return Table;
}