import { ObjectType, Field, EnumType, Value } from 'graphql-schema-decorator';
import * as gql from 'graphql';




@ObjectType({ description: 'A user type.' })
export class User {
	@Field({ type: gql.GraphQLID })
	id: string;

	@Field()
	name: string;

	@Field({ nonNull: true })
	email: string;
}
