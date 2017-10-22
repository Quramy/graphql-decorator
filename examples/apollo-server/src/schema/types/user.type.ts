import { ObjectType, Field, EnumType, Value, Ctx, Arg, OrderBy, Root, OrderByItem, PaginationResponse } from 'graphql-schema-decorator';
import * as gql from 'graphql';
import { Account } from './account.type';
import { PageInfo } from 'graphql-schema-decorator/lib/page-info.type';


@ObjectType({ description: 'A user type.' })
export class User {
	@Field({ type: gql.GraphQLID })
	id: string;

	@Field()
	name: string;

	@Field()
	email: string;

	@Field({ type: Account, pagination: true })
	accounts?(
		@Ctx() context: any,
		@Root() root: any,
		@Arg({ name: 'offset' }) offset: number,
		@Arg({ name: 'limit' }) limit: number,
		@OrderBy() orderBy: OrderByItem[],
	) {
		console.log(context, offset, limit, orderBy[0]);

		const result = [
			{ id: '1', name: 'account 1' },
			{ id: '2', name: 'account 2' },
			{ id: '3', name: 'account 3' },
		];

		return new PaginationResponse<Account>(3, result, null);
	}
}
