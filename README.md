# USER MANAGER — React + TypeScript + Redux Toolkit + Firebase SPA (Study Project)

A single-page application built with React, TypeScript, Redux Toolkit, and Vite, backed by Firebase (Realtime Database + Authentication REST API). It features real user registration and login with token refresh, protected routes, a user directory with profession-based filtering, multi-column sorting, live search, client-side pagination, persistent bookmarks, comments, a full profile editor, and an admin panel for resetting the database.

**Live demo:** [user-manager-lyart-eta.vercel.app](https://user-manager-lyart-eta.vercel.app)

## Planned (not implemented yet)

- Dark theme with a toggle in the navbar, remembered between visits
- Guest account: try the app with one click, no registration required
- Later: change email and password from the profile editor (requires re-authentication, so postponed)

## Tech stack

- React 19 (Hooks, StrictMode)
- TypeScript
- Redux Toolkit + React Redux (typed `useAppDispatch` / `useAppSelector`)
- React Router v7 (nested routing, dynamic and optional segments, route guards)
- Vite 7 (HMR, ES Modules, `import.meta.env`)
- Firebase Realtime Database and Firebase Auth (accessed over REST, no Firebase SDK)
- Axios (three instances: data, auth, token refresh)
- React Select (multi-select qualities picker)
- React Toastify (global error notifications)
- nanoid (comment id generation)
- Vitest + axios-mock-adapter (HTTP layer tests)
- ESLint 9 (flat config, React, React Hooks, React Refresh plugins)
- Yup (installed as an optional alternative to the custom validator, not wired in)
- Bootstrap 5
- Lodash (ordering, deep get)

## Project structure

```text
public/                             # Static assets
index.html                          # Vite entry HTML
vite.config.js                      # Vite config
tsconfig.json                       # TypeScript config
eslint.config.js                    # ESLint flat config
vercel.json                         # Vercel deployment config
database.rules.json                 # Firebase Realtime Database security rules
.env                                # Local env vars (VITE_FIREBASE_KEY, VITE_ADMIN_ID), not committed
src/
  api/                            # Seed data (used to populate/reset the database)
    fake.api/
      user.api.ts                  # Default users
      comments.api.ts              # Default comments
      professions.api.ts           # Professions reference data
      qualities.api.ts             # Qualities reference data
    index.ts                       # API facade { users, comments, professions, qualities }
  services/                        # HTTP layer, one service per resource
    http.service.ts                 # Axios instances + interceptors (token refresh, Firebase
                                    # normalization, error toasts)
    http.service.test.ts            # Vitest suite for the interceptors
    auth.service.ts                 # Firebase Auth: signUp, signInWithPassword
    local.storage.services.ts       # Token/session storage (localStorage vs sessionStorage)
    user.service.ts                 # Users: get, create, getCurrentUser, update
    comment.service.ts              # Comments: get by page, create, remove
    profession.service.ts           # Professions: get
    quality.service.ts              # Qualities: get
    admin.service.ts                # Database reset
  store/                           # Redux Toolkit slices, thunks, and selectors
    store.ts                       # configureStore, RootState, AppDispatch
    hooks.ts                       # Typed useAppDispatch / useAppSelector
    users.ts                       # Entities, auth state, login/signUp/logOut/updateUser
    comments.ts                    # Comments for the opened user page
    professions.ts                 # Cached reference data
    qualities.ts                   # Cached reference data
  types/                           # Shared domain types
    user.ts                        # UserType
    comment.ts                     # CommentType
    profession.ts                  # ProfessionType
    quality.ts                     # QualityType
    qualityOption.ts               # QualityOption (react-select-friendly shape)
    optionType.ts                  # OptionType — generic {name, value} shape
    authData.ts                    # Credentials, SignUpData
    providerProps.ts               # ProviderProps (children wrapper)
    sortBy.ts                      # SortBy (table sort state)
    column.ts                      # ColumnDefinition (table column config)
    index.ts                       # Barrel re-exporting all of the above
  layouts/                         # Page-level layout components
    main.tsx
    login.tsx                      # Login / register, switched via the :type? param
    logOut.tsx                     # Clears session and redirects
    users.tsx                      # Users router: list vs. detail vs. edit view
    adminPanel.tsx                 # Database reset with confirmation modal
  components/
    ui/                            # Domain-specific UI components
      navBar.tsx
      loginForm.tsx
      registerForm.tsx
      userCard.tsx
      userTable.tsx
      searchStatus.tsx
      meetingsCard.tsx
      qualitiesCard.tsx
      profession.tsx                # Resolves a profession name by id from the store
      comments.tsx                  # Comment thread container for a user page
      hoc/
        appLoader.tsx               # Bootstraps reference data and session before rendering
      qualities/                    # Badge list for user qualities + nav profile dropdown
        qualitiesList.tsx
        quality.tsx
        navProfile.tsx
    common/                        # Generic reusable components
      routeGuard.tsx                # Auth / guest-only / admin-only route wrapper
      backButton.tsx
      bookMark.tsx
      groupList.tsx                 # Generic<T>, works with any {valueProperty, contentProperty}
      pagination.tsx
      spinner.tsx                   # Shared loading spinner
      comments/                     # Comment list + single comment + add-comment form
        addCommentForm.tsx
        comment.tsx
        commentsList.tsx
      table/                        # Composable, typed table primitives
        table.tsx
        tableHeader.tsx
        tableBody.tsx
      form/                         # Typed form field components
        textField.tsx
        textAreaField.tsx
        selectField.tsx
        radioField.tsx
        multiSelectField.tsx
        checkBoxField.tsx
      page/
        usersListPage/
        userPage/
        editUserPage/                # Full profile editor with select/radio/multiselect
  utils/
    paginate.ts                     # Generic<T> page slicer
    validator.ts                    # Generic<T> rule-based validation engine
    displayDate.ts                  # Relative/absolute date formatting
    getErrorMessage.ts              # Normalizes Axios/Firebase/unknown errors to a string
    getRandomInt.ts                 # Random rate / meetings for new users
    isOutdated.ts                   # Cache TTL check for reference data
  configFile.json                   # Firebase endpoint and `isFireBase` switch
  app.tsx                           # Route declarations + NavBar + AppLoader
  index.tsx                         # React root, Redux Provider, BrowserRouter, StrictMode
```

Folders such as `common/comments`, `common/table`, `common/page/*` and `ui/qualities` also contain a small `index.ts` barrel that re-exports the folder's main component.

## Features

- **Authentication:** Sign up and sign in through the Firebase Auth REST API with live-validated forms and friendly error messages; an optional "stay on" mode keeps the session across browser restarts, and expired tokens are refreshed transparently
- **Route Guards:** Guests are redirected to `/login` and back to the page they came from, logged-in users can't open `/login`, and `/admin` is restricted to the admin account
- **User Directory:** Paginated list (8 per page) with live name search, profession filter, and sorting by any column, including bookmark state; the current user and the admin are excluded
- **Bookmarks:** Stored on the user's record in the database, so they persist across sessions and devices
- **User Detail:** Individual page at `/users/:userId` with profession, qualities, stats, and comment thread
- **Comments:** Add and remove comments on a user's profile, sorted by date
- **Profile Editor:** `/users/:userId/edit` — update name, email, profession, gender, and qualities; editing another user's profile redirects to your own
- **Admin Panel:** Admin-only page behind a confirmation modal that resets the database: deletes every user except the admin, clears all comments, and re-uploads the seed users (seed comments are not restored)
- **Validation Engine:** Standalone, generic `validator<T>` utility reused across the login, registration, and edit-profile forms

## UI states

- **App bootstrap:** `AppLoader` shows a spinner while the session user is being loaded; on failure it offers **Retry** or **Log Out**
- **Orphaned session:** If a token is valid but the user record no longer exists, a toast is shown and the user is logged out
- **Loading (list):** Shows a spinner while the users list resolves
- **Empty results:** `SearchStatus` badge turns red and shows `"Nobody needs you"` when count is 0, and the table is replaced with `"Nothing found"`
- **Loading (detail/edit):** Shows a spinner until user data arrives
- **Loading (comments):** Shows a spinner while the thread is fetched
- **Network errors:** A global toast is shown on connection loss or unexpected `5xx` errors; expected `4xx` errors are left to the form that triggered them

This pattern is applied consistently across all data-dependent views.

## Getting started

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_KEY=your_firebase_web_api_key
VITE_ADMIN_ID=firebase_uid_of_the_admin_user
```

Publish `database.rules.json` in the Firebase console (Realtime Database → Rules) and replace the admin uid in it with your own.

Point `src/configFile.json` at your own Firebase Realtime Database (`apiEndpoint`). Set `isFireBase` to `false` to talk to a plain REST backend without the `.json` suffix and response normalization.

Open `http://localhost:5173` in your browser.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # ESLint
npm test         # HTTP layer tests (Vitest)
```

Available routes:

- `http://localhost:5173/` — Home (placeholder, renders a bare "Main" heading)
- `http://localhost:5173/login` — Login form (guests only)
- `http://localhost:5173/login/register` — Registration form (same `Login` layout, switched via the `:type?` param)
- `http://localhost:5173/logout` — Clears the session and redirects home
- `http://localhost:5173/users` — Users list with all controls (auth required)
- `http://localhost:5173/users/:userId` — Individual user page (with comments)
- `http://localhost:5173/users/:userId/edit` — Profile editor (own profile only)
- `http://localhost:5173/admin` — Admin panel (admin only)

## Data layer (how the HTTP service works)

`services/http.service.ts` wraps three Axios instances and normalizes everything the rest of the app sees:

```ts
import userService from "./services/user.service";

// Fetch all users — Firebase's { id: {...} } dictionary becomes UserType[]
userService.get().then(({ content }) => {
  /* UserType[] */
});

// Update the current user (id taken from the stored session)
userService.update({ bookmarks: { [userId]: true } }); // Partial<UserType>

// Fetch comments for a user page
commentService.getComments(userId); // orderBy="pageId" & equalTo="<userId>"
```

The request interceptor appends `.json`, refreshes the token if it is about to expire, and attaches `auth=<idToken>`. The response interceptor converts Firebase collections to arrays with an injected `_id` and wraps every payload as `{ content }`.

Redux thunks sit on top of the services and keep requests out of components:

```ts
dispatch(loadUsersList());
dispatch(login({ email, password, stayOn }));
dispatch(createComment({ content, pageId }));
```

Reference data (`professions`, `qualities`) is cached in the store and refetched only when older than 10 seconds (`isOutdated`).

## Security rules

`database.rules.json` is the server-side counterpart of the client guards; the client checks are for UX, the rules are the actual enforcement:

| Path                                       | Read            | Write                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`                                    | signed-in users | own record, or the admin (the admin's own record can't be deleted)                                                                                                                                                                                                                                              |
| `users/$uid`                               | —               | requires `_id`, `email`, `name`; `_id` must equal the key; `email` must match the auth token (admin exempt); `name` 1–50 chars; `sex` is `male` / `female` / `other`; `profession` is a string; `license` is a boolean; `qualities` must be non-empty; `bookmarks` values are booleans; unknown fields rejected |
| `users/$uid` (`rate`, `completedMeetings`) | —               | `rate` is 0–5, `completedMeetings` ≥ 0; set freely when the record is created, afterwards changeable only by the admin                                                                                                                                                                                          |
| `comments`                                 | signed-in users | the author only (create, delete); bulk write is admin-only; `content` 1–1000 chars; indexed by `pageId`                                                                                                                                                                                                         |
| `professions`, `qualities`                 | public          | disabled                                                                                                                                                                                                                                                                                                        |

## Validation engine

`utils/validator.ts` is a pure, generic function — no React dependency, no external libraries:

```ts
const errors = validator<Credentials>(
  { email: "test", password: "weak" },
  {
    email: {
      isRequired: { message: "Email is required" },
      isEmail: { message: "Email address was entered incorrectly" },
    },
    password: {
      isCapital: { message: "Must contain at least one uppercase character" },
      isContainDigit: { message: "Must contain at least one number" },
      min: { message: "At least 8 characters", value: 8 },
    },
  },
);
// → Partial<Record<keyof Credentials, string>>
```

Because it's generic over `T`, the same engine validates the login form, the registration form, and the profile editor — each with a completely different shape — without any duplication.

## Key technical decisions

1. **Typed Table:** `TableBody` uses `_.get(item, column.path)` for nested property access and accepts an optional `component` render function per column for custom cells, described by a shared `ColumnDefinition` type (currently bound to `UserType`)
2. **Redux slices with a thunk-per-use-case pattern:** Each slice owns `entities`, `isLoading`, and `error`, and exposes selector factories (`getUserById`, `getProfessionById`, ...). Components stay declarative and never call services directly
3. **Single-flight token refresh:** `refreshAuthTokens` keeps one in-flight promise, so parallel requests that hit an expired token share one refresh call instead of racing. A failed refresh with a `4xx` clears the session and invokes a replaceable `onAuthFailure` handler
4. **Firebase adapter in interceptors, not in services:** Services stay backend-agnostic and always receive `{ content }`; the `isFireBase` flag in `configFile.json` toggles the adapter
5. **Reusable, generic `GroupList<T>`:** Accepts `valueProperty`/`contentProperty` as `keyof T`, making it usable for any categorized data, not just professions — misspelled property names are caught at compile time
6. **Generic `Paginate<T>` and `validator<T>`:** Both utilities are data-shape-agnostic by design, reused across users, forms, and (potentially) any future list/entity in the app
7. **Declarative route protection:** `RouteGuard` with `onlyForGuests` and `adminOnly` flags replaces per-page auth checks, and preserves the originally requested location in router state for post-login redirect
8. **Centralized error normalization:** `getErrorMessage` accepts `unknown` and maps Axios, Firebase, and plain errors to a user-facing string, so every `catch` block is type-safe under strict mode
9. **Form field composition:** Each form field component (`TextField`, `SelectField`, `RadioField`, `MultiSelectField`, `CheckBoxField`) exposes a uniform `onChange: (target: { name: string; value: ... }) => void` contract, letting a single `handleChange` drive an entire form while still being type-checked per field
10. **Rules as the source of truth:** Ownership, field shapes, and admin-only fields are enforced by Firebase rules rather than trusted from the client; the `$other` / `.validate: false` entries reject any unexpected fields
11. **Tested interceptors:** The Vitest suite mocks storage, toasts, and config, then verifies URL/auth decoration, Firebase normalization, error toasts, and the refresh-and-retry flow

## License

MIT — free to use and modify.
