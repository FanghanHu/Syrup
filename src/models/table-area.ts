import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { DatabaseType } from ".";
import { Table, TableCreationAttributes } from "./table";

interface TableAreaAttributes {
    id: number;
    tableAreaName: string;
}

export interface TableAreaCreationAttributes extends Optional<TableAreaAttributes, "id"> {
    Tables?: TableCreationAttributes[];
};

export class TableArea extends Model<TableAreaAttributes, TableAreaCreationAttributes> implements TableAreaAttributes {
    public id!: number;
    public tableAreaName!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many Table
    public getTables !: HasManyGetAssociationsMixin<Table>;
    public addTable !: HasManyAddAssociationsMixin<Table, number>;
    public hasTable !: HasManyHasAssociationMixin<Table, number>;
    public countTables !: HasManyCountAssociationsMixin;
    public createTable !: HasManyCreateAssociationMixin<Table>;
    public readonly Tables?: Table[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        TableArea.hasMany(db.Table);
    }
}

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