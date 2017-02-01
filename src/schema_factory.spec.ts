import "reflect-metadata";
import * as assert from "assert";
import * as D from "./decorator";
import { schemaFactory , SchemaFactoryError , SchemaFactoryErrorType } from "./schema_factory";
import { clearObjectTypeRepository } from "./object_type_factory";

const graphql = require("graphql");
const parse = require("graphql/language").parse as (source: string) => any;
const validate = require("graphql/validation").validate as (schema: any, ast: any, ...args: any[]) => any[];
const execute = require("graphql/execution").execute as (schema: any, ast: any, ...args: any[]) => Promise<any>;

describe("schemaFactory", function() {
    beforeEach(function () {
        clearObjectTypeRepository();
    });

    it("throws an error with Schema class not annotated", function() {
        class Schema { }
        try {
            schemaFactory(Schema);
        } catch (e) {
            const err = e as SchemaFactoryError;
            assert(err.type === SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
        }
    });

    it("throws an error with Schema class which has no field annotated by @Query()", function() {
        @D.Schema() class Schema { }
        try {
            schemaFactory(Schema);
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

    it("returns a GraphQL schema object with @Query", function() {
        @D.ObjectType() class Query {
            @D.Field() title(): string { return "hello"; }
        }
        @D.Schema() class Schema { @D.Query() query: Query; }
        const schema = schemaFactory(Schema);
        const ast = parse(`query { title }`);
        assert.deepEqual(validate(schema, ast), []);
    });

    it("returns a GraphQL schema object with @Mutation", function() {
        @D.ObjectType() class Query {
            @D.Field() title(): string { return "hello"; }
        }
        @D.ObjectType() class Mutation {
            @D.Field() countup(): number { return 0; }
        }
        @D.Schema() class Schema {
            @D.Query() query: Query;
            @D.Mutation() mutation: Mutation;
        }
        const schema = schemaFactory(Schema);
        const ast = parse(`mutation { countup }`);
        assert.deepEqual(validate(schema, ast), []);
    });

    it("returns a GraphQL schema object which is executable", async function(done: any) {
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

    it("returns a GraphQL schema object which is executable", async function(done: any) {
        @D.ObjectType() class Query {
            @D.Field() twice( @D.Arg({name: "input"}) input: number): number {
                return input * 2;
            }
        }
        @D.Schema() class Schema { @D.Query() query: Query; }
        const schema = schemaFactory(Schema);
        const ast = parse(`query { twice(input: 1) }`);
        assert.deepEqual(validate(schema, ast), []);
        const actual = await execute(schema, ast) as {data: {twice: number}};
        assert(actual.data.twice === 2);
        done();
    });

    it("returns a GraphQL schema object which is executable", async function(done: any) {
        @D.InputObjectType() class Input {
            @D.Field() a: number;
            @D.Field() b: number;
        }
        @D.ObjectType() class Query {
            @D.Field() add( @D.Arg({name: "input"}) input: Input): number {
                return input.a + input.b;
            }
        }
        @D.Schema() class Schema { @D.Query() query: Query; }
        const schema = schemaFactory(Schema);
        const ast = parse(
            `query {
                add(input: {a: 1, b: 1})
            }`
        );
        assert.deepEqual(validate(schema, ast), []);
        const actual = await execute(schema, ast) as {data: {add: number}};
        assert(actual.data.add === 2);
        done();
    });
});
