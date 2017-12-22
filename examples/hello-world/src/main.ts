/* main.ts */

import { Field, ObjectType, Query, Schema, schemaFactory } from 'graphql-schema-decorator';
declare var process;

process.on('unhandledRejection', up => { throw up; });

const graphql = require('graphql').graphql;
const printSchema = require('graphql').printSchema;

// @ObjectType creates GraphQLObjectType from a class
@ObjectType()
class QueryType {
    @Field() greeting(): string {
        return 'Hello, world!';
    }
}

// @Schema creates GraphQLSchema from a class.
// The class should have a field annotated by @Query decorator.
@Schema()
class SchemaType {
    @Query() query: QueryType;
}

async function main() {

    // create schema from annotated class
    const schema = schemaFactory(SchemaType);

    const result = await graphql(schema, `query { greeting } `);
    console.log(result.data);
}

main();
