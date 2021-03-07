import { Sequelize, Model, Optional, DataTypes, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyAddAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin} from "sequelize";
import { DatabaseType } from ".";
import { OrderModifier, OrderModifierCreationAttributes } from "./order-modifier";

/**
 * Attributes interface marks what attributes is available in an instance of this model(or an row in a table)
 */
interface ModifierAttributes {
    id: number;
    modifierName: string;
    price: string;
    tax: number;
    translations?: object;
}

/**
 * CreationAttributes interface marks additional attributes that should be available for creating data with include option
 */
export interface ModifierCreationAttributes extends Optional<ModifierAttributes, "id"> {
    OrderModifiers?: OrderModifierCreationAttributes[];
};

/**
 * A modifier can modify an OrderItem though OrderModifier, 
 * Modifiers are not directly linked to any OrderItem, 
 * OrderModifiers are linked to OrderItem in a way similar to Item and OrderItem, 
 */
export class Modifier extends Model<ModifierAttributes, ModifierCreationAttributes> implements ModifierAttributes {
    public id!: number;
    public modifierName!: string;
    public price!: string;
    public tax!: number;
    public translations?: object;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //has many OrderModifier
    public getOrderModifiers!: HasManyGetAssociationsMixin<OrderModifier>;
    public countOrderModifiers!: HasManyCountAssociationsMixin;
    public hasOrderModifier!: HasManyHasAssociationMixin<OrderModifier, number>;
    public hasOrderModifiers!: HasManyHasAssociationsMixin<OrderModifier, number>;
    public setOrderModifiers!: HasManySetAssociationsMixin<OrderModifier, number>;
    public addOrderModifier!: HasManyAddAssociationMixin<OrderModifier, number>;
    public addOrderModifiers!: HasManyAddAssociationsMixin<OrderModifier, number>;
    public removeOrderModifier!: HasManyRemoveAssociationMixin<OrderModifier, number>;
    public removeOrderModifiers!: HasManyRemoveAssociationsMixin<OrderModifier, number>;
    public createOrderModifier!: HasManyCreateAssociationMixin<OrderModifier>;
    public readonly OrderModifiers?: OrderModifier[];

    /**
     * used to declare associations, called by the model index, do not use this anywhere else 
     */
    public static associate(db: DatabaseType) {
        Modifier.hasMany(db.OrderModifier);
    }
}

/**
 * Factory function registers this model to sequelize, 
 * it describes the table, contents of this method decide the form of created table
 * it should return the Model so it can be put into the db object
 */
export default function ModifierFactory(sequelize: Sequelize): typeof Modifier {
    Modifier.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            modifierName: {
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
            translations: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            tableName: "modifiers",
            sequelize
        }
    );
    return Modifier;
}