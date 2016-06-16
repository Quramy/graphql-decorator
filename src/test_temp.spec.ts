import "reflect-metadata";
import * as D from "./decorator";
import { schemaFactory , SchemaFactoryError , SchemaFactoryErrorType , objectTypeFactory , fieldTypeFactory } from "./schema_factory";
import * as assert from "assert";
import { FieldTypeMetadata } from "./decorator";

const graphql = require("graphql");
const parse = require("graphql/language").parse as (source: string) => any;
const execute = require("graphql/execution").execute as (schema: any, ast: any, ...args: any[]) => Promise<any>;

describe("Decorators", function() {
    describe("@Field", function() {
        it("creates empty FieldTypeMetadata", function() {
            class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.name === "someField");
        });

        it("set explicitType to FieldTypeMetadata with type option", function() {
            class Obj { @D.Field({type: graphql.GraphQLID}) someField: any; }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.name === "someField");
            assert(actual.explicitType === graphql.GraphQLID);
        });

        it("set isNonull to FieldTypeMetadata with @NonNull", function() {
            class Obj { @D.NonNull() @D.Field() someField: any; }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.name === "someField");
            assert(actual.isNonNull === true);
        });

        it("set isList to FieldTypeMetadata with @List", function() {
            class Obj { @D.List() @D.Field() users: Array<any>; }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.name === "users");
            assert(actual.isList === true);
        });

        it("set complex FieldTypeMetadata", function() {
            class Obj { @D.NonNull() @D.Field({type: graphql.GraphQLID}) someField: any; }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.name === "someField");
            assert(actual.explicitType === graphql.GraphQLID);
            assert(actual.isNonNull === true);
        });
    });
});

describe("objectTypeFactory", function() {
    it("throws an error with class which has no @Field field", function() {
        @D.ObjectType()
        class Obj { }
        try {
            objectTypeFactory(Obj);
            assert.fail();
        } catch (e) {
            const err = e as SchemaFactoryError;
            assert(err.type === SchemaFactoryErrorType.NO_FIELD);
        }
    });

    it("returns GraphQLObjectType with a Class which has string field", function() {
        @D.ObjectType()
        class Obj { @D.Field() title: string; }
        const GQLType = objectTypeFactory(Obj);
        assert(GQLType._typeConfig.name === "ObjType");
        assert(GQLType._typeConfig.fields.title.type instanceof graphql.GraphQLScalarType);
    });
});

describe("schemaFactory", function() {
    it("throws an error with no @Query schema class", function() {
        @D.Schema() class Schema { }
        try {
            schemaFactory(Schema);
            assert(false, "Assertion Error");
        } catch (e) {
            const err = e as SchemaFactoryError;
            assert(err.type === SchemaFactoryErrorType.NO_QUERY_FIELD);
        }
    });

    it("throws an error with Schema class which has an invalid Query class", function() {
        class Query { }
        @D.Schema() class Schema { @D.Query() query: Query; }
        try {
            schemaFactory(Schema);
            assert(false, "Assertion Error");
        } catch (e) {
            const err = e as SchemaFactoryError;
            // console.log(err.stack);
            // TODO
        }
    });

    it("returns a GraphQL schema object which is executable", async function(done) {
        @D.ObjectType() class Query {
            @D.Field() title(): string { return "hello"; }
        }
        @D.Schema() class Schema { @D.Query() query: Query; }
        const schema = schemaFactory(Schema);
        const ast = parse(`query { title }`);
        const actual = await execute(schema, ast) as {data: {title: string}};
        assert(actual.data.title === "hello");
        done();
    });
});
