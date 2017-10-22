import { ObjectType, Field, Arg, InputObjectType, Mutation, EnumType, Value } from 'graphql-schema-decorator';
import { User } from './types/user.type';
import { users } from '../data';
import { pubsub } from './common';
import { UserCreate } from './inputs/user-create.input';
import { UserRoleType } from './inputs/user-role-type.enum';


export default class UserMutation {

	@Field({ type: User, description: 'Create a user and return the created user.' })
	addUser(
		@Arg({ name: 'input', nonNull: true }) input: UserCreate,
	) {
		const newUser: User = {
			id: (users.length + 1).toString(),
			name: input.name,
			email: input.email,
		};

		users.push(newUser);

		pubsub.publish('userAdded', {
			userAdded: newUser,
		});

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

		pubsub.publish('userDeleted', {
			userDeleted: user,
		});

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


