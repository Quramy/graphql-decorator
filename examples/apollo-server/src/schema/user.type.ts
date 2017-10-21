import { ObjectType, Field } from 'graphql-schema-decorator';
import * as gql from 'graphql';


@ObjectType({ description: 'A user type.' })
export class User {
	@Field({ type: gql.GraphQLID, nonNull: true })
	id: string;

	@Field()
	name: string;

	@Field({ nonNull: true })
	email: string;
}
