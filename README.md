
## Differences from graphql-decorator

This package makes possible the use of decorators to define a GraphQL schema. Note that this package is a fork, we have added some new features to the original package.  
Apart from the decorators listed on the original documentation, we have added three new and changed the behavior for two others.

- @Ctx: Injects GraphQL context object into annotated method parameter.
- @Root: Injects GraphQL root object into annotated method parameter.
- @Pagination: Wraps the type into a pagination model (http://graphql.org/learn/pagination/). For clarification, see examples below.
- @OrderBy: It creates an `orderBy` input object to the related @Connection query. The available fields for ordering, comes the the type declared on the related @Field. Examples should make this clearer.
- @Query: It can be used multiple times on the same file. This way we make it possible to break queries into different folders.
- @Mutation: It can be used multiple times on the same file. This way we make it possible to break queries into different folders.

#### GraphQL Decorator Examples

Use of modified @Query and @Mutation. @Schema stayed the same as on the original repo.
```typescript
import { Schema, Query, Mutation } from "graphql-schema-decorator";
import * as AnswerMutations from 'graphql/answer/mutations/index';
import * as AnswerQueries from 'graphql/answer/queries/index';
import * as UserQueries from 'graphql/user/queries/index';
import * as UserMutations from 'graphql/user/mutations/index';

@Schema()
export class RootSchema {

  @Query() 
  answerQuery: AnswerQueries.AnswerQuery;

  @Query() 
  answersQuery: AnswerQueries.AnswersQuery;

  @Mutation()
  answerCreateMutation: AnswerMutations.AnswerCreateMutation;

  @Mutation()
  answerUpvoteMutation: AnswerMutations.AnswerUpvoteMutation;
}
```


Example usage of @Ctx and @Root.
```typescript
import { NonNull, ObjectType, Ctx, List, Field, Description, Root } from 'graphql-decorator';
import { GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import * as AnswerTypes from 'graphql/answer/types/index';

@ObjectType()
@Description('An user')
export class UserType {

    @NonNull()
    @Field({type: GraphQLID})
    id: number;
    
    @NonNull()
    @Field({type: GraphQLString})
    name: string;
    
    @NonNull()
    @Field({type: GraphQLString})
    avatarUrl: string;

    @NonNull()
    @Field({type: GraphQLString})
    email: string;

    @List() 
    @Field({type: AnswerTypes.AnswerType}) 
    answers(@Ctx() context: any, @Root() root: any) {
        // Get answers using ctx and root.
    }

}
```

Use of @Pagination with @OrderBy
```typescript
import { ObjectType, Arg, Pagination, Ctx, List, Field, Description } from 'graphql-decorator';

@ObjectType()
@Description("Get all users query.")
export class UsersQuery {

  @Pagination()
  @Field({type: UserType}) 
  users(@Ctx() context: any, @Arg({name: "offset"}) offset: number, @Arg({name: "limit"}) limit: number, @OrderBy() orderBy: orderByItem[])  {
    // Get users
  }

@ObjectType()
@Description("An user.")
export class UserType {

    @NonNull()
    @Description("User id")
    @Field({type: GraphQLID})
    id: number;
    
    @NonNull()
    @Description("User name")
    @Field({type: GraphQLString})
    name: string;
}

}
```

The `orderByType` interface
```typescript
export interface orderByItem {

  sort: string;
  direction: string;

}
```

`nodes`, `count` and `pageInfo` comes with the @Connection decorator. @OrderBy accepts an array of `orderByItem`
```
{
  users(orderBy: [{sort: id, direction: DESC}, {sort: title, direction: ASC}]) {
    nodes {
      id,
      name
    },
    count,
    pageInfo {
      hasNextPage
    }
  }
}
```

Helps to build [GraphQL](http://graphql.org/) schema with TypeScript.

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
