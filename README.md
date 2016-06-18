# graphql-decorator [![Build Status](https://travis-ci.org/Quramy/graphql-decorator.svg?branch=master)](https://travis-ci.org/Quramy/graphql-decorator)

Library to help build [GraphQL](http://graphql.org/) schema with TypeScript.


## Getting started

This tool requires Node.js v4.4.0 or later.

```sh
npm i Quramy/graphql-decorator
```

Write code such as:

```ts
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
```

```sh
tsc main.ts && node main.js
```


## API Usage
*T.B.D.*

## Examples
*T.B.D.*

## License
This software is released under the MIT License, see LICENSE.txt.
