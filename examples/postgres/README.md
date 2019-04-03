# Postgres express app

## Quick intro

In this app the key features of the library are demonstrated in a simple manner. The app exposes an api with the
following endpoints:

1. `GET article` - List articles
2. `GET article/:id` - Get a specific article
3. `POST article` - Create an article
4. `PUT article/:id` - Update an article
5. `DELETE article/:id` - Delete an article

The key files to look at are:

1. `permissions.js`
2. `policies.js`
3. `middleware.js`
4. `routes.js`

When a request is received the aim is to invoke a controller method to process it. Before the controller method is hit
we have middleware to perform checks. The key ones are:

1. `init` - sets req.context to an empty object. req.context is used to add our custom request values to avoid polluting
   or accidentally overriding important req object values.
2. `authenticate` - determines identity of the user that is making the request. Since we are not demonstrating how to
   authenticate we use a simple solution where the `authorization` header is the `id` of the intended user. If the id
   does not exist or none is passed authentication fails. This causes the request to fail with a `401 status`. If the
   user exists it adds the user object to the express req object to be used by proceeding handlers.
3. `articleExists` - checks whether the article represented by the `id` parameter exists. If not the request fails with
   a `404 status`. If it exists it adds the article object to the req.context object. the request is allowed to proceed
   to the next handler. Note that this middleware is only relevant for requests that have the id parameter i.e. get one,
   update and delete.
4. `can` - checks whether the user is authorized to perform the action that they are trying to perform on a given
   entity. In the implementation, it makes use of the `authorize` method to create an express middleware method to
   authorize a specific action. The authorize method takes the following parameters: `action`, `entity`,
   `auth user permissions`, `policies` and the `req express object`. The last parameter is optional so long as the app
   policies don't make use of it. The policies are defined in the `policies.js` file which documents on its source how
   to break down policies into files when the need arises.

Breaking down the policies:
This app defines policies only for one entity - article.

1. `view` - determines whether the user can see articles either by listing or getting one. Where need be it can be
   broken down into two e.g. `index` and `get`. From the rules, it is only possible to view articles if you have any of
   `article.view`, `article.create`, `article.update` or `article.delete` permissions.
2. `create` - determines whether the user can create new articles. From the rules, it is only possible to create an
   article if you have the `article.create` permission.
3. `update` - determines whether the user can update an existing article. From the rules, it is only possible to update
   an article if it belongs to you. It makes use of the `req` express object in a callback that determines if the user
   owns the article.
4. `delete` - determines whether a user can delete an article. It uses the same callback as the update policy to
   determine whether the user owns the article.

## Install packages

Ensure that you're on the `examples/postgres/` directory of this repository.

```bash
$ yarn
```

## Setup environment

This guide assumes that you have `postgres` set up on your computer and have enough knowledge to interact manipulate
postgres databases. Refer to this [resource](https://www.guru99.com/introduction-postgresql.html) for quick reference.
Follow the following steps:

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

## Run tests

```bash
$ yarn test
```

## Test manually (using Postman)

In order to make the requests you must set the Authorization header. This should be an integer representing the id of
any of the users of the users that are seeded on the app. Ideally the ids will be either 1, 2, 3 or 4 if you seeded the
data once without reversing the seed. For some of the requests to give relevant results you will need to have migrated
the schema and seeded data. Make the following requests:

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

Remember to vary the `id` parameter for the update and delete requests since they can only be performed by the owners of
the articles.
