## 0.8.0

### Feature

- Added `@UnionType` decorator to allow [GraphQL Union Types](http://graphql.org/learn/schema/#union-types) - #21

### Fixes

- Added missing `@Arg` `isList` option - #17 
- Fixing null returns for `@Pagination` - #19 

## 0.7.0

- Adding ability to ignore schema fields on @OrderBy - #11
- Fixed type duplication issue - #13
- Decorators are now less verbose - #12
- Added Subscriptions - #14 

## 0.6.0

- Adding `@Before` middleware for field schema function resolution #8
- Order by sort column is now non nullable - #9
- Adding ability to add custom sort params to @OrderBy params - #10

## 0.5.1

- Explicit type assertion - #6 
- Fixed return for Pagination info edge cases - #7 

## 0.5.0

- Based on https://github.com/indigotech/graphql-schema-decorator/pull/5

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
