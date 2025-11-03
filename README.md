## Pick Frontend

Next.js frontend for Pick — the interest-first matchmaking platform that orchestrates meaningful one-to-one introductions across Colombian cities.

### Tech stack
- Next.js 16 (App Router, TypeScript)
- Material UI 7 with a custom theme defined in `src/theme/theme.ts`
- Emotion SSR integration via `ThemeRegistry` to keep styles consistent between server and client
- Brand fonts served through `next/font` (`Sora` for headings, `Inter` for body copy)

### Project structure
- `src/app` – Route segments using the App Router. `/[locale]/page.tsx` renders the landing by locale (`/es` default, `/en` optional).
- `src/sections/landing` – Landing page sections (hero, journey, social proof, highlights).
- `src/components/navigation` – Shared layout elements such as the landing header.
- `src/theme` – Shared theme and providers.
- `src/i18n` – Dictionaries and helpers for locale-based copy.
- `public` – Static assets (favicons, images).

### Local development
```bash
npm install
npm run dev
```

The app boots at http://localhost:3000.

### Quality
```bash
npm run lint
```

### Next steps
- Connect the main CTAs to your production signup flow once available.
- Layer additional landing modules (FAQs, pricing readiness) and plug in analytics events.
