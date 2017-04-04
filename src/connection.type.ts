import * as graphql from 'graphql';

import { PageInfoType, PageInfoObject } from './page-info.type';

export interface ConnectionObject<T> {
  count: number;
  nodes: T[];
  pageInfo: PageInfoObject;
}

export class ConnectionType {

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
