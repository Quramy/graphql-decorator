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
    Description,
} from "graphql-decorator";

const graphql = require("graphql");
import {users as data} from "./data";
import { createHash } from "crypto";

let users = data.slice();

@ObjectType()
@Description("A user type.")
class User {
    @NonNull() @Field({type: graphql.GraphQLID}) id: string;
    @Field() name: string;
    @NonNull() @Field() email: string;
}

@ObjectType()
@Description("A root query.")
class QueryType {
    @Description("return all users.")
    @List() @Field({type: User})
    allUsers() {
        return users;
    }
}

@InputObjectType()
@Description("A input object to update a user.")
class UserForUpdate {
    @Field() name: string;
    @Field() email: string;
}

@InputObjectType()
@Description("A input object to create a user.")
class UserForCreate {
    @Field() name: string;
    @NonNull() @Field() email: string;
}


@ObjectType()
@Description("Mutations.")
class MutationType {

    @Field({type: User})
    @Description("Update a user and return the changed user.")
    changeUser(
        @NonNull() @Arg({name: "id"}) id: string,
        @Arg({name: "input"}) input: UserForUpdate
    ) {
        const user = users.find(u => u.id === id) as User;
        if (!user) return null;
        Object.assign(user, input);
        return user;
    }

    @Field({type: User})
    @Description("Create a user and return the created user.")
    addUser(
        @NonNull() @Arg({name: "input"}) input: UserForCreate
    ) {
        const newUser = new User();
        const shasum = createHash("sha1");
        shasum.update("usr" + Date.now());
        newUser.id = shasum.digest("hex");
        Object.assign(newUser, input);
        users.push(newUser);
        return newUser;
    }

    @Field({type: User})
    @Description("Delete a user and return the removed user.")
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
