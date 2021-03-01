import { AssociationOptions, BelongsToManyOptions, BelongsToOptions, HasManyOptions, HasOneOptions, ModelAttributes, Optional, ModelCtor, Model, ModelOptions, Sequelize, Association} from 'sequelize';

/**
 * An instance of a model
 */
interface ModelInstance<Attributes, CreationAttributes> extends Model<Attributes, CreationAttributes> {
    id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/**
 * an object that describ one association towards one other model
 */
type ModelAssociation<Options extends AssociationOptions> = {
    model: ModelCtor<Model>;
    options?: Options;
}

/**
 * BelongsToMany requires options
 */
type BelongsToManyAssociation = {
    model: ModelCtor<Model>;
    options: BelongsToManyOptions;
}

type ModelAssociationDeclearation = {
    hasOne?: ModelAssociation<HasOneOptions>[];
    belongsTo?: ModelAssociation<BelongsToOptions>[];
    hasMany?: ModelAssociation<HasManyOptions>[];
    belongsToMany?: BelongsToManyAssociation[];
}



/**
     * mostly like {@link ModelAttributes}, but also have a instanceType for each attribute which represents the type for the property, use "{} as TYPE" to mark the type 
     * 
     * ## for example
     * ```
        const Project = createModel({
            name: "Project",
            structure: {
                projectName: {
                    type: DataTypes.STRING,
                    instanceType: {} as string
                },
                cost: {
                    type: DataTypes.FLOAT,
                    instanceType: {} as number
                }
            }
        });
     * ```
     */
type ModelStructure = {
    [x: string] : {
        instanceType: any;
    };
} & ModelAttributes;

/**
 * This is different from what the sequlize define take, it contains all the information to create a table
 */
type ModelDeclearation<Structure extends ModelStructure = ModelStructure, AssociationDeclearation extends ModelAssociationDeclearation = ModelAssociationDeclearation> = {
    /**
     * name of the model
     */
    name: string;
    modelOption?: ModelOptions;
    structure: Structure;
    sequelize: Sequelize;
    associations?: AssociationDeclearation;
}

/*
 * This type builds an Attribute type from ModelStructure, using type of instanceType in each propertie 
 * declearation as each property's type
 */
type GetAttributes<Structure extends ModelStructure> = {
    [prop in keyof Structure]: Structure[prop][keyof Structure[prop] & "instanceType"]
}

/**
 * create a {@link ModelCtor} type with Model attributes attached
 * TODO: add associations
 */
type GetModelCtor<Structure extends ModelStructure> = ModelCtor<ModelInstance<GetAttributes<Structure>, Optional<GetAttributes<Structure>, "id">> & GetAttributes<Structure>>;

function defineModel<Structure extends ModelStructure, AssociationDeclearation extends ModelAssociationDeclearation>
(modelDeclearaction: ModelDeclearation<Structure, AssociationDeclearation>) :
GetModelCtor<Structure>
{
    const sequelize = modelDeclearaction.sequelize;
    if(!sequelize) {
        throw "You must provide a database connection.";
    }

    //create the model
    const ctor = sequelize.define(modelDeclearaction.name, modelDeclearaction.structure, modelDeclearaction.modelOption);

    //make associations
    if(modelDeclearaction.associations) {
        const associations = modelDeclearaction.associations;
        if(associations.hasOne) {
            for(const association of associations.hasOne) {
                ctor.hasOne(association.model, association.options);
            }
        }
        if(associations.belongsTo) {
            for(const association of associations.belongsTo) {
                ctor.belongsTo(association.model, association.options);
            }
        }
        if(associations.hasMany) {
            for(const association of associations.hasMany) {
                ctor.hasMany(association.model, association.options);
            }
        }
        if(associations.belongsToMany) {
            for(const association of associations.belongsToMany) {
                ctor.belongsToMany(association.model, association.options);
            }
        }
    }

    return ctor as GetModelCtor<Structure>;
}

export default defineModel;