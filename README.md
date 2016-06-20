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

## Guide

### Schema

You can declare a GraphQL schema class with `@Schema`, `@Query` and `@Mutation` decorators.

For example:

```ts
import { Schema, Query, Mutation } from "graphql-decorator";

@Schema()
class MySchema {
  @Query() query: RootQuery;
  @Mutation() mutation: Mutations;
}
```

A schema class should a field annotated by `@Query`, which represents that the type of this filed will be a root query of GraphQL. And the type of this field should be annotated by `@ObjectType`.

The field annotated by `@Mutation` also represents mutation of your GraphQL schema.

### Object Type
You can annotate your class with `@ObjectType()`

For example:

```ts
@ObjectType()
class SomeObject {
  @Field() title: string;

  @Field() greeting(): string {
    return "Hello";
  }
}
```

The above example has 2 fields, the one is `title` and the another is `greeting`.

You can set the `@Field` decorator to your class's properties and methods. The fields annotated by `@Field` will be exposed as fields of this object in GraphQL schema. And when you set `@Field` to methods, the methods will work as the resolver function in schema.

#### Type of field

By the default, `@Field` detects GraphQLScalarType corresponding to the field type.

You can explicitly configure the type of the fields using `type` option.

```ts
@ObjectType() class User {
  @Field() name: string;
}

@ObjectType() class SomeObject {
  @Field({type: User}) user: User;
}
```

#### NonNull, List

You can use `@NonNull` and `@List` decorator. For example:

```ts
@ObjectType()
class User {
  @NonNull() @Field({type: graphql.GraphQLID})
  id: string;
}

@ObjectType()
class Query {
  @List() @Field({type: User}) getAllUsers(): Promise<User[]> {
    /* implementation for fetch all users */
  }
}
```

#### Resolver's arguments

You can use `@Arg` for declare arguments of resolver function. For example:

```ts
@ObjectType()
class MutationType {
  @Field({type: User}) deleteUser(
    @Arg({name: "id"}) id: string
  ) {
    /* implementation for delete user */
  }
}
```

And you can declare GraphQL InputObjectType with `@InputObjectType` decorator.

```ts
@InputObjectType()
class UserForUpdate {
  @Field() name: string;
  @Field() emal: string;
}

@ObjectType()
class MutationType {
  @Field({type: User}) updateUser(
    @Arg({name: "id"}) id: string,
    @Arg({name: "input"}) input: UserForUpdate
  ) {
    /* implementation for delete user */
  }
}
```

## API Usage
*T.B.D.*

## Examples
Please checkout [exmaples](https://github.com/Quramy/graphql-decorator/tree/master/examples) folder in this repository.

## License
This software is released under the MIT License, see LICENSE.txt.
