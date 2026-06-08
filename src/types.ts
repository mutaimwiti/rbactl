// A permission is a dotted action string (e.g. `article.create`) or a full
// group permission (e.g. `article.*`).
export type Permission = string;

// A list of permissions, e.g. the permissions resolved for a user.
export type Permissions = Permission[];

// A permissions map: permission key -> human-readable description. This is the
// shape of each entity entry (and `$all`) produced by `loadPermissions()`.
export type PermissionsMap = Record<Permission, string>;

// The object produced by `loadPermissions()` / `parsePermissions()`: one map
// per entity plus `$all`, which aggregates every system permission.
export interface SystemPermissions {
  $all: PermissionsMap;
  [entity: string]: PermissionsMap;
}

// A rule callback. It receives the express `req` and returns a boolean (or a
// promise of one). The `req` type is intentionally loose - it is whatever the
// consumer's middleware provides.
export type Callback = (req: any) => boolean | Promise<boolean>;

// A policy rule: a permission check, a callback, an `any`/`all` permission
// rule, or a logical combination of rules.
export type Rule =
  | Permission
  | Callback
  | { any: Permissions }
  | { all: Permissions }
  | { $and: Rule[] }
  | { $or: Rule[] }
  | { $nor: Rule[] }
  | { $not: Rule };

// An entity policy: a rule per action, plus optional `$grant`/`$deny` override
// rules that are evaluated before the action policy.
export interface Policy {
  $grant?: Rule;
  $deny?: Rule;
  [action: string]: Rule | undefined;
}

// All system policies, keyed by entity.
export type Policies = Record<string, Policy>;
