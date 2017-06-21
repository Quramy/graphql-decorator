import * as graphql from 'graphql';

import { GraphQLObjectType } from 'graphql';

export class PageInfo {

  public readonly hasNextPage: boolean;
  public readonly hasPreviousPage: boolean;

  constructor(count: number, offset: number, limit: number) {
    count = count || 0;
    offset = offset || 0;
    limit = limit > 0 ? limit : count;
    this.hasNextPage = count > (offset + limit);
    this.hasPreviousPage = offset > 0;
  }

}

export const PageInfoType =
  new graphql.GraphQLObjectType({
    name: 'PageInfo',
    description: 'Contains current paging information.',
    fields: function () {
      return {
        hasNextPage: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
        },
        hasPreviousPage: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
        },
      };
    },
  });
