import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";
import { Table, TableCreationAttributes } from "./table";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface TableAreaAttributes {
    id: number;
    tableAreaName: string;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface TableAreaCreationAttributes extends Optional<TableAreaAttributes, "id"> {
    Tables?: TableCreationAttributes[];
};

/**
 * TableArea represents different areas inside a restaurant.
 * For example: patio, main dining room, bars
 */
export class TableArea extends Model<TableAreaAttributes, TableAreaCreationAttributes> implements TableAreaAttributes {
    public id!: number;
    public tableAreaName!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many Table
    public getTables!: HasManyGetAssociationsMixin<Table>;
    public addTable!: HasManyAddAssociationsMixin<Table, number>;
    public hasTable!: HasManyHasAssociationMixin<Table, number>;
    public countTables!: HasManyCountAssociationsMixin;
    public createTable!: HasManyCreateAssociationMixin<Table>;
    public readonly Tables?: Table[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        TableArea.hasMany(db.Table);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function TableAreaFactory(sequelize: Sequelize): typeof TableArea {
    TableArea.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            tableAreaName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: "table-areas",
            sequelize
        }
    );
    return TableArea;
}