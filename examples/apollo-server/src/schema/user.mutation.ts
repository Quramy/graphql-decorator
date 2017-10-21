import { ObjectType, Field, Arg, InputObjectType, NonNull, Mutation } from 'graphql-schema-decorator';
import { User } from './user.type';
import { users } from '../data';

@InputObjectType({ description: 'A input object to create a user.' })
class UserForCreate {
	@Field()
	name: string;

	@Field({ nonNull: true })
	email: string;
}



@ObjectType({ description: 'User Mutations.' })
export default class UserMutation {

	@Field({ type: User, description: 'Create a user and return the created user.' })
	addUser(
		@NonNull() @Arg({ name: 'input' })
		input: UserForCreate,
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
		@NonNull() @Arg({ name: 'id' })
		id: string,
	) {
		const user = users.find(u => u.id === id) as User;
		if (!user) return null;

		const index = users.indexOf(user);
		if (index === -1)
			return null;

		users.splice(index, 1);
		return user;
	}
}


