# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Changed

- Reworked the MongoDB and PostgreSQL example test suites: database
  connections are created and closed separately, a global setup clears the
  database before runs, and shared test utilities are grouped on their own.

## [0.1.0] - 2019-08-13

### Added

- Initial release: role-based access control for Express apps — permissions,
  policies, and an `authorize` middleware, with MongoDB and PostgreSQL example
  applications.

[Unreleased]: https://github.com/mutaimwiti/rbactl/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/mutaimwiti/rbactl/releases/tag/v0.1.0
