# graphql-decorator [![Build Status](https://travis-ci.org/Quramy/graphql-decorator.svg?branch=master)](https://travis-ci.org/Quramy/graphql-decorator) [![npm version](https://badge.fury.io/js/graphql-decorator.svg)](https://badge.fury.io/js/graphql-decorator)

Library to help build [GraphQL](http://graphql.org/) schema with TypeScript.

It provide the following features:
 * Decorators(`@ObjectType`, `@Schema`, `@NonNull`, and more...) corresponding to [GraphQL type system](http://graphql.org/docs/api-reference-type-system/). 
 * A function to create GraphQL Schema from decorated TypeScript class.

## Getting started

This tool requires Node.js v4.4.0 or later.

```sh
npm i graphql-decorator typescript
```

This tool uses ES.next Decorators and Reflect, so create tsconfig.json :

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "noImplicitAny": false,
        "sourceMap": false,
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    },
    "exclude": [
        "node_modules"
    ]
}
```

And write .ts code such as:

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

Finally, execute the above schema:

```sh
tsc main.ts && node main.js
# -> Hello, world!
```

## API Usage
*T.B.D.*

## Examples
*T.B.D.*

## License
This software is released under the MIT License, see LICENSE.txt.
