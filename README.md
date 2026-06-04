# Castalia Chess

Static GitHub Pages site for `chess.castalia.institute`.

The site fetches the Lichess daily puzzle from:

```text
https://lichess.org/api/puzzle/daily
```

It renders the FEN board client-side, highlights the last move, and reveals the solution on demand. A local fallback puzzle is bundled so the page still works if the Lichess request fails.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

The `.github/workflows/pages.yml` workflow deploys the static files from this repository to GitHub Pages.

The custom domain is configured in `CNAME`:

```text
chess.castalia.institute
```

The default GitHub Pages URL is:

```text
https://castaliainstitute.github.io/chess/
```

## Cloudflare Pages

The site is also deployed as a Cloudflare Pages project named `chess`.

```bash
env -u CLOUDFLARE_ACCOUNT_ID wrangler pages deploy . --project-name chess --branch main
```

The custom domain `chess.castalia.institute` is attached to the Cloudflare Pages project. Cloudflare currently requires this DNS record in the `castalia.institute` zone:

```text
Type: CNAME
Name: chess
Target: chess-a5o.pages.dev
Proxy: enabled or DNS-only
```

The local environment has a `CLOUDFLARE_ACCOUNT_ID` for another account, so unset it when using Wrangler for this project.
