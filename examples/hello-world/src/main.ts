import { Schema, Query, ObjectType, Field, schemaFactory } from "graphql-decorator";
const parse = require("graphql/language").parse;
const execute = require("graphql/execution").execute;

@ObjectType()
class QueryType {
    @Field() greeting(): string {
        return "Hello, world!";
    }
}

@Schema()
class SchemaType {
    @Query() query: QueryType;
}

async function main() {
    const schema = schemaFactory(SchemaType);
    const ast = parse(`query { greeting }`);
    const result = await execute(schema, ast);
    console.log(result.data.greeting);
}

main();
