## master

- Added functional tests (to make sure resolvers are working properly) - #34 - [@felipesabino](https://github.com/felipesabino)
- Review JSDoc for each decorator and its option argument - #34 - [@felipesabino](https://github.com/felipesabino)
- Updated examples - #34 - [@felipesabino](https://github.com/felipesabino)
- Added CHANGELOG.md - #38 - [@fvasc](https://github.com/fvasc)
- Added CI and npm badges to README - #27 - [@askmon](https://github.com/askmon)
- Added contributing guidelines - #30 - [@askmon](https://github.com/askmon)
- Fixed @Field arguments handling - #42 - [@felipesabino](https://github.com/felipesabino)
- Fixed @UnionType usage with abstract classes - #43 - [@felipesabino](https://github.com/felipesabino)
- Fixed error that just one @Query was added to resulting schema - #44 - [@felipesabino](https://github.com/felipesabino)
- Fixed `.npmignore` and `.gitignore` - #48 - [@marcelorisse](https://github.com/marcelorisse)
- Removed duplicated CHANGELOG file - #48 - [@marcelorisse](https://github.com/marcelorisse)
- Fixed `@Root` decorator now being correctly exported - #51 - [@babbarankit](https://github.com/babbarankit)
- Fixed README examples - #51 - [@babbarankit](https://github.com/babbarankit)

### Breaking changes

- `useContainer` is now a function instead of a decorator - #40 - [@felipesabino](https://github.com/felipesabino)
- Refactored `@Field` decorator and nested dependent decorators (`@Arg`, `@OrderBy`, `@Root`, `@Before` and `@Ctx`) - #34 - [@felipesabino](https://github.com/felipesabino)
- Refactored `@Query`, `@Mutation`, `@Subscription` and `@Schema` - #32 - [@felipesabino](https://github.com/felipesabino)
- Refactored `@ObjectType` and `@InputObjectType` - #31 - [@felipesabino](https://github.com/felipesabino)
- Refactored `@EnumType`, `@Value` and `@UnionType` - #29 - [@felipesabino](https://github.com/felipesabino)
- Deprecated all usages of the decorators below - #34 - [@felipesabino](https://github.com/felipesabino)
  - `@Pagination`
  - `@Description`
  - `@List`
  - `@NonNull`

## 0.8.0

### Feature

- Added `@UnionType` decorator to allow [GraphQL Union Types](http://graphql.org/learn/schema/#union-types) - #21 - [@felipesabino](https://github.com/felipesabino)

### Fixes

- Added missing `@Arg` `isList` option - #17 - [@felipesabino](https://github.com/felipesabino)
- Fixing null returns for `@Pagination` - #19 - [@felipesabino](https://github.com/felipesabino)

## 0.7.0

- Adding ability to ignore schema fields on @OrderBy - #11 - [@felipesabino](https://github.com/felipesabino)
- Fixed type duplication issue - #13 - [@felipesabino](https://github.com/felipesabino)
- Decorators are now less verbose - #12 - [@playerx](https://github.com/playerx)
- Added Subscriptions - #14 - [@playerx ](https://github.com/playerx )

## 0.6.0

- Adding `@Before` middleware for field schema function resolution - #8 - [@felipesabino](https://github.com/felipesabino)
- Order by sort column is now non nullable - #9 - [@felipesabino](https://github.com/felipesabino)
- Adding ability to add custom sort params to @OrderBy params - #10 - [@felipesabino](https://github.com/felipesabino)

## 0.5.1

- Explicit type assertion - #6 - [@felipesabino](https://github.com/felipesabino)
- Fixed return for Pagination info edge cases - #7 - [@felipesabino](https://github.com/felipesabino)

## 0.5.0

- Based on https://github.com/indigotech/graphql-schema-decorator/pull/5 - [@felipesabino](https://github.com/felipesabino)

# ⚠️  BREAKING CHANGES ⚠️ 

- Now it supports only node `^6.10`

## Other Changes

- Updated typescript version to `2.3.4`
- Fixed an issue when using nested input type objects 
- Added tests for nested input changes
- Removed typings and everything related
- Configured travis to run properly
- Fixed old broken tests (probably happened due to lack of CI for early releases/changes)
- Fixed lint issues

## Fork changes

Added new docorators below - [@thiago-soliveira](https://github.com/thiago-soliveira)
- `@Ctx`
- `@Root`
- `@Pagination`
- `@OrderBy`
- `@EnumType`
- `@Value`
- `@Query`
- `@Mutation`
- `@UseContainer`
- `@UnionType` 
