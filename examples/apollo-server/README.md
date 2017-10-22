# Simple CRUD example

## Install

```sh
npm i
```

### Run

```sh
npm start
```

And open localhost:3000/graphiql in your browser. 


##### Subscribe
```gql
subscription {
  userAdded {
    id
    name
    email
  }
}
```


##### Push
```gql
mutation {
  addUser(input: {name: "Ezeki", email: "ez@jok.io"}) {
    id
  }
}
```

