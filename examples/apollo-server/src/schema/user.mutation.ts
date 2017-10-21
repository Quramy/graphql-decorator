import { ObjectType, Field, Arg, InputObjectType, Mutation, EnumType, Value } from 'graphql-schema-decorator';
import { User } from './user.type';
import { users } from '../data';

@InputObjectType({ description: 'A input object to create a user.' })
class UserForCreate {
	@Field()
	name: string;

	@Field({ nonNull: true })
	email: string;
}


@EnumType({ description: 'An user role. Either ADMIN or DEFAULT' })
export class UserRoleType {

	@Value(0, { description: 'Admin role' })
	ADMIN: string;

	@Value('value', { description: 'Default role' })
	DEFAULT: string;

	@Value(null, { description: 'God role' })
	GOD: string;

}


export default class UserMutation {

	@Field({ type: User, description: 'Create a user and return the created user.' })
	addUser(
		@Arg({ name: 'input', nonNull: true }) input: UserForCreate,
		// @Arg({ name: 'type', type: UserRoleType }) type: UserRoleType,
	) {
		const newUser = new User();
		// const shasum = createHash('sha1');
		// shasum.update('usr' + Date.now());
		// newUser.id = shasum.digest('hex');
		// Object.assign(newUser, input);
		users.push(newUser);
		return newUser;
	}

	@Field({ type: User, description: 'Delete a user and return the removed user.' })
	deleteUser(
		@Arg({ name: 'id', nonNull: true }) id: string,
	) {
		const user = users.find(u => u.id === id) as User;
		if (!user) return null;

		const index = users.indexOf(user);
		if (index === -1)
			return null;

		users.splice(index, 1);
		return user;
	}



	@Field({ type: User, description: 'Delete a user and return the removed user.' })
	enumTest(
		@Arg({ name: 'type2', type: UserRoleType }) type: UserRoleType,
	) {
		return {
			name: type,
		};
	}
}


