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
    public getButtons !: HasManyGetAssociationsMixin<Table>;
    public addButton !: HasManyAddAssociationsMixin<Table, number>;
    public hasButton !: HasManyHasAssociationMixin<Table, number>;
    public countButtons !: HasManyCountAssociationsMixin;
    public createButton !: HasManyCreateAssociationMixin<Table>;

    public readonly tables?: Table[];

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