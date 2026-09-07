# Releasing

Releases are automated with [changesets](https://github.com/changesets/changesets)
and GitHub Actions. Packages publish from CI — never from a laptop (except the
one-time bootstrap below).

> **Provenance is disabled while this repo is private.** npm provenance requires
> a public repo; enabling it on a private repo fails the publish. When the repo
> is made public, uncomment `NPM_CONFIG_PROVENANCE: "true"` in
> `.github/workflows/release.yml` to get verifiable package→source links.

## Day-to-day flow

1. In your PR, record what changed:
   ```bash
   npm run changeset
   ```
   Pick the affected packages and the semver bump (patch / minor / major), and
   write a one-line summary. Commit the generated file in `.changeset/`.

2. Merge your PR to `main`. The **Release** workflow opens (or updates) a
   **"Version Packages"** PR that bumps versions and updates `CHANGELOG.md`.

3. Merge the "Version Packages" PR. That triggers the workflow to **publish** the
   bumped packages to npm (with provenance).

That's it — no manual `npm publish`.

## One-time setup

- **`NPM_TOKEN`** repo secret: an npm **automation** token for the
  `@embedworkflow` scope (bypasses interactive 2FA in CI). Alternatively, set up
  npm **OIDC trusted publishing** and drop the token entirely.
- Packages are published `public` (set via `publishConfig.access` in each
  `package.json`).

## Bootstrap (first publish only)

The very first publish claims the package names. Done once, manually, by a
maintainer logged into npm with `@embedworkflow` access:

```bash
npm run build
npm publish -w @embedworkflow/embed-core   # publish core first
npm publish -w @embedworkflow/react
```

Everything after the bootstrap goes through the changesets flow above.

## Versioning

`0.x` while the API stabilizes — treat minor bumps as potentially breaking and
pin accordingly. Packages that share the core are versioned together.
