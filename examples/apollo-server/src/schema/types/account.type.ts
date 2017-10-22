import { ObjectType, Field, EnumType, Value } from 'graphql-schema-decorator';
import * as gql from 'graphql';




@ObjectType({ description: 'A user account type.' })
export class Account {
	@Field({ type: gql.GraphQLID })
	id: string;

	@Field({ type: gql.GraphQLString })
	name: string;
}
