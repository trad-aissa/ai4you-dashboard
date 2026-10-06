## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Quality checks

Run the full public quality suite with:

```
npm run test:quality
```

This runs Astro diagnostics, a production build, Playwright smoke/accessibility/link audits, and Lighthouse. Artifacts are written to `.cluster/quality/`.

The live admin CRUD journey is intentionally separate because it writes a uniquely named temporary Supabase row and removes it afterward:

```
BASE=https://www.ai4you.site \
ADMIN_TEST_EMAIL=... \
ADMIN_TEST_PASSWORD=... \
npm run test:admin
```

CI uses repository secrets named `ADMIN_TEST_EMAIL` and `ADMIN_TEST_PASSWORD`. Never commit their values or expose them to pull-request jobs.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
