import {
    Arg,
    Field,
    InputObjectType,
    Mutation,
    ObjectType,
    Query,
    Schema,
    schemaFactory,
} from 'graphql-schema-decorator';

import { createHash } from 'crypto';
import {users as data} from './data';

const graphql = require('graphql');

let users = data.slice();

@ObjectType({description: 'A user type.'})
class User {
    @Field({type: graphql.GraphQLID, nonNull: true}) id: string;
    @Field() name: string;
    @Field({nonNull: true}) email: string;
}

@ObjectType({description: 'A root query.'})
class QueryType {
    @Field({description: 'return all users.', isList: true, type: User})
    allUsers() {
        return users;
    }
}

@InputObjectType({description: 'A input object to update a user.'})
class UserForUpdate {
    @Field() name: string;
    @Field() email: string;
}

@InputObjectType({description: 'A input object to create a user.'})
class UserForCreate {
    @Field() name: string;
    @Field({nonNull: true}) email: string;
}


@ObjectType({description: 'Mutations.'})
class MutationType {

    @Field({type: User, description: 'Update a user and return the changed user.'})
    changeUser(
        @Arg({name: 'id', nonNull: true}) id: string,
        @Arg({name: 'input'}) input: UserForUpdate,
    ) {
        const user = users.find(u => u.id === id) as User;
        if (!user) return null;
        Object.assign(user, input);
        return user;
    }

    @Field({type: User, description: 'Create a user and return the created user.'})
    addUser(
        @Arg({name: 'input', nonNull: true}) input: UserForCreate,
    ) {
        const newUser = new User();
        const shasum = createHash('sha1');
        shasum.update('usr' + Date.now());
        newUser.id = shasum.digest('hex');
        Object.assign(newUser, input);
        users.push(newUser);
        return newUser;
    }

    @Field({type: User, description: 'Delete a user and return the removed user.'})
    deleteUser(
        @Arg({name: 'id', nonNull: true}) id: string,
    ) {
        const user = users.find(u => u.id === id) as User;
        if (!user) return null;
        users = users.filter(u => u.id !== user.id);
        return user;
    }
}

@Schema()
class RootSchema {
    @Query() query: QueryType;
    @Mutation() mutation: MutationType;
}

export const schema = schemaFactory(RootSchema);
