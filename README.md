# graphql-decorator [![Build Status](https://travis-ci.org/Quramy/graphql-decorator.svg?branch=master)](https://travis-ci.org/Quramy/graphql-decorator)

Library to help build GraphQL schema with TypeScript.


## Getting started

```sh
npm i Quramy/graphql-decorator
```

Write code such as:

```ts
/* main.ts */

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
```

```
tsc main.ts && node main.js
```


## API Usage
*T.B.D.*

## Examples
*T.B.D.*

## License
This software is released under the MIT License, see LICENSE.txt.
