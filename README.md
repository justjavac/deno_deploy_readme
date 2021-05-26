# Deno Deploy Readme

> Handle GitHub Readme for Deno Deploy.

## Deploy the code

1. Click on the button below and you'll be navigated to Deno Deploy.

    [![](./assets/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/justjavac/deno_deploy_readme/mian/mod.ts&env=GITHUB_REPO,GITHUB_BRANCH)

1. Input `GITHUB_REPO` and `GITHUB_BRANCH` env variable field. If `GITHUB_BRANCH` is not set, the default branch is `main`.

1. Click on `Create` to create the project, then on `Deploy` to deploy the script.

1. Grab the URL that's displayed under `Domains` in Production Deployment card.

## Local Dev

Run on local:

```bash
$ LOCAL=true deployctl run --watch --no-check mod.ts
```

## License

[Deno Deploy Readme](https://github.com/justjavac/deno_deploy_readme) is released under the MIT License. See the bundled [LICENSE](./LICENSE) file for details.