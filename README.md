# Static web application template

A static site that builds to `dist/` and deploys to GitHub Pages on every push to `main`. No framework is chosen yet.

## Files

| File | Purpose |
| --- | --- |
| `src/index.html` | Placeholder page. Replace it. |
| `scripts/build.mjs` | Writes the site to `dist/`, plus `dist/version.txt` (the commit being built). |
| `test/build.test.mjs` | One passing test; `npm test` runs everything in `test/`. |
| `.github/workflows/deploy.yml` | Tests, builds and publishes `dist/` to Pages. Turns Pages on the first time it runs. |
| `.crew.yaml` | How the crew sets up, tests, builds and releases this repository. |
| `.nvmrc` | The Node version used locally, in CI and in the crew's sandbox. |

## For the crew

- **Pick a framework from the request.** The first ticket should choose whatever fits what the user asked for (plain HTML and CSS, Vite with React, Astro, and so on) and set it up.
- **Do not edit `.crew.yaml`** to do that. Its hooks call `npm test` and `npm run build`, so change the `scripts` in `package.json` instead.
- **Keep the build writing to `dist/`** and keep it writing `dist/version.txt` with the output of `git rev-parse HEAD`. The `released` hook fetches that file from the live site to confirm a release is deployed.
- **If the app is served from a subpath**, remember Pages serves it at `/<repository name>/`; set the framework's base path accordingly.
- **Add a dependency** with `npm install <package>` and commit `package.json` and `package-lock.json`.
- **Write tests** as `*.test.mjs` files in `test/`, or switch `npm test` to the framework's runner.

## What the platform changes when it generates your repository

This template's own `.crew.yaml` releases by merge and tag, because the template is never deployed. When the platform generates a repository from it, the platform replaces the `release:` section and adds a `released` hook, so the generated repository deploys to Pages on every release:

```yaml
hooks:
  # What Pages serves right now: the commit the last deploy built, which
  # scripts/build.mjs writes to version.txt.
  released: |
    url="$(gh api repos/{owner}/{repo}/pages --jq .html_url)" && curl -fsS "${url%/}/version.txt"

release:
  # The release phase pushes main; deploy.yml publishes it to Pages.
  mode: ci_auto
  ci: { provider: github, ref: deploy.yml }
  versioning: auto
  versionFiles: [package.json]
  changelog: CHANGELOG.md
  verify:
    match: commit
    timeoutSeconds: 600
```

`deploy.yml` is skipped while the repository is a template (`github.event.repository.is_template`) and runs normally in a generated one.

## Where the app lives

After the first push to `main`, the Pages URL appears in the deploy run's summary and under Settings, Pages. It is `https://<owner>.github.io/<repository name>/`.
