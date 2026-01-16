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

### Profile management workspace
- `/[locale]/profile` renders the profile builder where members edit their display name, bio, photo, interests (máx. 3), and city preferences.
- `src/constants/profile.ts` defines the launch city list and the interest catalog referenced from the documentation.
- `src/hooks/use-profile-draft.ts` manages form state and submits directly to the backend API—no local cache is stored.

### Local development
```bash
npm install
npm run dev
```

The app boots at http://localhost:3000.

Create a `.env.local` file so the frontend can talk to the stubbed backend while you iterate locally:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

- `NEXT_PUBLIC_API_URL` must match the port exposed by `sam local start-api` (the automation script defaults to `4000` to avoid clashing with Next.js).
- Authentication flows use the Cognito emulator started by `pick-backend/scripts/local-smoke.sh`, so you can sign up and sign in locally without AWS credentials.

### Onboarding flow
- Landing header now links to `/{locale}/auth/sign-up` and `/{locale}/auth/sign-in`.
- Both forms call the backend `/auth/register` and `/auth/login` routes backed by `cognito-local` (auto-confirm is enabled in the local scripts so you can log in right after sign-up).
- `/{locale}/auth/recover` renders a temporary password reset screen that simulates the email handoff until the real Cognito credentials are configured.

### Quality
- `npm run lint` – run ESLint across the project.
- `npm run format` – check Prettier formatting.
- `npm run format:write` – apply Prettier fixes.

### Next steps
- Connect the main CTAs to your production signup flow once available.
- Layer additional landing modules (FAQs, sponsor highlights) and plug in analytics events.

### CI/CD
The `Frontend CI/CD` GitHub Actions workflow runs on pushes and pull requests targeting `main`. It lints, builds the Next.js app, and (on pushes) triggers an AWS Amplify release using the latest commit. Configure these repository secrets before enabling deployments:

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH_NAME` (typically `main`)
