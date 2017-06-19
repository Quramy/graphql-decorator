import * as graphql from 'graphql';
import { GraphQLObjectType } from 'graphql';

export class PageInfo {

  private readonly hasNextPage: boolean;
  private readonly hasPreviousPage: boolean;

  constructor(count: number, offset: number, limit: number) {
    this.hasNextPage = offset !== null && limit !== null && count > (offset + limit);
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
