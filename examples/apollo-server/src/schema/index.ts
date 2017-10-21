import { Query, Mutation, Schema, schemaFactory } from 'graphql-schema-decorator';
import UserQuery from './user.query';
import UserMutation from './user.mutation';

@Schema()
class RootSchema {
	@Query()
	UserQuery: UserQuery;

	@Mutation()
	UserMutation: UserMutation;
}


const schema = schemaFactory(RootSchema);
export default schema;
