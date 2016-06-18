/* main.ts */

import { Schema, Query, ObjectType, Field, schemaFactory } from "graphql-decorator";
const graphql = require("graphql").graphql;

// @ObjectType creates GraphQLObjectType from a class
@ObjectType()
class QueryType {
    @Field() greeting(): string {
        return "Hello, world!";
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
    console.log(result.data.greeting);
}

main();
