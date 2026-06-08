# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-06-09

### Added

- `CHANGELOG.md` following Keep a Changelog + Semantic Versioning.
- GitHub Actions CI (`.github/workflows/ci.yml`): lints and tests the library
  across a Node version matrix, and runs the MongoDB and PostgreSQL example
  test suites against service containers.
- `scripts/release.mjs` and a `release` script that cuts a GitHub release for
  the version in `package.json` (publish-first), with notes pulled from this
  changelog and the built `lib/` attached as `lib.zip`.
- Pull request template (`.github/PULL_REQUEST_TEMPLATE.md`).
- Explicit `types` and `files` fields in `package.json` so the published
  package ships only `lib/` and `index.js`.
- The library CI matrix now also runs on Node 24, and an `engines` field
  declares the supported floor (`node >= 18`).
- `$not` and `$nor` logical operators in policy rules, and implicit AND across
  the multiple keys of a policy object.
- `validatePermissions()` and `getAllPermissionsFor()` now accept the system
  permissions as a plain array of permission strings, in addition to the
  permissions map.
- `$grant` and `$deny` entity policy rules, evaluated before the action policy.
  `$grant` authorizes any defined action when it passes (e.g. admin access);
  `$deny` denies any action when it passes and takes precedence over both
  `$grant` and the per-action policy (e.g. suspended users). Authorization is
  `NOT $deny AND ($grant OR action)`.
- Published, hand-maintenance-free TypeScript types covering the public API and
  the policy DSL (`Rule`, `Policy`, `Policies`, `Permission`, `Permissions`,
  `PermissionsMap`, `SystemPermissions`, `Callback`).

### Changed

- The library is now written in TypeScript and built with `tsc`. The shipped
  declaration (`lib/index.d.ts`) is generated from the source instead of being
  hand-maintained, and Babel has been removed from the toolchain. The published
  JavaScript and the package's runtime behavior are unchanged.
- Policy rule evaluation is now delegated to the
  [`logical-compiler`](https://github.com/mutaimwiti/logical-compiler) library.
  Promise-returning callbacks are now supported at any nesting depth, including
  inside `$and`/`$or`/`$not`/`$nor` — previously a promise callback nested in an
  operator threw `Unexpected nested promise callback`. A callback resolving to a
  non-boolean value now throws a `LogicalCompilerError` (was a generic `[rbactl]`
  error). `authorize()` still returns a `boolean` for fully synchronous policies
  and a `Promise<boolean>` when any rule is asynchronous.
- Reworked the MongoDB and PostgreSQL example test suites: database
  connections are created and closed separately, a global setup clears the
  database before runs, and shared test utilities are grouped on their own.

### Fixed

- A policy object with multiple keys is now AND-ed together instead of silently
  evaluating only the first key.

## [0.1.0] - 2019-08-13

### Added

- Initial release: role-based access control for Express apps — permissions,
  policies, and an `authorize` middleware, with MongoDB and PostgreSQL example
  applications.

[Unreleased]: https://github.com/mutaimwiti/rbactl/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/mutaimwiti/rbactl/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mutaimwiti/rbactl/releases/tag/v0.1.0
