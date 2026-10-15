# The Carlisle Kids website

Static family website hosted by GitHub Pages at https://thecarlislekids.com.
Pages publishes the root of the `master` branch. Keep `CNAME` unchanged.

## Decimal Drop

Play at **https://thecarlislekids.com/decimaldrop/**, also linked from the home page.

- Editable React/TypeScript app: `apps/decimaldrop/`
- Published static build: `decimaldrop/` (committed so the existing Pages deployment can serve it)

To develop:

```sh
cd apps/decimaldrop
pnpm install --frozen-lockfile
pnpm dev
```

Before publishing changes to the app:

```sh
cd apps/decimaldrop
pnpm test
pnpm build:pages
```

Commit **both** the source changes and regenerated `decimaldrop/` files, then merge to `master`.
The Pages build uses `/decimaldrop/` as its asset base; the development server still uses `/`.
For a local production-path check, serve the repository root with `python3 -m http.server 8080`
and open `http://127.0.0.1:8080/decimaldrop/`.

Run the app's browser tests against that static server with:

```sh
cd apps/decimaldrop
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8080/decimaldrop/ pnpm test:e2e
```

Progress stays in the browser. To transfer existing progress from the original local app,
use **Export** there and **Import** on the live site.
Localhost and the live domain have separate browser storage. See the app README for details.
