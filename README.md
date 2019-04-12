## xps-rbac

**xps-rbac** is an easy to use and intuitive role-based access control library for [Express](https://expressjs.com/)
apps. The library embraces the unopinionated and minimalist approach of express and can also be used with other
frameworks built on top of express. Your app decides how to store and retrieve roles (plus permissions) and the
authentication logic. The library only comes in to simplify the process of building your authorization logic.

> Repo : [GitLab](https://gitlab.com/mutaimwiti/xps-rbac) | [GitHub](https://github.com/mutaimwiti/xps-rbac)

### Installation

Use one of the two based on your project's dependency manager.

```bash
$ npm install xps-rbac --save

$ yarn add xps-rbac
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

   These should be based on the persistence system of your choice. The role model should have a property that stores
   permissions (an array). A relationship should exist such that a user can have many roles and a role can have many
   users. The user model should have a property or a function that returns the user's list of permissions.

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

### Complete examples

To wrap your head around the entire process carefully go through one or both examples:

- [Mongo](examples/mongo)
- [Postgres](examples/postgres)

> These may still not make everything crystal clear. Go through the [documentation](#documentation) to understand all
> key concepts.

### Quick reference

#### Functions

- Permission
  - [authorize()](#authorize) - authorize a user action on an entity based on user permissions and system policies.
  - [loadPermissions()](#loadpermissions) - generate a permissions object from permissions defined on separate files in
    one directory.
  - [parsePermissions()](#parsepermissions) - generate a permissions object from permissions defined on one object.
  - [getPermissionsMap()](#getpermissionsmap) - get a mapping of a list of permissions with their descriptions.
  - [validatePermissions()](#validatepermissions) - validate a list of permissions against system permissions.
  - [getAllPermissionsFor()](#getallpermissionsfor) - get the list of all permissions for a specific entity.
- Policy
  - [loadPolicies()](#loadpolicies) - generate a policies object from policies defined on separate files in one
    directory.

#### Policy rules

- Permission rules
  - [simple rule](#simple-rule) - specifies a single permission that is required for access.
  - [any rule](#any-rule) - specifies a list of permissions of which a user requires at least one for access.
  - [all rule](#any-rule) - specifies a list of permissions that are all required by a user for access.
- Callback rules

  - [simple](#simple-callback) - specifies a callback that determines whether a user should be granted access.
  - [req rule](#req-callback) - same as simple callback rule but makes use of the `req` express object to determine
    whether the user should be granted access.

- Logical rules
  - [OR rule](#or-rule) - allows specification of rules that require logical ORing.
  - [AND rule](#and-rule) - allows specification of rules that require logical ANDing.
  - [compound rule](#compound-rule) - allows combination of rules using logical ORs and ANDs in any fashion that
    achieves the desired logical check.

### **Documentation**

### The problem (authorization)

The flow of requests on most applications where access is restricted based on user roles:

`Request in -> Authenticate -> Authorize -> Process request -> Response out`

The stages we are most interested in are:

1. `Authentication` - When request a request comes in we try to identify the user making it. This can be through means
   like token-based or session-based authentication. If the user cannot be authenticated, the request fails with a `401`
   error informing the user that they cannot be authenticated. If the user is successfully authenticated, the request
   proceeds to the next stage.
2. `Authorization` - Determine based on some rules (policies) whether the user is allowed to perform the action that
   they are trying to perform. If the user is not allowed, the request fails with a `403` error informing the user that
   they're trying to perform an action or access resources that they're not allowed to. If the user is allowed, the
   request proceeds to the next stage.

Express `middleware` is the exact answer to this problem because each stage is handled by a different middleware. This
means that we have to authenticate the user before authorizing the request. Also, before processing the request,
authorization has to be successful.

### Dealing with the problem

1. `Authentication` - This is the stage where you identify the user that is making the request. The library expects you
   to implement this based on whatever underlying persistence system you are using. This could be `MySQL`, `mongoDB`,
   `postgres`, ... , the choice is yours :smiley_cat:. A common pattern is that after identifying the user, the user
   object is added to the express `req` object so that it is available to all the next handlers. An example with jwt
   auth:

   ```javascript
   // some more code here ...
   const userData = decodeAuthToken(req);
   const user = await User.findOne({ where: { username: userData.username } });
   req.user = user; // take note of this line - we are adding the user object to the req object
   return next();
   // some more code here ...
   ```

2. `Authorization` - At this stage we know the user that is making the request from the request object (`req.user`).
   All we need to do is determine whether they're allowed to perform the action that they're trying to perform. To
   handle this, the library defines three concepts; `entities`, `permissions` and `policies`. This is where the story
   of the library begins.

### Entities

An entity is any system resource from the perspective of the user. Entities are mostly based on but not limited to
system models. For example we can have entities like `role`, `user` and `article` on a simple blogging app. Permissions
and policies are defined based on the system entities.

### Permissions

The definition of permissions is very much straight forward. Permissions are defined per entity, the key being the
action and the value being the description of the permission. The description is the kind of representation that the
user (ideally the admin) will see on the UI. The most common use is when allocating roles or viewing the permissions
of a role or a user.

#### Example permissions definition

```javascript
const permissions = {
  role: {
    "*": "Full roles access",
    view: "View roles",
    create: "Create roles",
    update: "Update roles",
    delete: "Delete roles"
  },
  user: {
    "*": "Full users access",
    view: "View users",
    setRoles: "Update user roles"
  }
};
```

#### Actual examples of permission definitions

- [mongo](examples/mongo/app/permissions.js)
- [postgres](examples/postgres/app/permissions)

#### Permissions helper functions

##### `loadPermissions()`

This function loads permissions that are defined on separate files into one object. It expects one parameter;
`pathname` - path to the permissions. It returns an object with all entities and `$all` as the top level keys. The
inner keys are the permissions prefixed with their respective entities and the values are the description of the
permissions. `$all` is an object combining all the system permissions. Example:

```javascript
const appPermisssions = loadPermissions(`${__dirname}/permissions`);
```

Sample output:

```
{
  role: {
    "role.*": "Full roles access",
    "role.view": "View roles",
    "role.create": "Create roles",
    "role.update": "Update roles",
    "role.delete": "Delete roles"
  },
  user: {
    "user.*": "Full users access",
    "user.view": "View users",
    "user.setRoles": "Update user roles"
  },
  article: {
    "article.*": "Full articles access",
    "article.view": "View articles",
    "article.create": "Create articles",
    "article.update": "Update articles",
    "article.delete": "Delete articles"
  },
  $all: {
    "role.*": "Full roles access",
    "role.view": "View roles",
    "role.create": "Create roles",
    "role.update": "Update roles",
    "role.delete": "Delete roles",
    "user.*": "Full users access",
    "user.view": "View users",
    "user.setRoles": "Update user roles",
    "article.*": "Full articles access",
    "article.view": "View articles",
    "article.create": "Create articles",
    "article.update": "Update articles",
    "article.delete": "Delete articles"
  }
}
```

> This function is ideal for an application with many entities where defining all permissions in a single file would
> mean a very long file. See the [postgres example](examples/postgres/app/permissions).

##### `parsePermissions()`

This function parses permissions that are defined on a single object. It expects one parameter; `permissionsObj` which
is the single object defining all the permissions. It gives the same output as `loadPermissions()`.

##### `getPermissionsMap()`

This function returns an object with the mapping of permissions with their descriptions `(permission : description)`.
It expects two parameters; `systemPermissions` and `permissions`. `systemPermissions` is the the list all system
permissions. `permissions` is the list of permissions for which to get a permission-description mapping. Example:

```javascript
const systemPermisions = parsePermissions(permissions).$all;
getPermissionsMap(systemPermissions, [
  "article.create",
  "user.view",
  "role.delete"
]);
```

Sample output:

```
{
  "article.create": "Create articles" ,
  "user.view": "View users" ,
  "role.delete": "Delete roles"
}
```

##### `validatePermissions()`

This function checks a list of permissions against the system permissions. It returns an object with two values:
`valid (boolean)` indicating whether the permissions are valid and `invalids (list)` with any invalid permissions
found. It expects two parameters; `systemPermissions` and `permissions`. `systemPermissions` is the list all of system
permissions. `permissions` is the list of permissions to validate. Example:

```javascript
const systemPermisions = parsePermissions(permissions).$all;
const validation = validatePermissions(systemPermissions, [
  "article.create",
  "article.something"
]);
```

Output:

```
// console.log(validation)
{
  valid: false,
  invalids: ["article.something"]
}
```

##### `getAllPermissionsFor()`

This function returns all the permissions for a given system entity. It expects two parameters; `systemPermissions`
and `entity`. `systemPermissions` is the the list all system permissions. `entity` is very much self explanatory.
Example:

```javascript
const systemPermisions = loadPermissions(`${__dirname}/permissions`).$all;
const rolePermissions = getAllPermissionsFor(systemPermissions, "role");
```

Sample output:

```
{
  "role.*": "Full roles access",
  "role.view": "View roles",
  "role.create": "Create roles",
  "role.update": "Update roles",
  "role.delete": "Delete roles"
}
```

### Policies

Policies are the rules that define how user access is controlled. They are defined in a manner that is similar to
permissions. They are defined per entity, the key being the action and the value being the rule the defines how user
access is controlled.

#### Actual examples of policy definitions

- [mongo](examples/mongo/app/policies.js) - [documentation](examples/mongo/README.md#policies)
- [postgres](examples/postgres/app/policies) - [documentation](examples/postgres/README.md#policies)

#### Policy helper functions

##### `loadPolicies()`

This function loads policies that are defined on separate files into one object. It expects one parameter; `pathname` -
path to the policies. It returns an object with all entities as the top level keys. The inner keys are the actions
and their values are the rules that define how access is controlled. Example:

```javascript
const policies = loadPolicies(`${__dirname}/policies`);
```

Sample output:

```
{
  role: {
    view: {
      any: ["role.view", "role.create", "role.update", "role.delete"]
    },
    create: "role.create",
    update: "role.update",
    delete: "role.delete"
  },

  user: {
    view: {
      any: ["user.view", "user.setRoles"]
    },
    setRoles: "user.setRoles"
  }
}
```

> This function is ideal for an application with many entities where defining all policies in a single file would
> mean a very long file. See the [postgres example](examples/postgres/app/policies).

#### Available policy rules:

##### `Permission rules`

Permission rules allow you to specify policies based on user permissions. Permission rules are further divided into:

###### `simple rule`

This rule just specifies the permission that is required to perform an action. An example:

```
{
  article: {
    view: "article.view";
  }
}
```

> This rule means that for a user to view an article they need to have `article.view` permission.

###### `any rule`

This allows access if the user has any of the permissions that are specified. An example:

```
{
  article: {
    view: {
      any: [
        "article.view",
        "article.create",
        "article.update",
        "article.delete"
      ]
    }
  }
}
```

> This rule means that a user can view articles if they have `article.view`, `article.create`, `article.update` or
> `article.delete` permission.

###### `all rule`

This allows access if the user has all of the permissions that are specified. An example:

```
{
  user: {
    delete: {
      all: ["user.manage", "user.delete"]
    }
  }
}
```

> This rule means that a user needs to have both `user.manage` and `user.delete` permission to delete a user.

##### `Callback rules`

Callback rules allow you to specify a callback to be executed to determine whether the user should get access. The
library injects the `req` object when executing callbacks. This means that if you make your decision based on some
property on the req object you can use it as an argument to your callback. Examples:

###### `simple callback`

```
{
  article: {
    view: () => {
      // som code ...
      return x === y;
    };
  }
}
```

> This rule means that for a user to view articles `x` MUST be EQUAL to `y`. I could not think of a better example.

###### `req callback`

```
{
  article: {
    update: req => {
      return req.user && req.user.id === req.context.article.owner_id;
    };
  }
}
```

> This rule means that a user needs to be the owner of the article that they're trying to update. How such a check is
> done is entirely up to your persistence system.

##### `Logical rules`

Logical rules allow for combination of other rules using logical operators `AND` and `OR`. The library requires AND to
be represented using `$and` and OR to be represented using `$or`. The value of any logical operator should be an
`array`. At this point things get a little more complicated and I don't have many actual examples to demonstrate the
use of logical rules. Because of that, I will use dummy entities and actions. Note that these logical rules are only
available to ensure that even complex rules can be defined without breaking a sweat. `someCheck` defined below is a
prerequisite callback for the examples to avoid repeating its definition over and over again.

```javascript
const someCheck = () => {
  return shouldBeAllowed();
};
```

###### `OR rule`

This rule performs a logical OR on the provided rules.

- Example 1

  ```
  {
    foo: {
      delete: { $or: [someCheck, "foo.delete"] }
    }
  }
  ```

  > This rule means that for `foo` to be deleted, `someCheck` must return `true` or the user has `foo.delete`
  > permission.

- Example 2

  ```
  {
    foo: {
      activate: {
        $or: [{ any: ["foo.x", "foo.y"] }, someCheck];
      }
    }
  }
  ```

  > This rule means that for `foo` to be activated, `someCheck` must return `true` or the user has either `foo.x`
  > or `foo.y` permission.

- Example 3

  ```
  {
    foo: {
      activate: {
        $or: [{ any: ["foo.x", "foo.y"] }, { $or: ["bar.m", "bar.n"] }];
      }
    }
  }
  ```

  > This rule shows that it is possible to have a nested `$or` rule.

###### `AND rule`

This rule performs a logical AND on the provided rules.

- Example 1

  ```
  {
    foo: {
      delete: { $and: [someCheck, "foo.delete"] }
    }
  }
  ```

  > This rule means that for `foo` to be deleted, `someCheck` must return `true` and the user must have
  > `foo.delete` permission.

- Example 2

  ```
  {
    foo: {
      activate: {
        $and: [{ all: ["foo.x", "foo.y"] }, someCheck]
      }
    }
  }
  ```

  > This rule means that for `foo` to be activated, `someCheck` must return `true` and the user must have both
  > `foo.x` and `foo.y` permissions.

- Example 3

  ```
  {
    foo: {
      activate: {
        $and: [{ any: ["foo.x", "foo.y"] }, { $and: ["bar.m", "bar.n"] }]
      }
    }
  }
  ```

  > This rule shows that it is possible to have a nested `$and` rule.

###### `Compound rule`

This rule combines OR and AND rules.

- Example 1

  ```
  {
    foo: {
      activate: {
        $and: [{ $and: ["foo.x", "foo.y"] }, { $or: ["bar.m", "bar.n"] }]
      }
    }
  }
  ```

  > When defining compound rules with permissions use of `any` and `all` is not necessary. You can use `$or` and `$and`
  > in place of `any` and `all` respectively. It is a good idea to use any and all because it makes the rules easier
  > to understand.

- Example 2

  ```
  {
    foo: {
      deactivate: {
        $or: [
          { all: ["foo.x", "foo.y", "foo.z"] },
          {
            $and: [{ any: ["foo.r", "foo.s", "foo.t"] }, someCheck]
          }
        ];
      }
    }
  }
  ```

- Example 3

  ```
  {
    foo: {
      deactivate: {
        $or: [
          { all: ["foo.x", "foo.y", "foo.z"] },
          {
            $and: [
              { any: ["foo.r", "foo.s", "foo.t"] },
              { $or: [someCheck, "foo.x"] }
            ]
          }
        ];
      }
    }
  }
  ```

  > Rules can be nested in any fashion to achieve the desired logical check.

**IMPORTANT NOTES ON POLICY RULES**

1. An asynchronous call can be made inside a callback rule function. Currently, the library does not support promise
   returning callbacks on nested rules. If one is found an exception is thrown. Promise returning callback rules are
   only allowed ALONE. The clean workaround is to resolve values resulting from asynchronous calls before triggering
   the authorization middleware. In the callback example above (`req callback`), that's exactly the case - the rule
   expects the article in question to have been queried and resolved by a previous middleware.

2. The fact that a user has a certain permission does not necessarily mean that they can perform the action represented
   by the permission; it has to be specified explicitly on the policy definition. For example, if the `article.update`
   action is determined by a callback that ensures that the user is the owner of the article, a user with the
   `article.update` permission but is not the owner cannot update the article.

3. When specifying valid or required permissions, full entity permissions i.e. `entity.*` permissions should not be
   specified. This is because they're automatically checked. For example, if it is specified that a user requires
   `blog.delete` permission to delete a blog, the library will automatically determine that a user with `blog.*`
   permission can delete a blog.

### Authorize

The library provides a function called `authorize` that builds on permissions and policies to authorize requests. The
function authorizes a user action on an entity based on their permissions and system policies. The function accepts
five parameters; `action`, `entity`, `userPermissions`, `policies` and `req`.

1. `action` and `entity` are clear. An example would be: `action: "create"` and `entity: "blog"`.
2. `userPermissions` - the list of permissions for the authenticated user (example: `["user.create", "user.view"]`).
   This list is determined from the roles of a user. The `Role` model is ideally composed of a `name` and `permissions`
   (a list). One of the properties of the User model is `roles`. The relationship is such that a user can have many
   roles and a role can have many users. The user model can have a function that returns a list of all permissions for
   the user. See the `Role` and `User` model definitions for the two examples; [mongo](examples/mongo/app/models) and
   [postgres](examples/postgres/app/models). In a very simple system roles can be statically defined in code. For
   example where we know that we will have three roles like `Superadmin`, `Admin` and `Ordinary User`.
3. `policies` - an object that defines all the system policies. The policy definition can either be from an object
   defining all policies or one that is returned by the `loadPolicies()` helper function. See how they are defined in
   the two examples; [mongo](examples/mongo/app/policies.js) and [postgres](examples/postgres/app/policies).
4. `req` - the `express req` object. This is optional and can be omitted if none of your policies (callback policies)
   make use of it. Note that the library does not in any way mutate the object. Only your callback can do so because
   all the library does is invoke your callback with the object.

### The solution

We now know the user that is making the request (`req.user`) because we are past the authentication middleware. As you
might have guessed, we will make use of `authorize()` to authorize the request. `Authorize()` only checks whether the
user making the request is authorized as per their permissions and system policies. We will need to create a middleware
to perform authorization using `authorize()`.

```javascript
// middleware.js

// import the functions that we require from the library
const { authorize, loadPolicies } = require("xps-rbac");

// if we have defined our policies in one file we simply import them
const policies = require("./policies");

// if we have defined our policies in one directory on a separate file each, we load them
const policies = loadPolicies(`${__dirname}/policies`);

// [authentication middleware] - this is just a snippet ...
const authenticate = (req, res, next) => {
  // ... more logic ...
  // .
  // .
  // the next middleware esp the authorization middleware creator need to know the user
  // we add the user object to the req object to enable this
  req.user = user;
  next();
  // .
  // .
  // ...more logic...
};

// [authorization middleware creator]
// we call it [can] because it returns a middleware that checks whether user can perform
// an action (on an entity). when we trigger it it will be something like:
// - can('create', 'article')
// - can('update', 'article')
const can = (action, entity) => {
  return (req, res, next) => {
    try {
      // retrieve the user's permissions - totally based on your persistence system
      const userPermissions = await req.user.permissions();

      // we are using authorize() method to check whether the user is allowed.
      // if any of your policies use req object, you MUST pass it
      if (!await authorize(action, entity, userPermissions, policies, req)) {
        // authorization failed - the user is not allowed to make the action
        return res.status(403).json({
          message: `You are not authorized to perform this action.`
        });
      }

      // authorization was successful - invoke the next middleware
      return next();
    } catch (e) {
      // three exceptions can be thrown by the authorize function:
      // missing policy, missing policy action or unexpected nested promise callback
      return res.status(500).json({
        message: "Sorry :( Something bad happened."
      });
    }
  };
};

// using the middleware in our routes
// assuming we have our simple app ...
const app = express();

app.post("/article/", authenticate, can("create", "article"), () => {
  // user is allowed to create article
});

app.put(
  "/article/:id",
  authenticate,
  processArticleParam,
  can("update", "article"),
  () => {
    // user is allowed to update the article
  }
);

// the processArticleParam middleware tries to get the article and bind it to the request
// object. This is useful if the update article policy utilizes a callback rule that requires
// the article to be bound on the req object e.g. [req.context.article]. This can be very
// useful if for instance your callback checks whether the authenticated user owns the article.
// This is a classic problem - relying on properties of an object rather than permissions user
// permissions to authorize an action. Callback rules are the perfect tool for this.
```

**IMPORTANT NOTES ON AUTHORIZATION**

1. If you have used a promise callback rule BE SURE to use async await when calling `authorize()`. If you don't do this,
   the function will return a promise. This will cause the authorization check to always succeed. A clean way around
   this is to always use `await` when calling `authorize()`. The cleanest solution is to completely avoid having
   promise returning callbacks. As discussed earlier this is easily achieved by resolving all values resulting from
   asynchronous calls before triggering the authorization middleware.

### Licence

[MIT](https://mit-license.org/) © Mutai Mwiti |
[GitHub](https://github.com/mutaimwiti) |
[GitLab](https://gitlab.com/mutaimwiti)

_**DISCLAIMER:**_
_All opinions expressed in this repository are mine and do not reflect any company or organisation I'm involved with._
