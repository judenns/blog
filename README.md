# Personal Blog

Monorepo chứa frontend blog và CMS.

## Structure

```
blog/
├── packages/
│   ├── frontend/    # Vite + vanilla JS
│   └── cms/         # Payload CMS (coming soon)
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run frontend dev server |
| `pnpm dev:cms` | Run CMS dev server |
| `pnpm dev:all` | Run both in parallel |
| `pnpm build` | Build frontend |
| `pnpm format` | Format code (Prettier) |
| `pnpm lint` | Lint code (Biome) |
| `pnpm lint:fix` | Lint + auto fix |

## Tech Stack

- **Frontend:** Vite, Vanilla JS, Marked (markdown)
- **CMS:** Payload CMS, MongoDB (coming soon)
- **Tools:** Prettier, Biome, pnpm workspaces
