# Vercel deployment guide

This project is a monorepo with two main folders:

- `front/`: React + Vite frontend.
- `back/`: Express + Prisma backend.

## Why Vercel can show `Root Directory "front" does not exist`

That message happens before the build command runs. It means Vercel cloned a Git commit and then tried to enter the Root Directory configured in the Vercel dashboard, but that folder was not present in that specific commit.

In other words, this is not a React Router error and it is not caused by the SPA rewrite. It is a project configuration / Git commit visibility problem.

## Recommended frontend deployment from the repository root

Use this option when the Vercel project is connected to the root of this repository.

1. In Vercel, open the project settings.
2. Go to **Settings → General → Root Directory**.
3. Leave **Root Directory** empty, or set it to the repository root.
4. Let Vercel use the root `vercel.json` file.

The root `vercel.json` installs dependencies inside `front/`, builds the Vite app, publishes `front/dist`, and rewrites all frontend routes to `index.html` so React Router can handle them in the browser.

## Alternative frontend deployment from `front/`

Use this option only if the selected Git commit definitely contains the `front/` folder.

1. In Vercel, open the project settings.
2. Go to **Settings → General → Root Directory**.
3. Set **Root Directory** to `front`.
4. Redeploy from a branch/commit where `front/package.json` exists.

With this option, Vercel reads `front/vercel.json`, runs `npm run build`, publishes `dist`, and uses the same SPA rewrite.

## Quick debugging checklist

If Vercel says `Root Directory "front" does not exist`, check these items in order:

1. Confirm the deployment branch is the branch you expect.
2. Confirm the commit shown in the Vercel logs contains the `front/` directory.
3. In GitHub, open that exact commit and verify `front/package.json` is visible.
4. If `front/` is not visible in that commit, push the latest branch or deploy from the repository root instead.
5. If `front/` is visible but Vercel still fails, disconnect/reconnect the Git project or clear the Root Directory setting and redeploy.

## How to think about the original 404

A Vite app produces static files in `dist/`. The server knows about files like `index.html`, but it does not know about client-side routes like `/dashboard`, `/entries/123`, or `/login`.

React Router resolves those routes after `index.html` loads in the browser. For that reason, Vercel needs a rewrite from every frontend path to `/index.html`.
