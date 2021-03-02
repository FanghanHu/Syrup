import { Association, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin } from "sequelize/types";
import { TableArea, TableAreaCreationAttributes } from "./table-areas";

interface TableAttributes {
    id: number;
    tableName: string;
    x: number;
    y: number;
    icon: string;
}

export interface TableCreationAttributes extends Optional<TableAttributes, "id"> {
    TableArea?: TableAreaCreationAttributes;
};

export class Table extends Model<TableAttributes, TableCreationAttributes> implements TableAttributes {
    public id!: number;
    public tableName!: string;
    public x!: number;
    public y!: number;
    public icon!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //TODO: has many Order
    // public getButtons !: HasManyGetAssociationsMixin<Button>;
    // public addButton !: HasManyAddAssociationsMixin<Button, number>;
    // public hasButton !: HasManyHasAssociationMixin<Button, number>;
    // public countButtons !: HasManyCountAssociationsMixin;
    // public createButton !: HasManyCreateAssociationMixin<Button>;

    //public readonly buttons?: Button[];
    public readonly table?: Table;

    public static associations: {
        //buttons: Association<Table, Button>;
        tableArea: Association<Table, TableArea>
    }
}

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