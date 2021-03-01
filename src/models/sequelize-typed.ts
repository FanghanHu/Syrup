import { AssociationOptions, BelongsToManyOptions, BelongsToOptions, HasManyOptions, HasOneOptions, ModelAttributes, Optional, ModelCtor, Model, ModelOptions, Sequelize, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasOneCreateAssociationMixin, BelongsToGetAssociationMixin} from 'sequelize';

/**
 * An instance of a model
 */
interface ModelInstance<Attributes, CreationAttributes> extends Model<Attributes, CreationAttributes> {
    id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/**
 * any association will be related to a table
 */
type Association = {
    model: GetModelCtor<any, any>;
    options?: AssociationOptions;
}

/**
 * different types of association will have different relationship
 */
type HasOneAssociation = {
    relationship: "hasOne";
} & Association;

type BelongsToAssociation = {
    relationship: "belongsTo";
} & Association;

type HasManyAssociation = {
    relationship: "hasMany";
} & Association;

type BelongsToManyAssociation = {
    relationship: "belongsToMany";
    options: BelongsToManyOptions;
} & Association;

type ModelAssociationDeclearation = {
    [key: string]: HasOneAssociation | BelongsToAssociation | HasManyAssociation | BelongsToManyAssociation;
}

//TODO: remove these test code
// type TestType<T, U> = {
//     [key in keyof U] : U[key] extends HasOneAssociation? string : number;
// } 

// function test<T extends HasOneAssociation | BelongsToAssociation | HasManyAssociation | BelongsToManyAssociation, U extends ModelAssociationDeclearation>(obj : U): TestType<T, U> {
//     return {} as TestType<T, U>;
// }

// let result = test({
//     User: {relationship: "hasOne", model: {} as ModelCtor<Model>},
//     Project: {relationship: "belongsToMany", model: {} as ModelCtor<Model>, options: {} as BelongsToManyOptions},
// });


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
type ModelDeclearation<
Structure extends ModelStructure,
AssociationDeclearation extends ModelAssociationDeclearation
> = {
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

type GetAssociationMixins<AssociationDeclearation extends ModelAssociationDeclearation> = {
    [key in keyof AssociationDeclearation as `${AssociationDeclearation[key] extends HasOneAssociation? `get${key & string}`: ""}`]: HasOneGetAssociationMixin<AssociationDeclearation[key]["model"]["_modelType"]>;
} & {
    [key in keyof AssociationDeclearation as `${AssociationDeclearation[key] extends HasOneAssociation? `set${key & string}`: ""}`]: HasOneSetAssociationMixin<AssociationDeclearation[key]["model"]["_modelType"], number>;
} & {
    [key in keyof AssociationDeclearation as `${AssociationDeclearation[key] extends HasOneAssociation? `create${key & string}`: ""}`]: HasOneCreateAssociationMixin<AssociationDeclearation[key]["model"]["_modelType"]>;
} & {
    [key in keyof AssociationDeclearation as `${AssociationDeclearation[key] extends BelongsToAssociation? `get${key & string}`: ""}`]: BelongsToGetAssociationMixin<AssociationDeclearation[key]["model"]["_modelType"]>;
}

/**
 * create a {@link ModelCtor} type with Model attributes attached
 * TODO: add associations
 */
type GetModelCtor<
Structure extends ModelStructure,
AssociationDeclearation extends ModelAssociationDeclearation
> = ModelCtor<
ModelInstance<
    GetAttributes<Structure>,
    Optional<GetAttributes<Structure>, "id">
    > & GetAttributes<Structure> & GetAssociationMixins<AssociationDeclearation>
> & ModelType<
ModelInstance<
    GetAttributes<Structure>,
    Optional<GetAttributes<Structure>, "id">
    > & GetAttributes<Structure> & GetAssociationMixins<AssociationDeclearation>>;

type ModelType<TModel> = {
    /**
     * A dummy variable that doesn't exist on the real object. This exists so Typescript can infer the type of the attributes in static functions. Don't try to access this!
     */
    _modelType: TModel;
}

function defineModel<
Structure extends ModelStructure, 
AssociationDeclearation extends ModelAssociationDeclearation
>
(modelDeclearaction: ModelDeclearation<Structure, AssociationDeclearation>) :
GetModelCtor<Structure, AssociationDeclearation>
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
        for(const key in associations) {
            const association = associations[key];
            switch(association.relationship) {
                case "hasOne": 
                    ctor.hasOne(association.model);
                    break;
                case "belongsTo":
                    ctor.belongsTo(association.model);
                    break;
                case "hasMany":
                    ctor.hasMany(association.model);
                    break;
                case "belongsToMany":
                    ctor.belongsToMany(association.model, (association as BelongsToManyAssociation).options);
                    break;
            }
        }
    }

    return ctor as GetModelCtor<Structure, AssociationDeclearation>;
}

export default defineModel;