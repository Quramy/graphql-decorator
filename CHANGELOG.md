## master

- Added functional tests (to make sure resolvers are working properly) - [#34](https://github.com/indigotech/graphql-schema-decorator/pull/34) - [@felipesabino](https://github.com/felipesabino)
- Review JSDoc for each decorator and its option argument - [#34](https://github.com/indigotech/graphql-schema-decorator/pull/34) - [@felipesabino](https://github.com/felipesabino)
- Updated examples - [#34](https://github.com/indigotech/graphql-schema-decorator/pull/34) - [@felipesabino](https://github.com/felipesabino)
- Added CHANGELOG.md - [#38](https://github.com/indigotech/graphql-schema-decorator/pull/38) - [@fvasc](https://github.com/fvasc)
- Added CI and npm badges to README - [#27](https://github.com/indigotech/graphql-schema-decorator/pull/27) - [@askmon](https://github.com/askmon)
- Added contributing guidelines - [#30](https://github.com/indigotech/graphql-schema-decorator/pull/30) - [@askmon](https://github.com/askmon)
- Fixed @Field arguments handling - [#42](https://github.com/indigotech/graphql-schema-decorator/pull/42) - [@felipesabino](https://github.com/felipesabino)
- Fixed @UnionType usage with abstract classes - [#43](https://github.com/indigotech/graphql-schema-decorator/pull/43) - [@felipesabino](https://github.com/felipesabino)
- Fixed error that just one @Query was added to resulting schema - [#44](https://github.com/indigotech/graphql-schema-decorator/pull/44) - [@felipesabino](https://github.com/felipesabino)
- Fixed `.npmignore` and `.gitignore` - [#48](https://github.com/indigotech/graphql-schema-decorator/pull/48) - [@marcelorisse](https://github.com/marcelorisse)
- Removed duplicated CHANGELOG file - [#48](https://github.com/indigotech/graphql-schema-decorator/pull/48) - [@marcelorisse](https://github.com/marcelorisse)
- Fixed `@Root` decorator now being correctly exported - [#51](https://github.com/indigotech/graphql-schema-decorator/pull/51) - [@babbarankit](https://github.com/babbarankit)
- Fixed README examples - [#51](https://github.com/indigotech/graphql-schema-decorator/pull/51) - [@babbarankit](https://github.com/babbarankit)
- Improved tests by adding @Root ones - [#52](https://github.com/indigotech/graphql-schema-decorator/pull/52) - [@babbarankit](https://github.com/babbarankit)
- Added @InterfaceType decorator - [#46](https://github.com/indigotech/graphql-schema-decorator/pull/46) - [@felipesabino](https://github.com/felipesabino)
- Added @After middleware decorator - [#56](https://github.com/indigotech/graphql-schema-decorator/pull/56) - [@marcelorisse](https://github.com/marcelorisse)
- Bugfix - @After middleware changing return type - [#58](https://github.com/indigotech/graphql-schema-decorator/pull/58) - [@felipesabino](https://github.com/felipesabino)

### Breaking changes

- `useContainer` is now a function instead of a decorator - [#40](https://github.com/indigotech/graphql-schema-decorator/pull/40) - [@felipesabino](https://github.com/felipesabino)
- Refactored `@Field` decorator and nested dependent decorators (`@Arg`, `@OrderBy`, `@Root`, `@Before` and `@Ctx`) - [#34](https://github.com/indigotech/graphql-schema-decorator/pull/34) - [@felipesabino](https://github.com/felipesabino)
- Refactored `@Query`, `@Mutation`, `@Subscription` and `@Schema` - [#32](https://github.com/indigotech/graphql-schema-decorator/pull/32) - [@felipesabino](https://github.com/felipesabino)
- Refactored `@ObjectType` and `@InputObjectType` - [#31](https://github.com/indigotech/graphql-schema-decorator/pull/31) - [@felipesabino](https://github.com/felipesabino)
- Refactored `@EnumType`, `@Value` and `@UnionType` - [#29](https://github.com/indigotech/graphql-schema-decorator/pull/29) - [@felipesabino](https://github.com/felipesabino)
- Deprecated all usages of the decorators below - [#34](https://github.com/indigotech/graphql-schema-decorator/pull/34) - [@felipesabino](https://github.com/felipesabino)
  - `@Pagination`
  - `@Description`
  - `@List`
  - `@NonNull`

## 0.8.0

### Feature

- Added `@UnionType` decorator to allow [GraphQL Union Types](http://graphql.org/learn/schema/#union-types) - [#21](https://github.com/indigotech/graphql-schema-decorator/pull/21) - [@felipesabino](https://github.com/felipesabino)

### Fixes

- Added missing `@Arg` `isList` option - [#17](https://github.com/indigotech/graphql-schema-decorator/pull/17) - [@felipesabino](https://github.com/felipesabino)
- Fixing null returns for `@Pagination` - [#19](https://github.com/indigotech/graphql-schema-decorator/pull/19) - [@felipesabino](https://github.com/felipesabino)

## 0.7.0

- Adding ability to ignore schema fields on @OrderBy - [#11](https://github.com/indigotech/graphql-schema-decorator/pull/11) - [@felipesabino](https://github.com/felipesabino)
- Fixed type duplication issue - [#13](https://github.com/indigotech/graphql-schema-decorator/pull/13) - [@felipesabino](https://github.com/felipesabino)
- Decorators are now less verbose - [#12](https://github.com/indigotech/graphql-schema-decorator/pull/12) - [@playerx](https://github.com/playerx)
- Added Subscriptions - [#14](https://github.com/indigotech/graphql-schema-decorator/pull/14) - [@playerx ](https://github.com/playerx )

## 0.6.0

- Adding `@Before` middleware for field schema function resolution - [#8](https://github.com/indigotech/graphql-schema-decorator/pull/8) - [@felipesabino](https://github.com/felipesabino)
- Order by sort column is now non nullable - [#9](https://github.com/indigotech/graphql-schema-decorator/pull/9) - [@felipesabino](https://github.com/felipesabino)
- Adding ability to add custom sort params to @OrderBy params - [#10](https://github.com/indigotech/graphql-schema-decorator/pull/10) - [@felipesabino](https://github.com/felipesabino)

## 0.5.1

- Explicit type assertion - [#6](https://github.com/indigotech/graphql-schema-decorator/pull/6) - [@felipesabino](https://github.com/felipesabino)
- Fixed return for Pagination info edge cases - [#7](https://github.com/indigotech/graphql-schema-decorator/pull/7) - [@felipesabino](https://github.com/felipesabino)

## 0.5.0

- Based on [#5](https://github.com/indigotech/graphql-schema-decorator/pull/5) - [@felipesabino](https://github.com/felipesabino)

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
