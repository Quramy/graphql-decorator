import * as D from "./decorator";
import { fieldTypeFactory , clearObjectTypeRepository } from "./schema_factory";
import * as assert from "assert";
const graphql = require("graphql");

describe("fieldTypeFactory", function() {
    beforeEach(function() {
        clearObjectTypeRepository();
    });

    describe("with implicit type", function() {
        it("returns null with a class which has no field", function() {
            class Obj {}
            const actual = fieldTypeFactory(Obj, {name: "title"});
            assert(actual === null);
        });

        it("returns null with a class which has a field without @Field", function() {
            class Obj { title: any; }
            const actual = fieldTypeFactory(Obj, {name: "title"});
            assert(actual === null);
        });

        it("returns GraphQLInt with a class which has a number field", function() {
            class Obj { @D.Field() count: number; }
            const actual = fieldTypeFactory(Obj, {name: "count"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "Int");
        });

        it("returns GraphQLString with a class which has a Number field", function() {
            class Obj { @D.Field() count: Number; }
            const actual = fieldTypeFactory(Obj, {name: "count"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "Int");
        });

        it("returns GraphQLString with a class which has a string field", function() {
            class Obj { @D.Field() title: string; }
            const actual = fieldTypeFactory(Obj, {name: "title"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "String");
        });

        it("returns GraphQLString with a class which has a String field", function() {
            class Obj { @D.Field() title: String; }
            const actual = fieldTypeFactory(Obj, {name: "title"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "String");
        });

        it("returns GraphQLBoolean with a class which has a boolean field", function() {
            class Obj { @D.Field() isEnabled: boolean; }
            const actual = fieldTypeFactory(Obj, {name: "isEnabled"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "Boolean");
        });

        it("returns GraphQLBoolean with a class which has a Boolean field", function() {
            class Obj { @D.Field() isEnabled: Boolean; }
            const actual = fieldTypeFactory(Obj, {name: "isEnabled"});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "Boolean");
        });

        it("returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType", function() {
            @D.ObjectType() class ChildObj { @D.Field() title: string; }
            class ParentObj { @D.Field() child: ChildObj; }
            const actual = fieldTypeFactory(ParentObj, {name: "child"});
            assert(actual.type instanceof graphql.GraphQLObjectType);
        });

        it("returns resolve function with a class which has a function field", function() {
            class Obj { @D.Field() title(): string { return "hello"; }; }
            const actual = fieldTypeFactory(Obj, {name: "title"});
            assert(actual.resolve === Obj.prototype.title);
        });
    });

    describe("with explicit type", function() {
        it("returns any type which is set by explicitly", function() {
            class Obj { @D.Field() id: string; }
            const actual = fieldTypeFactory(Obj, {name: "id", explicitType: graphql.GraphQLID});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === "ID");
        });

        it("returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType", function() {
            @D.ObjectType() class ChildObj { @D.Field() title: string; }
            class ParentObj { @D.Field({type: ChildObj}) child: any; }
            const actual = fieldTypeFactory(ParentObj, {name: "child", explicitType: ChildObj});
            assert(actual.type instanceof graphql.GraphQLObjectType);
        });

        it("returns resolve function with a class which has a function field", function() {
            class Obj { @D.Field() title() { return "hello"; } }
            const actual = fieldTypeFactory(Obj, {name: "title", explicitType: graphql.GraphQLString});
            assert(actual.resolve === Obj.prototype.title);
        });
    });

    describe("with metadata options", function() {
        it("returns GraphQLNonNull with isNonNull option", function() {
            class Obj { @D.Field() title: string; }
            const actual = fieldTypeFactory(Obj, {name: "title", isNonNull: true});
            assert(actual.type instanceof graphql.GraphQLNonNull);
        });

        it("returns GraphQLList with isList option", function() {
            class Obj { @D.Field() users: string[]; }
            const actual = fieldTypeFactory(Obj, {name: "title", isList: true, explicitType: graphql.GraphQLString});
            assert(actual.type instanceof graphql.GraphQLList);
        });

        it("returns GraphQLNonNull with isList and isNonNull option", function() {
            class Obj { @D.Field() users: string[]; }
            const actual = fieldTypeFactory(Obj, {name: "title", isNonNull: true, isList: true, explicitType: graphql.GraphQLString});
            assert(actual.type instanceof graphql.GraphQLNonNull);
        });
    });
});
