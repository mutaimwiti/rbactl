## rbactl

[![build](https://gitlab.com/mutaimwiti/rbactl/badges/master/build.svg)](https://gitlab.com/mutaimwiti/rbactl/pipelines)
[![coverage](https://gitlab.com/mutaimwiti/rbactl/badges/master/coverage.svg)](https://gitlab.com/mutaimwiti/rbactl/commits/master)
[![version](https://img.shields.io/npm/v/rbactl.svg)](https://www.npmjs.com/package/rbactl)
[![downloads](https://img.shields.io/npm/dm/rbactl.svg)](https://www.npmjs.com/package/rbactl)
[![license](https://img.shields.io/npm/l/rbactl.svg)](https://www.npmjs.com/package/rbactl)

**rbactl** is an easy to use and intuitive role-based access control library for [Express](https://expressjs.com/)
apps. The library embraces the unopinionated and minimalist approach of express and can also be used with other
frameworks built on top of express. Your app decides how to store and retrieve roles (plus permissions) and the
authentication logic. The library only comes in to simplify the process of building your authorization logic.

> Repo : [GitLab](https://gitlab.com/mutaimwiti/rbactl) | [GitHub](https://github.com/mutaimwiti/rbactl)

### Installation

Use one of the two based on your project's dependency manager.

```bash
$ npm install rbactl --save

$ yarn add rbactl
```

### Getting started

1. Install the library.

2. Define application permissions.

   Permissions can be defined in a single file or directory with each entity having its own file. This does not prevent
   you from defining it on an object on the fly.

3. Define application policies.

   Policies can be defined in a single file or directory with each entity having its own file. This does not prevent
   you from defining it on an object on the fly.

4. Add or update user and role models.

   The role model should have a property that stores permissions (an array). A relationship should exist such that a
   user can have many roles and a role can have many users. The user model should have a property or a function that
   returns the user's list of permissions based on their roles.

5. Add or update user and role control logic.

   This will allow management of roles and users on the application. It should achieve at least the following:

   - Creation of roles
   - Setting of role permissions
   - Setting of user roles

6. Add user sign up / creation logic

   This will allow for creation of user accounts.

7. Create your authentication middleware.

   Ideally, once the middleware identifies the user it should add the user object to the `req` object.

8. Create your authorization middleware creator.

   This will take an action and entity and return a middleware function that authorizes the action against the
   user permissions and system policies.

9. Apply both the authentication and authorization middleware as required on your routes.

10. Consider defining an authorization check method, `can`, on your user model.

    This can prove convenient if you still need to perform an authorization check without necessarily doing it at the
    routing level.

### Quick start

##### Define permissions

```javascript
const { parsePermissions } = require('rbactl');

const permissions = parsePermissions({
  article: {
    '*': 'Full articles access',
    view: 'View articles',
    create: 'Create articles',
    update: 'Update articles',
    delete: 'Delete articles',
  },
  report: {
    '*': 'Full reports access',
    view: 'View reports',
    create: 'Create reports',
    update: 'Update reports',
    delete: 'Delete reports',
  },

  // ... more permissions ...
});
```

> See an actual example of this;
> [mongo](examples/mongo/app/permissions.js) or [postgres](examples/postgres/app/permissions).
>
> See [permissions documentation](DOCUMENTATION.md#permissions).

##### Define policies

```javascript
const policies = {
  article: {
    view: {
      any: [
        'article.view',
        'article.create',
        'article.update',
        'article.delete',
      ],
    },
    create: 'article.create',
    update: 'article.update',
    delete: 'article.delete',
  },

  report: {
    view: {
      any: ['report.view', 'report.create', 'report.update', 'report.delete'],
    },
    create: 'report.create',
    update: 'report.update',
    delete: 'report.delete',
  },

  // ... more policies ...
};
```

> See an actual example of this;
> [mongo](examples/mongo/app/policies.js) or [postgres](examples/postgres/app/policies).
>
> See [policies documentation](DOCUMENTATION.md#policies).

##### Define roles

Ideally, you will have a Role model that has a permissions property (array). This is just a simple static example.

```javascript
const roles = [
  {
    name: 'Basic',
    permissions: ['article.view'],
  },

  {
    name: 'Admin',
    permissions: ['article.create', 'article.update'],
  },

  {
    name: 'Super Admin',
    permissions: ['article.*'],
  },

  // ... more roles ...
];
```

> See an actual example of this;
> [mongo](examples/mongo/app/models/role.js) or [postgres](examples/postgres/app/models/role.js).

##### Define user permissions resolver

The user model should have a relationship with the roles model. This is required to determine the permissions of a
user.

```javascript
const User = {
  // ... other user model logic and properties

  /**
   * The definition of this function is down to your persistence
   * system.
   *
   * @returns {Array}
   */
  getPermissions() {
    let permissions = [];

    this.roles.forEach((role) => {
      permissions = permissions.concat(role.permissions);
    });

    return permissions;
  },

  // ... other user model logic and properties
};
```

> See an actual example of this;
> [mongo](examples/mongo/app/models/user.js) or [postgres](examples/postgres/app/models/user.js).

##### Define authentication middleware

This is a tiny snippet of the authorization middleware. It only shows the success case where the user object is added
to the `req` express object.

```javascript
const authenticate = async (req, res, next) => {
  // other authentication logic

  // make user object available to the next handlers
  req.user = authUserObject;
  next();

  // other authentication logic
};
```

> See an actual example of this;
> [mongo](examples/mongo/app/middleware/authenticate.js) or
> [postgres](examples/postgres/app/middleware/authenticate.js).

##### Define authorization middleware - can

```javascript
const { createCan } = require('rbactl');

const can = createCan(
  // the system policies
  policies,

  // user permissions resolver
  async (req) => req.user.getPermissions(),

  // unauthorized request handler
  (req, res) => {
    return res.status(403).json({
      message: `You are not authorized to perform this action.`,
    });
  },

  // authorization exception handler
  (req, res) => {
    return res.status(500).json({
      message: 'Sorry :( Something bad happened.',
    });
  },
);
```

> See an actual example of this;
> [mongo](examples/mongo/app/middleware/can.js) or [postgres](examples/postgres/app/middleware/can.js).
>
> See [authorization documentation](DOCUMENTATION.md#authorization).

##### Protect endpoints

```javascript
// assuming we have our simple app ...
const app = express();

app.get('/article/', authenticate, can('view', 'article'), () => {
  // user is allowed to view list of articles
});

app.post('/article/', authenticate, can('create', 'article'), () => {
  // user is allowed to create article
});

// ... the same pattern applies for other routes
```

> See an actual example of this;
> [mongo](examples/mongo/app/routes) or [postgres](examples/postgres/app/routes).

### Complete examples

To wrap your head around the entire process carefully go through one or both examples:

- [Mongo](examples/mongo)
- [Postgres](examples/postgres)

> These may still not make everything crystal clear. Go through the [documentation](DOCUMENTATION.md#documentation) to 
> understand all key concepts.

### Licence

[MIT](https://mit-license.org/) © Mutai Mwiti |
[GitHub](https://github.com/mutaimwiti) |
[GitLab](https://gitlab.com/mutaimwiti)

_**DISCLAIMER:**_
_All opinions expressed in this repository are mine and do not reflect any company or organisation I'm involved with._
