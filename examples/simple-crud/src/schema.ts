import {
    schemaFactory,
    Schema,
    Query,
    Mutation,
    ObjectType,
    InputObjectType,
    Field,
    List,
    NonNull,
    Arg,
} from "graphql-decorator";

const graphql = require("graphql");
import {users as data} from "./data";
import { createHash } from "crypto";

let users = data.slice();

@ObjectType()
class User {
    @NonNull() @Field({type: graphql.GraphQLID}) id: string;
    @Field() name: string;
    @NonNull() @Field() email: string;
}

@ObjectType()
class QueryType {
    @List() @Field({type: User})
    allUsers() {
        return users;
    }
}

@InputObjectType()
class UserForUpdate {
    @Field() name: string;
    @Field() email: string;
}

@InputObjectType()
class UserForCreate {
    @Field() name: string;
    @NonNull() @Field() email: string;
}


@ObjectType()
class MutationType {

    @Field()
    changeUser(
        @NonNull() @Arg({name: "id"}) id: string,
        @Arg({name: "input"}) input: UserForUpdate
    ): User {
        const user = users.find(u => u.id === id) as User;
        if (!user) return null;
        Object.assign(user, input);
        return user;
    }

    @Field()
    addUser(
        @NonNull() @Arg({name: "input"}) input: UserForCreate
    ): User {
        const newUser = new User();
        const shasum = createHash("sha1");
        shasum.update("usr" + Date.now());
        newUser.id = shasum.digest("hex");
        Object.assign(newUser, input);
        users.push(newUser);
        return newUser;
    }

    @Field({type: User})
    deleteUser(
        @NonNull() @Arg({name: "id"}) id: string
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
