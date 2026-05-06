# Hydra — Booking App

React Native / Expo app for booking restaurants, cafes, bars, and boat services on the island of Hydra, Greece.

## Stack

| Layer | Library |
|---|---|
| Framework | React Native + Expo SDK 51 |
| Navigation | expo-router (file-based) |
| State | zustand (auth) + TanStack Query v5 (server) |
| HTTP | axios |
| Storage | expo-secure-store |
| Notifications | expo-notifications |
| Date utils | date-fns |

## Getting started

```bash
cd hydra
npm install
```

Add your local `.env` (already exists, edit API URL if needed):
```
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Add the required static image assets to `assets/images/`:
- `splash.png` — hero background image for the onboarding screen
- `logo.png` — Hydra wordmark

Run the app:
```bash
npx expo start
```

## Project layout

```
app/
  _layout.tsx              Root Stack + QueryClient + auth rehydration
  (auth)/
    index.tsx              Splash / Onboarding
    login.tsx
    register.tsx
  (app)/
    _layout.tsx            Tab bar (Discover / Bookings / Profile)
    index.tsx              Home – venue list + filter chips
    bookings/
      index.tsx            My Bookings (Upcoming | Past tabs)
      [id].tsx             Booking Detail + cancel flow
    venues/
      [id].tsx             Venue Detail + calendar + party size
      [id]/
        slots.tsx          Time slot picker
        confirm.tsx        Booking confirmation
        success.tsx        Success screen
    profile/
      index.tsx            Profile + sign-out
      edit.tsx             Edit name / phone / locale
      password.tsx         Change password

components/               Shared UI (no third-party UI lib)
constants/                Colors, Typography tokens
lib/
  api.ts                  Axios client (JWT interceptor, 401 redirect)
  api/                    Resource-scoped API functions
  store/authStore.ts      Zustand auth state
  notifications.ts        Push token registration / tap handler
  secureStore.ts          Typed SecureStore wrappers
  utils.ts                Date formatting, validation, error helpers
types/index.ts            Shared DTOs
```

## Design tokens

| Token | Hex |
|---|---|
| Navy (primary) | `#1B2B4B` |
| Terracotta (CTA) | `#C4622D` |
| Background | `#F8F5F0` |
| Card | `#FFFFFF` |

## Notes

- All times from the API are UTC ISO 8601. Displayed in device local time using `date-fns`.
- Venue images: use `photoUrl` from DTO when not null; otherwise render initials on navy background.
- User avatars: always initials on terracotta — no image uploads.
- Push notifications require a physical device (not simulator). Expo push token format: `ExponentPushToken[...]`.
- SecureStore keys: `hydra_token`, `hydra_user`, `hydra_customer_id`, `hydra_push_token`.
