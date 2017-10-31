import { QueryOption, MutationOption, SubscriptionOption, EntryTypeOption } from '../metadata/options';
import { EntryType } from '../metadata/args';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * It is used to create a root {@link GraphQLObjectType} object as a schema Query
 * See [GraphQL Documentation - Queries and Mutations]{@http://graphql.org/learn/schema/#the-query-and-mutation-types}
 * 
 * @param option Options for a Query
 */
export function Query(option?: QueryOption) {
  return entry(EntryType.Query, option);
}

/**
 * It is used to create a root {@link GraphQLObjectType} object as a schema Mutation
 * See [GraphQL Documentation - Queries and Mutations]{@http://graphql.org/learn/schema/#the-query-and-mutation-types}
 * 
 * @param option Options for a Mutation
 */
export function Mutation(option?: MutationOption) {
  return entry(EntryType.Mutation, option);
}

/**
 * It is used to create a root {@link GraphQLObjectType} object as a schema Subscription
 * See [GraphQL Blog - Subscriptions in GraphQL and Relay]{@http://graphql.org/blog/subscriptions-in-graphql-and-relay/}
 * 
  * @param option Options for a Subscription
 */
export function Subscription(option?: SubscriptionOption) {
  return entry(EntryType.Subscription, option);
}

function entry(type: EntryType, option?: EntryTypeOption) {
    return function (target: any, propertyKey: any) {
      getMetadataArgsStorage().entries.push({
        target: target,
        name: target.name,
        description: option ? option.description : null,
        property: propertyKey,
        type: type,
      });
    };
}
