import * as graphql from 'graphql';
import { OrderByItem } from './order-by-item';
import { PageInfoType, PageInfo } from './page-info.type';

export interface PaginationResponse<T> {
  count: number;
  nodes: T[];
  pageInfo: PageInfo;
}

export class PaginationRequest {
  constructor(
    readonly offset: number,
    readonly limit: number,
    readonly orderBy: OrderByItem[]
  ) { }
}

export class PaginationType {

  public static build(name: string, type: any): any {

    return new graphql.GraphQLObjectType({
      name: name + 'Connection',
      description: 'Connecton object that connects ' + name + ' to the server',
      fields: function () {
        return {
          count: {
            type: graphql.GraphQLInt,
            description: 'Total number of elements'
          },
          nodes: {
            type: new graphql.GraphQLList(type),
            description: 'Array of elements'
          },
          pageInfo: {
            type: PageInfoType,
            description: 'Page information'
          }
        }
      }
    });
  }

}
