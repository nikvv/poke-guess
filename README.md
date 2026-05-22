# PokeGuess

Identify Pokemon from their silhouettes. A fast-paced guessing game built with React, Vite, and Tailwind CSS.

**Play it:** [poke-guess.pages.dev](https://poke-guess.pages.dev)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Stack

- React, Vite, Tailwind CSS, Zustand
- PokeAPI (data), D1 (leaderboard)
- Cloudflare Pages (hosting)

## Data

Pokemon data (id, name, types) is bundled at build time via a fetch script:

```bash
node scripts/generatePokemonData.mjs
```
