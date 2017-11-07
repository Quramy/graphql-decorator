## master

- Added functional tests (to make sure resolvers are working properly) - #34 - @felipesabino
- Review JSDoc for each decorator and its option argument - #34 - @felipesabino
- Updated examples - #34 - @felipesabino
- Added CHANGELOG.md - #38 - @fvasc
- Added CI and npm badges to README - #27 - @askmon
- Added contributing guidelines - #30 - @askmon

### Breaking changes

- `useContainer` is now a function instead of a decorator - #40 - @felipesabino
- Refactored `@Field` decorator and nested dependent decorators (`@Arg`, `@OrderBy`, `@Root`, `@Before` and `@Ctx`) - #34 - @felipesabino
- Refactored `@Query`, `@Mutation`, `@Subscription` and `@Schema` - #32 - @felipesabino
- Refactored `@ObjectType` and `@InputObjectType` - #31 - @felipesabino
- Refactored `@EnumType`, `@Value` and `@UnionType` - #29 - @felipesabino
- Deprecated all usages of the decorators bellow - #34 - @felipesabino
  - `@Pagination`
  - `@Description`
  - `@List`
  - `@NonNull`

## 0.8.0

### Feature

- Added `@UnionType` decorator to allow [GraphQL Union Types](http://graphql.org/learn/schema/#union-types) - #21 - @felipesabino

### Fixes

- Added missing `@Arg` `isList` option - #17 - @felipesabino
- Fixing null returns for `@Pagination` - #19 - @felipesabino

## 0.7.0

- Adding ability to ignore schema fields on @OrderBy - #11 - @felipesabino
- Fixed type duplication issue - #13 - @felipesabino
- Decorators are now less verbose - #12 - @playerx
- Added Subscriptions - #14 - @playerx 

## 0.6.0

- Adding `@Before` middleware for field schema function resolution - #8 - @felipesabino
- Order by sort column is now non nullable - #9 - @felipesabino
- Adding ability to add custom sort params to @OrderBy params - #10 - @felipesabino

## 0.5.1

- Explicit type assertion - #6 - @felipesabino
- Fixed return for Pagination info edge cases - #7 - @felipesabino

## 0.5.0

- Based on https://github.com/indigotech/graphql-schema-decorator/pull/5 - @felipesabino

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

Added new docorators bellow - @thiago-soliveira
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
