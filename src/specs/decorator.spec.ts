import 'reflect-metadata';

import * as D from '../decorator';
import * as graphql from 'graphql';

import { ObjectTypeMetadata } from '../metadata/types';
import { getMetadataBuilder } from '../metadata-builder';

const assert = require('assert');

describe('Decorators', function () {
  describe('@ObjectType', function () {
    it('creates a ObjectTypeMetadata which isInput is false', function () {
      @D.ObjectType() class Obj { @D.Field() someField: any; }
      const actual = getMetadataBuilder().buildObjectTypeMetadata(Obj)[0];
      assert(actual.isInput === false);
      assert(actual.name === 'Obj');
    });

  });

  describe('@InputObjectType', function () {
    it('creates a ObjectTypeMetadata which isInput is true', function () {
      @D.InputObjectType() class Obj { @D.Field() someField: any; }
      const actual = getMetadataBuilder().buildObjectTypeMetadata(Obj)[0];
      assert(actual.isInput === true);
      assert(actual.name === 'Obj');
    });

    it('sets description to ObjectTypeMetadata which isInput is true with description option', function () {
      @D.InputObjectType({ description: 'some input' }) class Obj { }
      const actual = getMetadataBuilder().buildObjectTypeMetadata(Obj)[0];
      assert(actual.isInput === true);
      assert(actual.description === 'some input');
    });
  });

  describe('@Field', function () {
    it('creates empty FieldTypeMetadata', function () {
      class Obj { @D.Field() someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
    });

    it('sets explicitType to FieldTypeMetadata with type option', function () {
      class Obj { @D.Field({ type: graphql.GraphQLID }) someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.type === graphql.GraphQLID);
    });

    it('sets description to FieldTypeMetadata with description option', function () {
      class Obj { @D.Field({ description: 'some field' }) someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.description === 'some field');
    });

    it('sets isNonull to FieldTypeMetadata with nonNull option', function () {
      class Obj { @D.Field({ nonNull: true }) someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.isNonNull === true);
    });

    it('sets isList to FieldTypeMetadata with isList option', function () {
      class Obj { @D.Field({ nonNull: true, isList: true }) someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.isList === true);
    });

    it('sets pagination to FieldTypeMetadata with pagination option', function () {
      class Obj { @D.Field({ nonNull: true, pagination: true }) someField() { } }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.isPagination === true);
    });

    it('sets complex FieldTypeMetadata', function () {
      class Obj { @D.Field({ type: graphql.GraphQLID, nonNull: true }) someField: any; }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someField');
      assert(actual.name === 'someField');
      assert(actual.type === graphql.GraphQLID);
      assert(actual.isNonNull === true);
    });

    it('pagination can only be added to functions', function () {
      try {
        class Obj { @D.Field({ type: graphql.GraphQLID, pagination: true }) someField: any; }
      } catch (e) {
        assert(e !== null);
        return;
      }

      assert(false);

    });
  });

  describe('@Arg', function () {
    it('creates FieldTypeMetadata whose has args', function () {
      class Obj { @D.Field() someFunction( @D.Arg({ name: 'input' }) input: any) { } }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someFunction').arguments[0];
      assert(actual.name === 'input');
      assert(actual.isNonNull === false);
      assert(actual.isList === false);
    });

    it('sets description to ArgumentMetadata with description option', function () {
      class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', description: 'some input' }) input: any) { } }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someFunction').arguments[0];
      assert(actual.name === 'input');
      assert(actual.description === 'some input');
      assert(actual.isNonNull === false);
      assert(actual.isList === false);
    });

    it('sets isNonNull to ArgumentMetadata with nonNull option', function () {
      class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', nonNull: true }) input: any) { } }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someFunction').arguments[0];
      assert(actual.name === 'input');
      assert(actual.isNonNull === true);
      assert(actual.isList === false);
    });

    it('sets isNonNull to ArgumentMetadata with isList', function () {
      class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', isList: true }) input: any) { } }
      const actual = getMetadataBuilder().buildFieldMetadata(Obj.prototype).find(value => value.name === 'someFunction').arguments[0];
      assert(actual.name === 'input');
      assert(actual.isNonNull === false);
      assert(actual.isList === true);
    });
  });
});
