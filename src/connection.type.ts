const graphql = require("graphql");

import * as PaginationTypes from './page-info.type';

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
            type: PaginationTypes.PageInfoType,
            description: 'Page information'
          }
        }
      }
    });
  }

}
