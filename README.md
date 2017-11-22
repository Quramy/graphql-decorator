# Graphql-Schema-Decorator

[![Build Status](https://travis-ci.org/indigotech/graphql-schema-decorator.svg?branch=master)](https://travis-ci.org/indigotech/graphql-schema-decorator)
[![npm version](https://badge.fury.io/js/graphql-schema-decorator.svg)](https://badge.fury.io/js/graphql-schema-decorator)

## Differences from graphql-decorator

This package makes possible the use of decorators to define a GraphQL schema. Note that this package is a fork, we have added some new features to the original package.  
Apart from the decorators listed on the original documentation, we have added six new and changed the behavior for two others.

- @Ctx: Injects GraphQL context object into annotated method parameter.
- @Root: Injects GraphQL root object into annotated method parameter.
- @Pagination: Wraps the type into a pagination model (http://graphql.org/learn/pagination/). For clarification, see examples below.
- @OrderBy: It creates an `orderBy` input object to the related @Connection query. The available fields for ordering, comes the the type declared on the related @Field. Examples should make this clearer.
- @EnumType: It can be used just like @ObjectType in order to create `GraphQLEnumType` objects.
- @Value: Should be used on classes decorated with @EnumType. It creates values for enums. Accepts an object of type `any` as parameter. This paremeter will be the enum value. If none is passed, the enum value is the enum itself. See example below.
- @Query: It can be used multiple times on the same file. This way we make it possible to break queries into different folders.
- @Mutation: It can be used multiple times on the same file. This way we make it possible to break queries into different folders.
- @UseContainer: Sets the IoC container to be used in order to instantiate the decorated clas.
- @UnionType: It can be used to create `GraphQLUnionType` objects.
- @InterfaceType: It can be used to create `GraphQLInterfaceType` objects.

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
import { ObjectType, Ctx, Field, Root } from 'graphql-schema-decorator';
import { GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import * as AnswerTypes from 'graphql/answer/types/index';

@ObjectType({description: 'An user'})
export class UserType {

    @Field({type: GraphQLID, nonNull: true})
    id: number;
    
    @Field({type: GraphQLString, })
    name: string;
    
    @Field({type: GraphQLString, nonNull: true})
    avatarUrl: string;

    @Field({type: GraphQLString, nonNull: true})
    email: string;

    @Field({type: AnswerTypes.AnswerType, isList: true}) 
    answers(@Ctx() context: any, @Root() root: any) {
        // Get answers using ctx and root.
    }

}
```

Use of @Pagination with @OrderBy
```typescript
import { ObjectType, Arg, Ctx, List, Field } from 'graphql-schema-decorator';

@ObjectType({description: 'Get all users query.'})
export class UsersQuery {

  @Field({type: UserType, pagination: true}) 
  users(
    @Ctx() context: any, 
    @Arg({name: "offset"}) offset: number, 
    @Arg({name: "limit"}) limit: number, 
    @OrderBy() orderBy: orderByItem[]
  )  {
    // Get users
  }

@ObjectType({description: 'An user.'})
export class UserType {

    @Field({type: GraphQLID, description: 'User id', nonNull: true})
    id: number;
    
    @Field({type: GraphQLString, description: 'User name', nonNull: true})
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

`nodes`, `count` and `pageInfo` comes with the @Pagination decorator. @OrderBy accepts an array of `orderByItem`
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

Use of @EnumType and @Value
```typescript
import { EnumType, Description, Value } from 'graphql-schema-decorator';

@EnumType({description: 'An user role. Either ADMIN or DEFAULT'})
export class UserRoleType {

    @Value(0, {description: 'Admin role'})
    ADMIN: string;
    
    @Value('value', {description: 'Default role'})
    DEFAULT: string;

    @Value()
    GOD: string;

}
```
And you can use the just declared enum like this.
```typescript
import { ObjectType, Arg, Pagination, Field, Description } from 'graphql-schema-decorator';
import * as UserTypes from 'graphql-schema/user/type';

@ObjectType({description: 'Get all users query.'})
export class UsersQuery {
  
  @Field({type: UserTypes.UserType, pagination: true}) 
  users(@Arg({name: "role", type: UserTypes.UserRoleType }) role: any) {
    // The role value will either be 0, "value" or GOD.
    // Get users by role.
  }
}
```

Use of `UseContainer` along with `typedi` container. Note that `bannerRepository` will be injected through the constructor.

```typescript
import { ObjectType, Field, Description, List, UseContainer } from 'graphql-schema-decorator';
import { Container, Inject, Service } from 'typedi';
import * as BannerTypes from 'graphql-schema/banner/type/banner.type';
import { BannerRepository, BannerLocalDataSource } from 'data/source/banner';
import { ModuleRepository } from 'data/source/module';

@ObjectType({description: 'Get a list of banners.'})
@UseContainer(Container)
@Service()
export class BannersQuery {
	
	constructor(
		private readonly bannerRepository: BannerRepository
	) { }

	@Field({type: BannerTypes.BannerType, isList: true}) 
	banners()  {
		return this.bannerRepository.getBanners();
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
npm i graphql-schema-decorator typescript
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

import { Schema, Query, ObjectType, Field, schemaFactory } from "graphql-schema-decorator";
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
import { Schema, Query, Mutation } from "graphql-schema-decorator";

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
  @Field({type: graphql.GraphQLID, nonNull: true})
  id: string;
}

@ObjectType()
class Query {
  @Field({type: User, isList: true}) getAllUsers(): Promise<User[]> {
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
