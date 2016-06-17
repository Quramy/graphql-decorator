import "reflect-metadata";
import * as D from "./decorator";
import * as assert from "assert";
import { FieldTypeMetadata } from "./decorator";

const graphql = require("graphql");

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

    describe("@Arg", function() {
        it("creates FieldTypeMetadata whose has args", function() {
            class Obj { @D.Field() someFunction(@D.Arg({name: "input"}) input: any) { } }
            const actual = Reflect.getMetadata("gq_fields", Obj.prototype)[0] as FieldTypeMetadata;
            assert(actual.args[0].name === "input");
        });
    });
});
