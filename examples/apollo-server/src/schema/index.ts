import { Query, Mutation, Schema, schemaFactory } from 'graphql-schema-decorator';
import UserQuery from './user.query';
import UserMutation from './user.mutation';

@Schema()
class RootSchema {
	@Query({ description: 'User Query' })
	UserQuery: UserQuery;

	@Mutation({ description: 'User Actions' })
	UserMutation: UserMutation;
}


const schema = schemaFactory(RootSchema);
export default schema;
