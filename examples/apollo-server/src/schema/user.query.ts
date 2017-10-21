import { List, Field, ObjectType } from 'graphql-schema-decorator';
import { User } from './user.type';
import { users } from '../data';


export default class UserQuery {
	@List()
	@Field({ type: User, description: 'return all users.' })
	Users() {
		return users;
	}
}
