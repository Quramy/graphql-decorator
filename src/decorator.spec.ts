import "reflect-metadata";
import * as D from "./decorator";
import * as assert from "assert";
import { FieldTypeMetadata , GQ_FIELDS_KEY , getFieldMetadata , GQ_OBJECT_METADATA_KEY , ObjectTypeMetadata } from "./decorator";

const graphql = require("graphql");

describe("Decorators", function() {
    describe("@ObjectType", function () {
        it("creates empty ObjectTypeMetadata", function () {
            @D.ObjectType() class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === false);
            assert(actual.name === "Obj");
        });

        it("set description to ObjectTypeMetadata with @Description", function () {
            @D.Description("this is a object type") @D.ObjectType()
            class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === false);
            assert(actual.name === "Obj");
            assert(actual.description === "this is a object type");
        });
    });

    describe("@Field", function() {
        it("creates empty FieldTypeMetadata", function() {
            class Obj { @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
        });

        it("set explicitType to FieldTypeMetadata with type option", function() {
            class Obj { @D.Field({type: graphql.GraphQLID}) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
            assert(actual.explicitType === graphql.GraphQLID);
        });

        it("set description to FieldTypeMetadata with @Description", function() {
            class Obj { @D.Description("some field") @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
            assert(actual.description === "some field");
        });

        it("set isNonull to FieldTypeMetadata with @NonNull", function() {
            class Obj { @D.NonNull() @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
            assert(actual.isNonNull === true);
        });

        it("set isList to FieldTypeMetadata with @List", function() {
            class Obj { @D.List() @D.Field() someField: Array<any>; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
            assert(actual.isList === true);
        });

        it("set complex FieldTypeMetadata", function() {
            class Obj { @D.NonNull() @D.Field({type: graphql.GraphQLID}) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, "someField");
            assert(actual.name === "someField");
            assert(actual.explicitType === graphql.GraphQLID);
            assert(actual.isNonNull === true);
        });
    });

    describe("@Arg", function() {
        it("creates FieldTypeMetadata whose has args", function() {
            class Obj { @D.Field() someFunction(@D.Arg({name: "input"}) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, "someFunction").args[0];
            assert(actual.name === "input");
        });

        it("set description to ArgumentMetadata with @Description", function() {
            class Obj { @D.Field() someFunction(@D.Description("some input") @D.Arg({name: "input"}) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, "someFunction").args[0];
            assert(actual.name === "input");
            assert(actual.description === "some input");
        });

        it("set isNonNull to ArgumentMetadata with @NonNull", function() {
            class Obj { @D.Field() someFunction(@D.NonNull() @D.Arg({name: "input"}) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, "someFunction").args[0];
            assert(actual.name === "input");
            assert(actual.isNonNull === true);
        });

        it("set isNonNull to ArgumentMetadata with @List", function() {
            class Obj { @D.Field() someFunction(@D.List() @D.Arg({name: "input"}) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, "someFunction").args[0];
            assert(actual.name === "input");
            assert(actual.isList === true);
        });
    });
});
