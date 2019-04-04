## Postgres express app

#### Quick intro

In this app the key features of the library are demonstrated in an express app that is implemented with `Postgres` using
the [Sequelize](http://docs.sequelizejs.com/) ORM.

#### Endpoints

The app exposes an api with the following endpoints:

##### Auth

`POST auth/login` - Log in a user - generates auth token.

##### Permission

`GET permissions` - List all app permissions

##### Role

1. `GET role` - List roles
2. `GET role/:id` - Get a specific role
3. `POST role` - Create a role
4. `PUT role/:id` - Update a role
5. `DELETE role/:id` - Delete a role

##### User

1. `GET user` - List users
2. `GET user/:id` - Get a specific user
3. `PUT user/:id/roles` - Update user roles

##### Article

1. `GET article` - List articles
2. `GET article/:id` - Get a specific article
3. `POST article` - Create an article
4. `PUT article/:id` - Update an article
5. `DELETE article/:id` - Delete an article

#### Key components

The key files and directories to look at are:

1. `permissions/`
2. `policies/`
3. `middleware.js`
4. `routes/`
5. `utils.js`

#### Permissions

The application permissions are defined in the `permissions` directory. Each permission file is given the name of the
entity it represents on the system. Permissions are defined as an object with the keys representing actions and the
values representing the definition of the permission. On a system with many entities the best approach is to define each
permission on a separate file and load them using the `loadPermissions` method. On a small system they can be defined on
a single file. In this example we define permissions for `article`, `permission`, `role` and `user` which are system
entities.

#### Policies

Policies are the rules that determine what actions a user is allowed to perform on the system. The application policies
are defined in the `policies` directory. Rules are defined as an object with the keys representing actions and values
representing the rules that determine how the decision on the users to allow is arrived at. In this example we define
policies for `article`, `permission`, `role` and `user` which are system entities. A breakdown of the article policy:

1. `view` - determines whether the user can see articles either by listing or getting one. Where needed, it can be
   broken down into two e.g. `index` and `get`. From the rules, it is only possible to view articles if you have any of
   `article.view`, `article.create`, `article.update` or `article.delete` permissions.
2. `create` - determines whether the user can create new articles. From the rules, it is only possible to create an
   article if you have the `article.create` permission.
3. `update` - determines whether the user can update an existing article. From the rules, it is only possible to update
   an article if it belongs to you. It makes use of the `req.context.article` object in a callback that determines if
   the user owns the article. This example shows that it is possible for a callback rule to supersede a permission rule.
4. `delete` - determines whether a user can delete an article. It only allows the owner of the article or a user with
   `article.delete` permission to delete the article. The checking of the owner is done by the same callback that
   is used to authorizes article update.

#### Middleware

When a request is received the aim is to invoke a controller method to process it. Before the controller method is hit
we have middleware to perform checks. The key ones are:

1. `init` - sets `req.context` to an empty object. req.context is used to add our custom request values to avoid polluting
   or accidentally overriding important `req` object values.
2. `authenticate` - determines identity of the user that is making the request. It does this by checking the jwt token
   passed via the authorization header. If the authorization header is not provided or the user it identifies does not
   exist authentication fails. This causes the request to fail with a `401 status`. If the user exists it adds the user
   object to the req object (`req.user`) to be used by the next handlers.
3. `can` - checks whether the user is authorized to perform the action that they are trying to perform on a given
   entity. In the implementation, it makes use of the `authorize` method to create an express middleware method to
   authorize a specific action. The authorize method takes the following parameters: `action`, `entity`,
   `authenticated user permissions`, `policies` and the `req express object`. The last parameter is optional so long as
   none of the app policies make use of it.
4. `processArticleParam` - checks whether the article represented by the `id` parameter exists. If not the request fails
   with a `404 status`. If it exists it adds the article object to the req.context object and the request is allowed to
   proceed to the next handler. Note that this middleware is only relevant for requests that have the id parameter i.e.
   get one, update and delete.
5. `processRoleParam` - checks whether the role represented by the `id` parameter exists. If not the request fails
   with a `404 status`. If it exists it adds the role object to the `req.context` object and the request is allowed to
   proceed to the next handler. The middleware is only relevant for requests that have the id parameter i.e. get one,
   update and delete.
6. `processUserParam` - checks whether the user represented by the `id` parameter exists. If not the request fails with
   a `404 status`. If it exists it adds the user object to the `req.context` object and the request is allowed to
   proceed to the next handler. The middleware is only relevant for requests that have the is parameter i.e. get one,
   and setRoles.

#### Routes

The routes directory is made up of routers named after the system entity they represent. All the routers are registered
to the application in `index.js`. Inside all the routes that require authorization is a function, `authorize()`, that
creates authorization middleware specific to that module for the given action. This removes the repetition of having to
call `can` with two values, the `action` and `entity`. Authentication is applied to all routes except for the `/` and
the `auth/login` routes. For routes that have a parameter the `process{Entity}Param` middleware comes before the
authorize middleware. This is because we need to load the entity if it exists in case it is required when checking for
authorization.

#### Utils

The `utils.js` file defines functions that are used throughout the app to simplify code and separate concerns. The ones
we are most interested in are:

1. `getAppPermissions()` - loads the application permissions defined in the `permissions` directory by making use of the
   `loadPermissions` helper method.
2. `validatePermissions()` - validates a list of permissions against the system permissions using the
   `validatePermissions` helper method.

### Installing packages

Ensure that you're on the `examples/postgres/` directory of this repository.

```bash
$ yarn
```

### Setting up environment

This guide assumes that you have `postgres` set up on your computer and have enough knowledge to interact with postgres
databases. Refer to this [resource](https://www.guru99.com/introduction-postgresql.html) for quick reference. Follow the
following steps:

1. Create two postgres databases with names of your choice.
2. Copy `.env.example` to `.env` and edit the environment variables to match your computer's postgres credentials and
   the databases that you created.
3. Migrate the development database schema:
   ```bash
   yarn migrate
   ```
   To undo this step run:
   ```bash
   yarn migrate:undo
   ```
4. Seed the database with some data.
   ```bash
   yarn seed
   ```
   To undo this step run:
   ```bash
   yarn seed:undo
   ```

### Running tests

```bash
$ yarn test
```

### Testing manually (using Postman)

A Postman collection that you can import is included on the root of the project. Before testing the endpoints on Postman 
be sure to migrate the schema and seed the database. The following users will be seeded:

```text
1. Foo Bar => username: foobar
2. Bar Baz => username: barbaz
3. Jane Doe => username: janedoe
4. John Doe => username: johndoe
```

All of them use the password `password`.

Start express server.

```bash
$ yarn start
```

To login make the following request:

`POST auth/login`

```json
{
  "username": "foobar",
  "password": "password"
}
```

Use the resulting token as the authorization header to make your requests. Remember to prefix the token with `Bearer`
i.e. `Bearer {token}` e.g. `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`.

To list the application permission make the following request:

1. `GET permission`

The permissions that are listed are the only valid ones on a role.

To interact with the role module CRUD make the following requests:

1. `GET role`
2. `GET role/:id`
3. `POST role`
   ```json
   {
     "name": "My role",
     "permissions": ["article.create"]
   }
   ```
4. `PUT role/:id`
   ```json
   {
     "name": "My updated role",
     "permissions": ["article.create", "article.update"]
   }
   ```
5. `DELETE role/:id`

Confirm that it is impossible to add an invalid permission i.e. a permission that does not exist on the app.

To interact with the user module make the following requests:

1. `GET user`
2. `GET user/:id`
3. `PUT user/:id/role`
   ```json
   {
     "roleIds": [1, 2]
   }
   ```

Confirm that it is impossible to add an invalid role i.e. a role that does not exist on the app.

To interact with the article module CRUD make the following requests:

1. `GET article`
2. `GET article/:id`
3. `POST article`
   ```json
   {
     "title": "My article",
     "body": "This is me talking"
   }
   ```
4. `PUT article/:id`
   ```json
   {
     "title": "My updated article",
     "body": "See? I'm updated."
   }
   ```
5. `DELETE article/:id`

Confirm that it is impossible for any user to update an article that is created by another. Also, confirm that only a
the owner or a user with `article.delete` permission can delete an article.
