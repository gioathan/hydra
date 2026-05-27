# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start Expo dev server (scan QR with Expo Go or physical device)
npx expo start

# Run on Android (requires connected device or emulator)
npm run android

# Run on iOS
npm run ios

# Generate placeholder image assets (required before first run)
npm run generate-placeholders
```

There is no test suite or linter configured. TypeScript is checked via the compiler (`tsc`) but not run as part of any script.

## Environment

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_URL=http://<your-local-IP>:8080/api/v1
```

`localhost` will not work on a physical device — use your machine's LAN IP. The app warns in `__DEV__` mode if this is unset.

## Architecture

### Navigation (expo-router file-based)

The router has two top-level groups:
- `app/(auth)/` — unauthenticated screens (splash/onboarding, login, register, forgot/reset password, email verification)
- `app/(app)/` — authenticated screens, guarded by `app/(app)/_layout.tsx` which redirects to `/(auth)` when `isRehydrated && !token`

Inside `(app)`, a tab bar (`(tabs)/`) contains three tabs: **Discover** (home), **Bookings**, and **Profile**. Venue detail and booking flow live outside the tab group at `(app)/venues/[id]/` as a nested stack: `index → slots → confirm → success`. The `rate` screen in the same folder handles post-visit ratings.

### Auth & Session

Auth state is split across two layers:
1. **Zustand** (`lib/store/authStore.ts`) — in-memory, holds `token`, `user`, `customerId`, and `isRehydrated`.
2. **SecureStore** (`lib/secureStore.ts`) — persists token, user JSON, `customerId`, push token, and a `pendingUserId` used during email verification.

On app launch, `AuthRehydrator` in the root layout reads from SecureStore and calls `setAuth()`. The `isRehydrated` flag prevents a redirect flash before the async read completes.

### API Layer

`lib/api.ts` exports a single `apiClient` (Axios instance). It:
- Reads `EXPO_PUBLIC_API_URL` from env (fallback: `localhost:8080/api/v1`)
- Attaches JWT `Authorization: Bearer <token>` from SecureStore on every request
- On 401 (except `/auth/login`): clears Zustand auth, wipes SecureStore, and redirects to `/(auth)`

Resource functions live in `lib/api/<resource>.ts` and are imported directly by screen components. TanStack Query (`@tanstack/react-query`) wraps all reads; the QueryClient is created once in the root layout with `staleTime: 2 min`, `retry: 1`.

### Data Flow Pattern

Screens use `useQuery` / `useInfiniteQuery` for reads and `useMutation` for writes. The home screen (`(tabs)/index.tsx`) demonstrates the full pattern: infinite-scroll venue list filtered by type, search (debounced 400 ms), and location. Location is persisted to SecureStore and shown as a modal picker on first launch.

### Notifications

`lib/notifications.ts` lazy-requires `expo-notifications` (not available in Expo Go). `registerForPushNotifications` is called after login; `unregisterPushNotifications` on sign-out. Push token is stored both in SecureStore and synced to the backend via `lib/api/customers.ts`. Notification taps route to `/(app)/bookings/[id]` or `/(app)/venues/[id]/rate` based on the `type` field in the notification payload.

### Design System

- **Colors**: `constants/colors.ts` exports `Colors`. Use the semantic tokens (`Colors.primary`, `Colors.secondary`, `Colors.surface`, etc.) rather than the legacy aliases (`Colors.navy`, `Colors.terracotta`). The legacy aliases exist only for backward compatibility with older components.
- **Typography**: `constants/typography.ts` exports `T`. Fonts are **NotoSerif_700Bold** (display/headings) and **Plus Jakarta Sans** 400/600/700 (body/labels/buttons). All fonts are loaded in the root layout; never assume they are available before `fontsLoaded` resolves.
- There is no third-party UI library. All components are hand-written in `components/`.

### Types

All API DTOs and request/response shapes are in `types/index.ts`. When the backend contract changes, update types here first.
