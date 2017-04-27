import * as D from './decorator';
import { clearObjectTypeRepository } from './object_type_factory';
import { fieldTypeFactory , resolverFactory } from './field_type_factory';
import * as graphql from 'graphql';
const assert = require('assert');

describe('resolverFactory', function() {
    beforeEach(function() {
        clearObjectTypeRepository();
    });

    it('returns argumentConfigMap. The map has GraphQLInt type with a function which has number argument', function () {
        class Obj { @D.Field() m(input: number): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLInt);
    });

    it('returns argumentConfigMap. The map has GraphQLInt type with a function which has Number argument', function () {
        class Obj { @D.Field() m(input: Number): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLInt);
    });

    it('returns argumentConfigMap. The map has GraphQLString type with a function which has string argument', function () {
        class Obj { @D.Field() m(input: string): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLString);
    });

    it('returns argumentConfigMap. The map has GraphQLString type with a function which has String argument', function () {
        class Obj { @D.Field() m(input: String): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLString);
    });

    it('returns argumentConfigMap. The map has GraphQLBoolean type with a function which has boolean argument', function () {
        class Obj { @D.Field() m(input: boolean): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLBoolean);
    });

    it('returns argumentConfigMap. The map has GraphQLBoolean type with a function which has Boolean argument', function () {
        class Obj { @D.Field() m(input: Boolean): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLBoolean);
    });

    it('returns argumentConfigMap. The map has GraphQLObjectType with a function which has argument', function () {
        class Obj { @D.Field() m(input: Boolean): void {} }
        const actual = resolverFactory(Obj, 'm', [{name: 'input'}]).argumentConfigMap;
        assert(actual['input'].type === graphql.GraphQLBoolean);
    });

    it('returns fn which is executable', function() {
        class Obj { @D.Field() twice(input: number): number { return input * 2; } }
        const fn = resolverFactory(Obj, 'twice', [{name: 'input'}]).fn;
        const actual = fn(new Obj(), {input: 1});
        assert(actual === 2);
    });
});

describe('fieldTypeFactory', function() {
    describe('with implicit type', function() {
        it('returns null with a class which has no field', function() {
            class Obj {}
            const actual = fieldTypeFactory(Obj, {name: 'title'});
            assert(actual === null);
        });

        it('returns null with a class which has a field without @Field', function() {
            class Obj { title: any; }
            const actual = fieldTypeFactory(Obj, {name: 'title'});
            assert(actual === null);
        });

        it('returns GraphQLInt with a class which has a number field', function() {
            class Obj { @D.Field() count: number; }
            const actual = fieldTypeFactory(Obj, {name: 'count'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'Int');
        });

        it('returns GraphQLInt with a class which has a Number field', function() {
            class Obj { @D.Field() count: Number; }
            const actual = fieldTypeFactory(Obj, {name: 'count'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'Int');
        });

        it('returns GraphQLString with a class which has a string field', function() {
            class Obj { @D.Field() title: string; }
            const actual = fieldTypeFactory(Obj, {name: 'title'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'String');
        });

        it('returns GraphQLString with a class which has a String field', function() {
            class Obj { @D.Field() title: String; }
            const actual = fieldTypeFactory(Obj, {name: 'title'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'String');
        });

        it('returns GraphQLBoolean with a class which has a boolean field', function() {
            class Obj { @D.Field() isEnabled: boolean; }
            const actual = fieldTypeFactory(Obj, {name: 'isEnabled'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'Boolean');
        });

        it('returns GraphQLBoolean with a class which has a Boolean field', function() {
            class Obj { @D.Field() isEnabled: Boolean; }
            const actual = fieldTypeFactory(Obj, {name: 'isEnabled'});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'Boolean');
        });

        it('returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType', function() {
            @D.ObjectType() class ChildObj { @D.Field() title: string; }
            class ParentObj { @D.Field() child: ChildObj; }
            const actual = fieldTypeFactory(ParentObj, {name: 'child'});
            assert(actual.type instanceof graphql.GraphQLObjectType);
        });

        it('returns description with a class which has description metadata', function () {
            class Obj { @D.Field() title: string; }
            const actual = fieldTypeFactory(Obj, {name: 'title', description: 'this is a title'});
            assert(actual.description === 'this is a title');
        });

        it('returns resolve function with a class which has a function field', function() {
            class Obj { @D.Field() title(): string { return 'hello'; } }
            const actual = fieldTypeFactory(Obj, {name: 'title'});
            assert(!!actual.resolve);
        });
    });

    describe('with explicit type', function() {
        it('returns any type which is set by explicitly', function() {
            class Obj { @D.Field() id: string; }
            const actual = fieldTypeFactory(Obj, {name: 'id', explicitType: graphql.GraphQLID});
            assert(actual.type instanceof graphql.GraphQLScalarType);
            assert(actual.type.name === 'ID');
        });

        it('returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType', function() {
            @D.ObjectType() class ChildObj { @D.Field() title: string; }
            class ParentObj { @D.Field({type: ChildObj}) child: any; }
            const actual = fieldTypeFactory(ParentObj, {name: 'child', explicitType: ChildObj});
            assert(actual.type instanceof graphql.GraphQLObjectType);
        });

        it('returns resolve function with a class which has a function field', function() {
            class Obj { @D.Field() title() { return 'hello'; } }
            const actual = fieldTypeFactory(Obj, {name: 'title', explicitType: graphql.GraphQLString});
            assert(!!actual.resolve);
        });
    });

    describe('with metadata options', function() {
        it('returns GraphQLNonNull with isNonNull option', function() {
            class Obj { @D.Field() title: string; }
            const actual = fieldTypeFactory(Obj, {name: 'title', isNonNull: true});
            assert(actual.type instanceof graphql.GraphQLNonNull);
        });

        it('returns GraphQLList with isList option', function() {
            class Obj { @D.Field() users: string[]; }
            const actual = fieldTypeFactory(Obj, {name: 'title', isList: true, explicitType: graphql.GraphQLString});
            assert(actual.type instanceof graphql.GraphQLList);
        });

        it('returns GraphQLNonNull with isList and isNonNull option', function() {
            class Obj { @D.Field() users: string[]; }
            const actual = fieldTypeFactory(Obj, {name: 'title', isNonNull: true, isList: true, explicitType: graphql.GraphQLString});
            assert(actual.type instanceof graphql.GraphQLNonNull);
        });
    });
});
