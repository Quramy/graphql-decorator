import 'reflect-metadata';

import * as D from '../decorator';
import * as graphql from 'graphql';

import { SchemaFactoryError, SchemaFactoryErrorType, schemaFactory } from '../type-factory';
import { clearFieldTypeCache, clearObjectTypeRepository } from '../type-factory';

import { GraphQLString } from 'graphql';
import { OrderByItem } from '../order-by-item';
import { execute } from 'graphql/execution';
import { getMetadataArgsStorage } from '../metadata-builder';
import { parse } from 'graphql/language';
import { validate } from 'graphql/validation';

const assert = require('assert');

// const parse = require("graphql/language").parse as (source: string) => any;
// const validate = require("graphql/validation").validate as (schema: any, ast: any, ...args: any[]) => any[];
// const execute = require("graphql/execution").execute as (schema: any, ast: any, ...args: any[]) => Promise<any>;

process.on('unhandledRejection', (up: any) => { throw up; });

describe('schemaFactory', function () {
  beforeEach(function () {
    clearObjectTypeRepository();
    clearFieldTypeCache();
  });

  it('throws an error with Schema class not annotated', function () {
    class Schema { }
    try {
      schemaFactory(Schema);
    } catch (e) {
      const err = e as SchemaFactoryError;
      assert(err.type === SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
    }
  });

  it('throws an error with Schema class which has no field annotated by @Query()', function () {
    @D.Schema() class Schema { }
    try {
      schemaFactory(Schema);
    } catch (e) {
      const err = e as SchemaFactoryError;
      assert(err.type === SchemaFactoryErrorType.NO_QUERY_FIELD);
    }
  });

  it('throws an error with Schema class which has an invalid Query class', function () {
    class Query { }
    @D.Schema() class Schema { @D.Query() query: Query; }
    try {
      schemaFactory(Schema);
      assert(false, 'Assertion Error');
    } catch (e) {
      const err = e as SchemaFactoryError;
      // console.log(err.stack);
      // TODO
    }
  });

  it('returns a GraphQL schema object with @Query', function () {
    @D.ObjectType() class Query {
      @D.Field() title(): string { return 'hello'; }
    }
    @D.Schema() class Schema { @D.Query() query: Query; }
    const schema = schemaFactory(Schema);
    const ast = parse(`query { title }`);
    assert.deepEqual(validate(schema, ast), []);
  });

  it('returns a GraphQL schema object with @Mutation', function () {
    @D.ObjectType() class Query {
      @D.Field() title(): string { return 'hello'; }
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

  it('returns a GraphQL schema object which is executable', async function (done: any) {
    @D.ObjectType() class Query {
      @D.Field() title(): string { return 'hello'; }
    }
    @D.Schema() class Schema { @D.Query() query: Query; }
    const schema = schemaFactory(Schema);
    const ast = parse(`query { title }`);
    const actual = await execute(schema, ast) as { data: { title: string } };
    assert(actual.data.title === 'hello');
    done();
  });

  it('returns a GraphQL schema object which is executable', async function (done: any) {
    @D.ObjectType() class Query {
      @D.Field() twice( @D.Arg({ name: 'input' }) input: number): number {
        return input * 2;
      }
    }
    @D.Schema() class Schema { @D.Query() query: Query; }
    const schema = schemaFactory(Schema);
    const ast = parse(`query { twice(input: 1) }`);
    assert.deepEqual(validate(schema, ast), []);
    const actual = await execute(schema, ast) as { data: { twice: number } };
    assert(actual.data.twice === 2);
    done();
  });

  it('returns a GraphQL schema object which is executable', async function (done: any) {
    @D.InputObjectType() class Input {
      @D.Field() a: number;
      @D.Field() b: number;
    }
    @D.ObjectType() class Query {
      @D.Field() add( @D.Arg({ name: 'input' }) input: Input): number {
        return input.a + input.b;
      }
    }
    @D.Schema() class Schema { @D.Query() query: Query; }
    const schema = schemaFactory(Schema);
    const ast = parse(
      `query {
                add(input: {a: 1, b: 1})
            }`,
    );
    assert.deepEqual(validate(schema, ast), []);
    const actual = await execute(schema, ast) as { data: { add: number } };
    assert(actual.data.add === 2);
    done();
  });

  describe('Field type name duplication', async function () {

    @D.EnumType()
    class EnumObj {
      @D.Value('A')
      @D.Field({ type: GraphQLString })
      A: string;

      @D.Value('B')
      @D.Field({ type: GraphQLString })
      B: string;
    }

    @D.InputObjectType()
    class AnInputObj {
      @D.Field({ type: EnumObj, description: 'a field' })
      anInputField: string;
    }

    it('Does not fail for enum being used on input and object types simultaneously', async function () {

      @D.ObjectType()
      class JustAnObj {
        @D.Field({ type: EnumObj, description: 'another field' })
        anObjectField: string;
      }

      @D.ObjectType() class Query {
        @D.Field({ type: JustAnObj }) twice( @D.Arg({ name: 'input', type: AnInputObj }) input: AnInputObj): JustAnObj {
          return {
            anObjectField: 'B',
          };
        }
      }

      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`query { twice(input: {anInputField: A}) { anObjectField } }`);
      assert.deepEqual(validate(schema, ast), []);

    });

    it('Does not fail for enum being used on input and object types simultaneously even with @NonNull', async function () {

      @D.ObjectType()
      class JustAnObj {
        @D.Field({ type: EnumObj, nonNull: true, description: 'another field' })
        anObjectField: string;
      }

      @D.ObjectType() class Query {
        @D.Field({ type: JustAnObj }) twice( @D.Arg({ name: 'input', type: AnInputObj }) input: AnInputObj): JustAnObj {
          return {
            anObjectField: 'B',
          };
        }
      }

      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`query { twice(input: {anInputField: A}) { anObjectField } }`);
      assert.deepEqual(validate(schema, ast), []);

    });

    it('Does not fail for enum being used on input and object types simultaneously even with @List', async function () {

      @D.ObjectType()
      class JustAnObj {
        @D.Field({ type: EnumObj, isList: true, description: 'another field' })
        anObjectField: string[];
      }

      @D.ObjectType() class Query {
        @D.Field({ type: JustAnObj }) twice( @D.Arg({ name: 'input', type: AnInputObj }) input: AnInputObj): JustAnObj {
          return {
            anObjectField: ['B'],
          };
        }
      }

      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`query { twice(input: {anInputField: A}) { anObjectField } }`);
      assert.deepEqual(validate(schema, ast), []);

    });


    it('Does not fail for enum being used on input and object types simultaneously even with @List and @NonNull', async function () {

      @D.ObjectType()
      class JustAnObj {
        @D.Field({ type: EnumObj, nonNull: true, isList: true, description: 'another field' })
        anObjectField: string[];
      }

      @D.ObjectType() class Query {
        @D.Field({ type: JustAnObj }) twice( @D.Arg({ name: 'input', type: AnInputObj }) input: AnInputObj): JustAnObj {
          return {
            anObjectField: ['B'],
          };
        }
      }

      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`query { twice(input: {anInputField: A}) { anObjectField } }`);
      assert.deepEqual(validate(schema, ast), []);

    });

  });

  describe('Pagination', function () {

    it('returns a GraphQL Pagination object with custom @OrberBy fields', async function () {
      @D.ObjectType()
      class Obj {
        @D.Field({ type: GraphQLString, description: 'a field' })
        aField: string;
      }

      @D.ObjectType() class Query {
        @D.Field({ type: Obj, pagination: true })
        async paginate(
          @D.OrderBy({ extraColumns: ['extraField'] }) orderBy?: OrderByItem[],
        ): Promise<[Obj, number]> {
          return [{ aField: null }, 0];
        }
      }
      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`
          query {
            paginate(orderBy: [{sort: aField, direction: ASC}, {sort: extraField, direction: DESC}]) {
              count
            }
          }`);
      assert.deepEqual(validate(schema, ast), []);
    });

    it('returns a GraphQL Pagination object with custom @OrberBy fields (backwards compatibility)', async function () {
      @D.ObjectType()
      class Obj {

        @D.Field({ type: GraphQLString, description: 'a field' })
        aField: string;
      }

      @D.ObjectType() class Query {
        @D.Field({ type: Obj, pagination: true })
        async paginate(
          @D.OrderBy(['extraField']) orderBy?: OrderByItem[],
        ): Promise<[Obj, number]> {
          return [{ aField: null }, 0];
        }
      }
      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`
        query {
          paginate(orderBy: [{sort: aField, direction: ASC}, {sort: extraField, direction: DESC}]) {
            count
          }
        }`);
      assert.deepEqual(validate(schema, ast), []);
    });

    it('returns a GraphQL Pagination object with custom @OrberBy fields ignoring schema fields', async function () {

      @D.ObjectType()
      class Obj {
        @D.Field({ type: GraphQLString, description: 'a field' })
        aField: string;
      }

      @D.ObjectType() class Query {
        @D.Field({ type: Obj, pagination: true })
        async paginate(
          @D.OrderBy({ extraColumns: ['extraField'], shouldIgnoreSchemaFields: true }) orderBy?: OrderByItem[],
        ): Promise<[Obj, number]> {
          return [{ aField: null }, 0];
        }
      }
      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const astToIgnore = parse(`
        query {
          paginate(orderBy: [{sort: extraField, direction: DESC}]) {
            count
          }
        }`);
      const astToError = parse(`
        query {
          paginate(orderBy: [{sort: aField, direction: ASC}, {sort: extraField, direction: DESC}]) {
            count
          }
        }`);
      assert.deepEqual(validate(schema, astToIgnore), [], 'should ignore schema fields');
      assert.equal(validate(schema, astToError).length, 1, 'should error if an schema fields is provided');

    });

  });

  describe('UnionType', () => {

    it('creates schema with union type', () => {

      @D.ObjectType()
      class ObjA { @D.Field() fieldA: string; }

      @D.ObjectType()
      class ObjB { @D.Field() fieldB: string; }

      type MyType = ObjA | ObjB;
      @D.UnionType<MyType>({
        types: [ObjA, ObjB],
        resolver: (obj: any): string | null => {
          if (obj.fieldA) { return ObjA.name; }
          if (obj.fieldB) { return ObjB.name; }
          return null;
        },
      })
      class MyUnionType { }


      @D.ObjectType() class Query {
        @D.Field({ type: MyUnionType })
        async aQuery(): Promise<MyType> {
          return { fieldA: '' };
        }
      }
      @D.Schema() class Schema { @D.Query() query: Query; }
      const schema = schemaFactory(Schema);
      const ast = parse(`
            query {
              aQuery {
                ...on ObjA {
                  fieldA
                }
                ...on ObjB {
                  fieldB
                }
              }
            }`);

      assert.deepEqual(validate(schema, ast), []);

    });

  });



});
