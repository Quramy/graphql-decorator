import * as graphql from 'graphql';

import { PageInfo, PageInfoType } from './page-info.type';

import { OrderByItem } from './order-by-item';

export class PaginationResponse<T> {

  constructor(
    private readonly count: number,
    private readonly nodes: T[],
    private readonly pageInfo: PageInfo,
  ) { }

}

export class PaginationRequest {
  constructor(
    readonly offset: number,
    readonly limit: number,
    readonly orderBy: OrderByItem[],
  ) { }
}

export class PaginationType {

  public static build(name: string, type: any): any {

    return new graphql.GraphQLObjectType({
      name: `${name}Connection`,
      description: `Connecton object that connects '${name}' to the server`,
      fields: function () {
        return {
          count: {
            type: graphql.GraphQLInt,
            description: 'Total number of elements',
          },
          nodes: {
            type: new graphql.GraphQLList(type),
            description: 'Array of elements',
          },
          pageInfo: {
            type: PageInfoType,
            description: 'Pagination information',
          },
        };
      },
    });
  }

}
