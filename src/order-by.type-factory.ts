import { FieldTypeMetadata, GQ_FIELDS_KEY } from './decorator';
import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { SchemaFactoryError, SchemaFactoryErrorType } from './type-factory';

export class OrderByTypeFactory {

  private static orderByFieldEnumFactory(name: string, values: {[name: string]: any; }[]): GraphQLEnumType {
    let valuesDict: {[name: string]: any; } = {};
    values.forEach((value: any) => {
      valuesDict[value.name] = {
        description: value.description && value.description,
      };
    });
    return new GraphQLEnumType({
      name: name + 'OrderByFieldEnum',
      description: 'List of available ordering fields.',
      values: valuesDict,
    });
  }

  private static orderByInputObjectFactory(name: string, orderBySortEnumObject: GraphQLEnumType,
    orderByDirectionEnumObject: GraphQLEnumType): GraphQLInputObjectType {
    return new GraphQLInputObjectType({
      name: name + 'OrderingInputObjectType',
      description: 'Ordering object',
      fields: {
          sort: { type: new GraphQLNonNull(orderBySortEnumObject) },
          direction: { type: orderByDirectionEnumObject },
      },
    });
  }

  private static orderByDirectionEnumFactory(name: string): GraphQLEnumType {
    return new GraphQLEnumType({
      name: name + 'OrderByDirectionEnum',
      description: 'List of available ordering directions.',
      values: {
        ASC: {
          description: 'Ascendent direction',
        },
        DESC: {
          description: 'Descendant direction',
        },
      },
    });
  }

  static orderByFactory(metadata: FieldTypeMetadata, args: {[name: string]: any; }): {[name: string]: any; } {
    let orderByFieldArray: Array<{[name: string]: any; }> = [];

    if (args && args['orderBy'] != null) {
      if (metadata.isPagination) {
        if (metadata.explicitType == null) {
          throw new SchemaFactoryError('The @Field related to @OrderBy should have its type explicitly defined.',
            SchemaFactoryErrorType.NO_TYPE_ORDERBY_PARENT_FIELD);
        }

        let returnType = metadata.explicitType;
        const fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, returnType.prototype) as FieldTypeMetadata[];
        fieldMetadataList.forEach(def => {
            let fieldReturnType = def.explicitType;
            if (fieldReturnType.prototype == null) {
                orderByFieldArray.push(def);
            }
        });

        if (metadata.args &&
            metadata.args.length > 0) {

          let sortArg = metadata.args.filter(arg => arg.name === 'orderBy')[0];
          if ( sortArg &&
              sortArg.extraParams &&
              sortArg.extraParams.extraColumns &&
              sortArg.extraParams.extraColumns.constructor === Array) {

            if (sortArg.extraParams.shouldIgnoreSchemaFields) {
              // remove all previous items from `orderByFieldArray`
              orderByFieldArray.splice(0, Number.POSITIVE_INFINITY);
            }

            sortArg.extraParams.extraColumns.filter((item: any) => item && item.constructor === String)
            .forEach((item: string) => orderByFieldArray.push({
              name: item,
              description: item,
            }));
          }
        }
        let orderBySortEnumObject = OrderByTypeFactory.orderByFieldEnumFactory(metadata.name, orderByFieldArray);
        let orderByDirectionEnumObject = OrderByTypeFactory.orderByDirectionEnumFactory(metadata.name);
        let orderByInputObject = OrderByTypeFactory.orderByInputObjectFactory(metadata.name, orderBySortEnumObject,
          orderByDirectionEnumObject);
        let orderByInputObjectArray = new GraphQLList(orderByInputObject);
        args['orderBy'].type = orderByInputObjectArray;
      } else {
          throw new SchemaFactoryError('@OrderBy decorator is only allowed inside a method decorated with @Pagination.',
                SchemaFactoryErrorType.ORDER_BY_OUTSIDE_PAGINATION);
      }
    }

    return args;
  }

}
