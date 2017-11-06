import 'reflect-metadata';

import * as D from '../decorator';
import * as graphql from 'graphql';

import { clearFieldTypeCache, clearObjectTypeRepository, fieldTypeFactory, resolverFactory } from '../type-factory';

import { FieldMetadata } from '../metadata';
import { Middleware } from '../middleware';
import { getMetadataBuilder } from '../metadata-builder';

const assert = require('assert');

describe('field specs', function() {

  describe('resolverFactory', function() {
      beforeEach(function() {
          clearObjectTypeRepository();
          clearFieldTypeCache();
      });

      it('returns argumentConfigMap. The map has GraphQLInt type with a function which has number argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: number): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLInt);
      });

      it('returns argumentConfigMap. The map has GraphQLInt type with a function which has Number argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: Number): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLInt);
      });

      it('returns argumentConfigMap. The map has GraphQLString type with a function which has string argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: string): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLString);
      });

      it('returns argumentConfigMap. The map has GraphQLString type with a function which has String argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: String): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLString);
      });

      it('returns argumentConfigMap. The map has GraphQLBoolean type with a function which has boolean argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: boolean): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLBoolean);
      });

      it('returns argumentConfigMap. The map has GraphQLBoolean type with a function which has Boolean argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: Boolean): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLBoolean);
      });

      it('returns argumentConfigMap. The map has GraphQLObjectType with a function which has argument', function () {
          class Obj { @D.Field() m(@D.Arg({ name: 'input' }) input: Boolean): void {} }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const actual = resolverFactory(Obj, metadata, new Obj()).argumentConfigMap;
          assert(actual['input'].type === graphql.GraphQLBoolean);
      });

      it('returns fn which is executable', function() {
          class Obj { @D.Field() twice(@D.Arg({ name: 'input' }) input: number): number { return input * 2; } }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const fn = resolverFactory(Obj, metadata, new Obj()).fn;
          const actual = fn(new Obj(), {input: 1});
          assert(actual === 2);
      });

      describe('Before Middleware', () => {

        it('makes sure Before is executed before resolving', function(done) {

          let middleware: Middleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any): any => {
            assert(true);
            done();
          };
          class Obj { @D.Field() @D.Before(middleware) twice(input: number): number { console.log(input); return input * 2; } }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const fn = resolverFactory(Obj, metadata, new Obj()).fn;
          const actual = fn(new Obj(), {input: 1});
        });

        it('makes sure middleware can override function execution if next is called with a value', function() {

          let middleware: Middleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any): any => {
            next(null, 5);
          };
          class Obj { @D.Field() @D.Before(middleware) twice(input: number): number { return input * 2; } }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const fn = resolverFactory(Obj, metadata, new Obj()).fn;
          const actual = fn(new Obj(), {input: 1});
          assert(actual === 5);
        });

        // tslint:disable-next-line:max-line-length
        it('makes sure middleware can override function execution if next is called with a value even if it is null (as long it ir not undefined)', function() {

          let middleware: Middleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any): any => {
            next(null, null);
          };
          class Obj { @D.Field() @D.Before(middleware) twice(input: number): number { return input * 2; } }
          const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
          const fn = resolverFactory(Obj, metadata, new Obj()).fn;
          const actual = fn(new Obj(), {input: 1});
          assert(actual === null);
        });
      });

  });

  describe('fieldTypeFactory', function() {
      beforeEach(function() {
          clearObjectTypeRepository();
          clearFieldTypeCache();
      });
      describe('with implicit type', function() {
          it('returns null with a class which has no field', function() {
              class Obj {}
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual === null);
          });

          it('returns null with a class which has a field without @Field', function() {
              class Obj { title: any; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual === null);
          });

          it('returns GraphQLInt with a class which has a number field', function() {
              class Obj { @D.Field() count: number; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'Int');
          });

          it('returns GraphQLInt with a class which has a Number field', function() {
              class Obj { @D.Field() count: Number; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'Int');
          });

          it('returns GraphQLString with a class which has a string field', function() {
              class Obj { @D.Field() title: string; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'String');
          });

          it('returns GraphQLString with a class which has a String field', function() {
              class Obj { @D.Field() title: String; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'String');
          });

          it('returns GraphQLBoolean with a class which has a boolean field', function() {
              class Obj { @D.Field() isEnabled: boolean; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'Boolean');
          });

          it('returns GraphQLBoolean with a class which has a Boolean field', function() {
              class Obj { @D.Field() isEnabled: Boolean; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'Boolean');
          });

          it('returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType', function() {
              @D.ObjectType() class ChildObj { @D.Field() title: string; }
              class ParentObj { @D.Field() child: ChildObj; }
              const metadata = getMetadataBuilder().buildFieldMetadata(ParentObj.prototype)[0];
              const actual = fieldTypeFactory(ParentObj, metadata);
              assert(actual.type instanceof graphql.GraphQLObjectType);
          });

          it('returns description with a class which has description metadata', function () {
              class Obj { @D.Field({description: 'this is a title'}) title: string; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.description === 'this is a title');
          });

          it('returns resolve function with a class which has a function field', function() {
              class Obj { @D.Field() title(): string { return 'hello'; } }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(!!actual.resolve);
          });
      });

      describe('with explicit type', function() {
          it('returns any type which is set by explicitly', function() {
              class Obj { @D.Field({type: graphql.GraphQLID }) id: string; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLScalarType);
              assert(actual.type.name === 'ID');
          });

          it('returns GraphQLObjectType with a class which has a field of a class annotated @ObjectType', function() {
              @D.ObjectType() class ChildObj { @D.Field() title: string; }
              class ParentObj { @D.Field({type: ChildObj}) child: any; }
              const metadata = getMetadataBuilder().buildFieldMetadata(ParentObj.prototype)[0];
              const actual = fieldTypeFactory(ParentObj, metadata);
              assert(actual.type instanceof graphql.GraphQLObjectType);
          });

          it('returns resolve function with a class which has a function field', function() {
              class Obj { @D.Field({type: graphql.GraphQLString}) title() { return 'hello'; } }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.resolve() === 'hello');
          });
      });

      describe('with metadata options', function() {
          it('returns GraphQLNonNull with isNonNull option', function() {
              class Obj { @D.Field({nonNull: true}) title: string; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLNonNull);
          });

          it('returns GraphQLList with isList option', function() {
              class Obj { @D.Field({isList: true, type: graphql.GraphQLString}) users: string[]; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLList);
          });

          it('returns GraphQLNonNull with isList and isNonNull option', function() {
              class Obj { @D.Field({isList: true, nonNull: true, type: graphql.GraphQLString}) users: string[]; }
              const metadata = getMetadataBuilder().buildFieldMetadata(Obj.prototype)[0];
              const actual = fieldTypeFactory(Obj, metadata);
              assert(actual.type instanceof graphql.GraphQLNonNull);
          });
      });
  });
});
