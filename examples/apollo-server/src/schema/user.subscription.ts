import { ObjectType, Field, Arg, InputObjectType, Mutation, EnumType, Value } from 'graphql-schema-decorator';
import { withFilter } from 'graphql-subscriptions';
import { User } from './types/user.type';
import { users } from '../data';
import { pubsub } from './common';
import { GraphQLObjectType } from 'graphql';


export default class UserSubscription {

	@Field({ type: User, description: 'Create a user and return the created user.' })
	userAdded = {
		subscribe: () => pubsub.asyncIterator('userAdded'),
	};

	@Field({ type: User, description: 'Delete a user and return the removed user.' })
	userDeleted = {
		subscribe: withFilter(
			() => pubsub.asyncIterator('userDeleted'),
			(payload, variables) => {
				// the `messageAdded` channel includes events for all channels, so we filter to only
				// pass through events for the channel specified in the query
				return true;
			},
		),
	};
}
