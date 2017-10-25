import 'reflect-metadata';
import * as D from './decorator';
import * as graphql from 'graphql';
import { FieldTypeMetadata, GQ_FIELDS_KEY, getFieldMetadata, GQ_OBJECT_METADATA_KEY, ObjectTypeMetadata } from './decorator';
const assert = require('assert');

describe('Decorators', function () {
    describe('@ObjectType', function () {
        it('creates a ObjectTypeMetadata which isInput is false', function () {
            @D.ObjectType() class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === false);
            assert(actual.name === 'Obj');
        });

        it('sets description to ObjectTypeMetadata with @Description', function () {
            @D.Description('this is a object type') @D.ObjectType()
            class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === false);
            assert(actual.name === 'Obj');
            assert(actual.description === 'this is a object type');
        });
    });

    describe('@InputObjectType', function () {
        it('creates a ObjectTypeMetadata which isInput is true', function () {
            @D.InputObjectType() class Obj { @D.Field() someField: any; }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === true);
            assert(actual.name === 'Obj');
        });

        it('sets description to ObjectTypeMetadata which isInput is true with description option', function () {
            @D.InputObjectType({ description: 'some input' }) class Obj { }
            const actual = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, Obj.prototype) as ObjectTypeMetadata;
            assert(actual.isInput === true);
            assert(actual.description === 'some input');
        });
    });

    describe('@Field', function () {
        it('creates empty FieldTypeMetadata', function () {
            class Obj { @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
        });

        it('sets explicitType to FieldTypeMetadata with type option', function () {
            class Obj { @D.Field({ type: graphql.GraphQLID }) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.explicitType === graphql.GraphQLID);
        });

        it('sets description to FieldTypeMetadata with @Description', function () {
            class Obj { @D.Description('some field') @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.description === 'some field');
        });

        it('sets description to FieldTypeMetadata with description option', function () {
            class Obj { @D.Field({ description: 'some field' }) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.description === 'some field');
        });

        it('sets isNonull to FieldTypeMetadata with @NonNull', function () {
            class Obj { @D.NonNull() @D.Field() someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.isNonNull === true);
        });

        it('sets isNonull to FieldTypeMetadata with nonNull option', function () {
            class Obj { @D.Field({ nonNull: true }) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.isNonNull === true);
        });

        it('sets isList to FieldTypeMetadata with isList option', function () {
            class Obj { @D.Field({ nonNull: true, isList: true }) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.isList === true);
        });

        it('sets pagination to FieldTypeMetadata with pagination option', function () {
            class Obj { @D.Field({ nonNull: true, pagination: true }) someField() { } }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.isPagination === true);
        });

        it('sets isList to FieldTypeMetadata with @List', function () {
            class Obj { @D.List() @D.Field() someField: Array<any>; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.isList === true);
        });

        it('sets complex FieldTypeMetadata', function () {
            class Obj { @D.NonNull() @D.Field({ type: graphql.GraphQLID }) someField: any; }
            const actual = getFieldMetadata(Obj.prototype, 'someField');
            assert(actual.name === 'someField');
            assert(actual.explicitType === graphql.GraphQLID);
            assert(actual.isNonNull === true);
        });
    });

    describe('@Arg', function () {
        it('creates FieldTypeMetadata whose has args', function () {
            class Obj { @D.Field() someFunction( @D.Arg({ name: 'input' }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(typeof actual.isNonNull === 'undefined');
            assert(typeof actual.isList === 'undefined');
        });

        it('sets description to ArgumentMetadata with @Description', function () {
            class Obj { @D.Field() someFunction( @D.Description('some input') @D.Arg({ name: 'input' }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(actual.description === 'some input');
            assert(typeof actual.isNonNull === 'undefined');
            assert(typeof actual.isList === 'undefined');
        });

        it('sets description to ArgumentMetadata with description option', function () {
            class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', description: 'some input' }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(actual.description === 'some input');
            assert(typeof actual.isNonNull === 'undefined');
            assert(typeof actual.isList === 'undefined');
        });

        it('sets isNonNull to ArgumentMetadata with @NonNull', function () {
            class Obj { @D.Field() someFunction( @D.NonNull() @D.Arg({ name: 'input' }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(actual.isNonNull === true);
            assert(typeof actual.isList === 'undefined');
        });

        it('sets isNonNull to ArgumentMetadata with nonNull option', function () {
            class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', nonNull: true }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(actual.isNonNull === true);
            assert(typeof actual.isList === 'undefined');
        });

        it('sets isNonNull to ArgumentMetadata with @List', function () {
            class Obj { @D.Field() someFunction( @D.List() @D.Arg({ name: 'input' }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(typeof actual.isNonNull === 'undefined');
            assert(actual.isList === true);
        });

        it('sets isNonNull to ArgumentMetadata with isList', function () {
            class Obj { @D.Field() someFunction( @D.Arg({ name: 'input', isList: true }) input: any) { } }
            const actual = getFieldMetadata(Obj.prototype, 'someFunction').args[0];
            assert(actual.name === 'input');
            assert(typeof actual.isNonNull === 'undefined');
            assert(actual.isList === true);
      });
    });
});
