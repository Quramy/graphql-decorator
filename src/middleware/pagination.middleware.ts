import { FieldMetadata } from '../metadata';
import { PageInfo } from '../page-info.type';
import { PaginationResponse } from '../pagination.type';
import { getMetadataBuilder } from '../metadata-builder';

export function PaginationMiddleware(target: any, propertyKey: string, methodDescriptor: TypedPropertyDescriptor<any>): any {
  return {
    value: async function (...args: any[]) {
      let [data, count] = await methodDescriptor.value.apply(this, args);

      return getMetadataBuilder().buildFieldMetadata(target)
        .filter(metadata => metadata.property === propertyKey)
        .map(metadata => metadata.arguments)
        .map(fieldArguments => {
          const paginationValues = fieldArguments
            .reduce((indexMap, metadata) => {
              indexMap[metadata.name] = args[metadata.index];
              return indexMap;
            }, {} as { [name: string]: number; });
          return new PaginationResponse(count, data, new PageInfo(count, paginationValues['offset'], paginationValues['limit']));
        })
        .find((_, index) => index === 0);
    },
  };
}
