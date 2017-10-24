# Simple CRUD example

## Install

```sh
npm i
```

### Run

```sh
npm start
```

And open http://localhost:3000/ in your browser. 


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


##### View Generated Schema
```
http://localhost:3000/schema
```

