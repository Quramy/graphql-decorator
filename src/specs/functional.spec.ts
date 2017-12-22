import 'reflect-metadata';

import * as D from '../decorator';
import * as graphql from 'graphql';

import { IoCContainer } from '../ioc-container';
import { schemaFactory } from '../type-factory';
import { useContainer } from '../use-container';

const assert = require('assert');

describe('Functional', function () {

  describe('Query', function () {

    describe('Field', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field()
        greeting(): string {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        greetingAsPromise(): Promise<string> {
          return Promise.resolve('Hello, world!');
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { greeting } `);
        assert(result.data.greeting === 'Hello, world!');
      });

      it('resolves @Field as Promise', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { greetingAsPromise } `);
        assert(result.data.greetingAsPromise === 'Hello, world!');
      });

    });

    describe('Arg', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field()
        greeting(
          @D.Arg({ name: 'arg', description: 'any desc' }) arg: string,
        ): string {
          return `Hello, ${arg}!`;
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field with @Arg input value', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { greeting(arg: "world") } `);
        assert(result.data.greeting === 'Hello, world!');
      });

    });

    describe('List', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field({ isList: true, type: graphql.GraphQLString })
        async list(): Promise<string[]> {
          return ['Hello, world!'];
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field with isList', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `
          query {
            list
          }
        `);
        assert(result.data.list.length === 1);
        assert(result.data.list[0] === 'Hello, world!');
      });

    });

    describe('Pagination', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field({ pagination: true, type: graphql.GraphQLString })
        async paginated(
          @D.Arg({ name: 'offset', type: graphql.GraphQLInt }) offset: number,
          @D.Arg({ name: 'limit', type: graphql.GraphQLInt }) limit: number,
          @D.Arg({ name: 'value', type: graphql.GraphQLString }) value: string,
          @D.Ctx() context: any,
        ): Promise<[string[], number]> {
          const items = [`Hello, ${value}!`, `Hello again, ${value}!`, `Hi, ${value}!`];
          return [items.slice(offset, offset + limit), items.length];
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field with pagination for first page', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `
          query {
            paginated(value: "world", offset: 0, limit: 1) {
              count
              nodes
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `);
        assert(result.data.paginated.count === 3);
        assert(result.data.paginated.nodes.length === 1);
        assert(result.data.paginated.nodes[0] === 'Hello, world!');
        assert(result.data.paginated.pageInfo.hasNextPage === true);
        assert(result.data.paginated.pageInfo.hasPreviousPage === false);
      });

      it('resolves @Field with pagination middle page', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `
          query {
            paginated(value: "world", offset: 1, limit: 1) {
              count
              nodes
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `);
        assert(result.data.paginated.count === 3);
        assert(result.data.paginated.nodes.length === 1);
        assert(result.data.paginated.nodes[0] === 'Hello again, world!');
        assert(result.data.paginated.pageInfo.hasNextPage === true);
        assert(result.data.paginated.pageInfo.hasPreviousPage === true);
      });

      it('resolves @Field with pagination for last page', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `
          query {
            paginated(value: "world", offset: 2, limit: 1) {
              count
              nodes
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `);
        assert(result.data.paginated.count === 3);
        assert(result.data.paginated.nodes.length === 1);
        assert(result.data.paginated.nodes[0] === 'Hi, world!');
        assert(result.data.paginated.pageInfo.hasNextPage === false);
        assert(result.data.paginated.pageInfo.hasPreviousPage === true);
      });

    });

    describe('Before Middleware', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field({ type: graphql.GraphQLString })
        @D.Before({
          middleware: (context, args, next) => next(null, 'Hello from middleware'),
        })
        async replace(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.Before({ middleware: (context, args, next) => next() })
        async ignore(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.Before({ middleware: (context, args, next) => next(new Error('Error from middleware'), 'x') })
        async callError(): Promise<string> {
          return 'Hello, world!';
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field decorated with @Before Middleware replacing resolver', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { replace }`);
        assert(result.data.replace === 'Hello from middleware');
      });

      it('resolves @Field decorated with @Before Middleware and returning from resolver', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { ignore }`);
        assert(result.data.ignore === 'Hello, world!');
      });

      it('resolves @Field decorated with @Before Middleware and erroring', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { callError }`);

        assert(result.data.callError === null);
        assert(typeof (result.errors) !== 'undefined');
        assert(result.errors.length === 1);
        assert(result.errors[0].message === 'Error from middleware');
      });

    });

    describe('After Middleware', function () {

      @D.ObjectType()
      class ChangedReturnType {
        @D.Field({ nonNull: true })
        data: string;
      }

      @D.ObjectType()
      class QueryType {
        @D.Field({ type: graphql.GraphQLString })
        @D.After({
          middleware: (context, args, result, next) => next(null, 'Hello from middleware'),
        })
        async replace(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: ChangedReturnType })
        @D.After({
          middleware: async (
            context,
            args,
            result: Promise<string>,
            next: (error?: Error, value?: ChangedReturnType) => void,
          ) => {
            let changedReturnType = {
              data: (await result),
            };
            next(null, changedReturnType);
          },
        })
        async changeReturnType(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.After({
          middleware: (context, args, result, next) => {
            if (args.replace) {
              next(null, 'Hello from middleware');
            } else {
              next();
            }
          },
        })
        async replaceWithCondition(
          @D.Arg({ name: 'replace', description: 'any desc' }) replace: boolean,
        ): Promise<string> {
          return 'Hello!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.After({
          middleware: (context, args, result, next) => {
            next(null, Promise.resolve(result).then(str => str.replace('world', 'after middleware')));
          },
        })
        async modifyResult(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.After({ middleware: (context, args, result, next) => next() })
        async ignore(): Promise<string> {
          return 'Hello, world!';
        }

        @D.Field({ type: graphql.GraphQLString })
        @D.After({ middleware: (context, args, result, next) => next(new Error('Error from middleware'), 'x') })
        async callError(): Promise<string> {
          return 'Hello, world!';
        }

      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @Field decorated with @After Middleware replacing resolver', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { replace }`);
        assert(result.data.replace === 'Hello from middleware');
      });

      it('resolves @Field decorated with @After Middleware and modifying resolver depending on condition', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { replaceWithCondition(replace: true) }`);
        assert(result.data.replaceWithCondition === 'Hello from middleware');
      });

      it('resolves @Field decorated with @After Middleware and modifying resolver depending on condition', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { replaceWithCondition }`);
        assert(result.data.replaceWithCondition === 'Hello!');
      });

      it('resolves @Field decorated with @After Middleware and modifying resolver result', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { modifyResult }`);
        assert(result.data.modifyResult === 'Hello, after middleware!');
      });

      it('resolves @Field decorated with @After Middleware and returning from resolver', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { ignore }`);
        assert(result.data.ignore === 'Hello, world!');
      });

      it('resolves @Field decorated with @After Middleware and erroring', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { callError }`);

        assert(result.data.callError === null);
        assert(typeof (result.errors) !== 'undefined');
        assert(result.errors.length === 1);
        assert(result.errors[0].message === 'Error from middleware');
      });

      it('resolves @Field decorated with @After Middleware changing result type', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { changeReturnType { data } }`);
        assert(result.data.changeReturnType.data === 'Hello, world!');
      });

    });

    describe('Union', function () {

      abstract class BaseType {
        @D.Field()
        type: string;
      }

      @D.ObjectType()
      class QueryAType extends BaseType {
        @D.Field()
        queryA: string;
      }

      @D.ObjectType()
      class QueryBType extends BaseType {
        @D.Field()
        queryB: string;
      }

      type QueryUnionType = QueryAType | QueryBType;

      @D.UnionType<QueryUnionType>({
        types: [QueryAType, QueryBType],
        resolver: (obj: QueryUnionType): string | null => {
          if (obj.type === 'A') { return QueryAType.name; }
          return QueryBType.name;
        },
      })
      class UnionType { }

      @D.ObjectType()
      class QueryType {
        @D.Field({ type: UnionType, isList: true })
        value(): UnionType[] {
          return [
            {
              type: 'A',
              queryA: 'hello',
            },
            {
              type: 'B',
              queryB: 'world',
            },
          ];
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves @UnionType with abstact class', async function () {
        const schema = schemaFactory(SchemaType);

        const result = await graphql.graphql(schema, `
        query {
          value {
            ...on QueryAType {
              type
              queryA
            }
            ...on QueryBType {
              type
              queryB
            }
          }
        }
        `);
        assert(result.data.value.length === 2);
        assert(result.data.value[0].type === 'A');
        assert(result.data.value[0].queryA === 'hello');
        assert(result.data.value[1].type === 'B');
        assert(result.data.value[1].queryB === 'world');
      });

    });

    describe('Multiple Queries', function () {

      @D.ObjectType()
      class QueryAType {
        @D.Field()
        greetingA(): string { return `Hello, world`; }
      }

      @D.ObjectType()
      class QueryBType {
        @D.Field()
        greetingB(): string { return `Hello, world`; }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() queryA: QueryAType;
        @D.Query() queryB: QueryBType;
      }

      it('resolves multiple queries with @Schema and @Query', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { greetingA, greetingB } `);
        assert(result.data.greetingA === 'Hello, world');
        assert(result.data.greetingB === 'Hello, world');
      });

    });

    describe('Root', function () {

      @D.ObjectType()
      class ReturnType {
        @D.Field({ type: graphql.GraphQLString })
        valueFromProvidedRoot(
          @D.Root() root: { value: string },
        ): string {
          return root.value;
        }
      }

      @D.ObjectType()
      class QueryType {
        @D.Field({ type: ReturnType })
        field(): any {
          return {
            any: '',
            object: '',
            with: '',
            a: '',
            value: 'Hello, world!',
            key: '',
          };
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves value from provided root object', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { field { valueFromProvidedRoot } } `);
        assert(result.data.field.valueFromProvidedRoot === 'Hello, world!');
      });

    });

    describe('Interfaces', function () {

      @D.InterfaceType({
        resolver: (obj: any): string | null => {
          // tslint:disable:no-use-before-declare
          if (obj.objectField) { return MyObjectType.name; }
          if (obj.otherObjectField) { return MyOtherObjectType.name; }
          return null;
          // tslint:enable:no-use-before-declare
        },
      })
      class MyInterface {
        @D.Field()
        interfaceField: string;
      }

      @D.ObjectType({ interfaces: MyInterface })
      class MyObjectType {
        @D.Field()
        objectField: string;
      }

      @D.ObjectType({ interfaces: [MyInterface] })
      class MyOtherObjectType {
        @D.Field()
        otherObjectField: string;
      }

      @D.ObjectType()
      class QueryType {
        @D.Field({ type: MyInterface, isList: true })
        value(): any[] {
          return [
            {
              interfaceField: 'A',
              objectField: 'objectField',
            },
            {
              interfaceField: 'B',
              otherObjectField: 'otherObjectField',
            },
          ];
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
      }

      it('resolves interfaces', async function () {
        const schema = schemaFactory(SchemaType);

        const result = await graphql.graphql(schema, `
        query {
          value {
            interfaceField
            ...on MyObjectType {
              objectField
            }
            ...on MyOtherObjectType {
              otherObjectField
            }
          }
        }
        `);
        assert(result.data.value.length === 2);
        assert(result.data.value[0].interfaceField === 'A');
        assert(result.data.value[0].objectField === 'objectField');
        assert(result.data.value[1].interfaceField === 'B');
        assert(result.data.value[1].otherObjectField === 'otherObjectField');
      });
    });

  });

  describe('Mutation', function () {

    describe('InputObjectType', function () {

      @D.ObjectType()
      class QueryType {
        @D.Field()
        dummy(): string {
          return 'A schema always needs a query';
        }
      }

      @D.InputObjectType()
      class InputType {
        @D.Field()
        value: string;
      }

      @D.ObjectType()
      class MutationType {
        @D.Field()
        willItMutate(
          @D.Arg({ type: InputType, name: 'input' }) input: InputType,
        ): string {
          return `Hello, ${input.value}!`;
        }
      }

      @D.Schema()
      class SchemaType {
        @D.Query() query: QueryType;
        @D.Mutation() mutation: MutationType;
      }

      it('resolves @Mutation with @InputTypeObject', async function () {
        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `mutation { willItMutate(input: {value: "world"}) } `);
        assert(result.data.willItMutate === 'Hello, world!');
      });


    });

  });

  describe('useContainer', function () {

    afterEach(function () {
      delete IoCContainer.INSTANCE;
    });

    it('sets the DI container properly', function () {

      const container = {};
      useContainer(container);
      assert(IoCContainer.INSTANCE === container);
    });

  });
});
