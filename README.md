# Personal Blog

Monorepo chứa frontend blog và Payload CMS.

## Structure

```
blog/
├── packages/
│   ├── frontend/    # Vite + Vanilla JS
│   └── cms/         # Payload CMS + Next.js
├── DEPLOYMENT.md    # Hướng dẫn deploy Vercel
```

## Scripts

| Command         | Description             |
| --------------- | ----------------------- |
| `pnpm dev`      | Run frontend dev server |
| `pnpm dev:cms`  | Run CMS dev server      |
| `pnpm dev:all`  | Run both in parallel    |
| `pnpm build`    | Build frontend          |
| `pnpm format`   | Format code (Prettier)  |
| `pnpm lint`     | Lint code (Biome)       |
| `pnpm lint:fix` | Lint + auto fix         |

## Tech Stack

- **Frontend:** Vite, Vanilla JS, Marked
- **CMS:** Payload CMS, Next.js, MongoDB Atlas
- **Tools:** Prettier, Biome, pnpm workspaces
- **Hosting:** Vercel

## Deployment

Xem [DEPLOYMENT.md](./DEPLOYMENT.md) để deploy lên Vercel.
