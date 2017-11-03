import 'reflect-metadata';

import * as D from '../decorator';
import * as graphql from 'graphql';

import { schemaFactory } from '../type-factory';

const assert = require('assert');

describe('Functional', function () {
    describe('Schema', function () {

      it('resolves @D.Field', async function() {

        @D.ObjectType()
        class QueryType {
            @D.Field() greeting(): string {
                return 'Hello, world!';
            }
        }

        @D.Schema()
        class SchemaType {
            @D.Query() query: QueryType;
        }

        const schema = schemaFactory(SchemaType);
        const result = await graphql.graphql(schema, `query { greeting } `);
        assert(result.data.greeting === 'Hello, world!');
      });

    });
});
