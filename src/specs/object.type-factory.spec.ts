import 'reflect-metadata';
import { } from '../schema_factory';

import * as D from '../decorator';
import * as graphql from 'graphql';

import {
  SchemaFactoryError,
  SchemaFactoryErrorType,
  clearObjectTypeRepository,
  objectTypeFactory,
} from '../type-factory';

import { execute } from 'graphql/execution';
import { parse } from 'graphql/language';

const assert = require('assert');

describe('objectTypeFactory', function () {
  beforeEach(function () {
    clearObjectTypeRepository();
  });
  it('throws an error with class which has no @Field field', function () {
    @D.ObjectType()
    class Obj { }
    try {
      objectTypeFactory(Obj);
      assert.fail();
    } catch (e) {
      const err = e as SchemaFactoryError;
      assert(err.type === SchemaFactoryErrorType.NO_FIELD);
    }
  });

  it('returns GraphQLObjectType with a Class which has string field', function () {
    @D.ObjectType()
    class Obj { @D.Field() title: string; }
    const GQLType: any = objectTypeFactory(Obj);
    assert(GQLType._typeConfig.name === 'Obj');
    assert(GQLType._typeConfig.fields.title.type instanceof graphql.GraphQLScalarType);
  });

  it('returns GraphQLInputObjectType with a class annotated by @InputObjectType', function () {
    @D.InputObjectType()
    class Obj { @D.Field() title: string; }
    const GQLType: any = objectTypeFactory(Obj, true);
    assert(GQLType._typeConfig.name === 'Obj');
  });

  it('returns GraphQLInputObjectType with a class annotated by nested @InputObjectType objects', function () {
    @D.InputObjectType()
    class Nested { @D.Field() title: string; }

    @D.InputObjectType()
    class Obj { @D.Field() title: string; @D.Field({ type: Nested }) nested: Nested; }
    const GQLType: any = objectTypeFactory(Obj, true);
    assert(GQLType._typeConfig.name === 'Obj');
  });

  it('raises exception if nested @InputObjectType is undefined', function () {
    // this can be caused when order of `import` is messed up and/or nested type can not be infered
    @D.InputObjectType()
    class Obj { @D.Field() title: string; @D.Field({ type: undefined }) nested: {}; }
    try {
      const GQLType: any = objectTypeFactory(Obj, true);
      assert.fail();
    } catch (e) {
      const err = e as SchemaFactoryError;
      assert(err.type === SchemaFactoryErrorType.NO_FIELD);
    }
  });
});
