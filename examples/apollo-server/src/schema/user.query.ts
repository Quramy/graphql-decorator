import { List, Field, ObjectType } from 'graphql-schema-decorator';
import { User } from './types/user.type';
import { users } from '../data';


export default class UserQuery {
	@Field({ type: User, description: 'return all users.', isList: true })
	users() {
		return users;
	}
}
