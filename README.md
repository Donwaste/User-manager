# USER MANAGER — React + TypeScript SPA (Study Project)

A single-page application built with React, TypeScript, and Vite. It features a user directory with profession-based filtering, multi-column sorting, live search, client-side pagination, bookmarks, comments, user registration/login with real-time validation, and a full profile editor.

**Live demo:** [user-manager-lyart-eta.vercel.app](https://user-manager-lyart-eta.vercel.app)

## Demo goals

- Practice component decomposition and props-driven architecture
- Migrate an existing JavaScript codebase to strict TypeScript, end to end
- Implement reusable, generic components (`Table`, `Pagination`, `GroupList`) typed with generics
- Build a custom, generic validation engine without third-party form libraries
- Simulate an async data layer with a typed fake API (`localStorage`-backed)

## Tech stack

- React 19 (Hooks, StrictMode)
- TypeScript
- React Router v7 (nested routing, dynamic segments)
- Vite (HMR, ES Modules)
- React Select (multi-select qualities picker)
- Axios (HTTP client, wrapped in `services/http.service.js`)
- Yup, React Toastify (installed, not yet wired into the validation flow)
- Bootstrap 5 + Bootstrap Icons
- Lodash / lodash-es (ordering, deep get, ranges)

## Project structure

```text
src/
  api/                            # Data layer (typed, localStorage-backed mocks)
    fake.api/
      user.api.ts                  # Users CRUD (fetchAll, getById, update)
      comments.api.ts              # Comments CRUD (fetchAll, fetchCommentsForUser, add, remove)
      professions.api.ts           # Professions reference data
      qualities.api.ts             # Qualities reference data
    index.ts                       # API facade { users, comments, professions, qualities }
  services/
    http.service.js                 # Axios wrapper (not yet migrated to TS)
  types/                           # Shared domain types
    user.ts                        # UserType
    comment.ts                     # CommentType
    profession.ts                  # ProfessionType
    quality.ts                     # QualityType
    qualityOption.ts               # QualityOption (react-select-friendly shape)
    optionType.ts                  # OptionType — generic {name, value} shape,
                                    # covers profession/gender options
    sortBy.ts                      # SortBy (table sort state)
    column.ts                      # ColumnDefinition (table column config)
    index.ts                       # Barrel re-exporting all of the above
  layouts/                         # Page-level layout components
    main.tsx
    login.tsx
    users.tsx                      # Users router: list vs. detail vs. edit view
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
      comments.tsx                  # Comment thread container for a user page
      qualities/                    # Badge list for user qualities
        qualitiesList.tsx
        quality.tsx
    common/                        # Generic reusable components
      backButton.tsx
      bookMark.tsx
      groupList.tsx                 # Generic<T>, works with any {valueProperty, contentProperty}
      pagination.tsx
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
  app.tsx                           # Route declarations + NavBar
  index.tsx                         # React root, BrowserRouter, StrictMode
```

## Features

- **User Directory:** Full user list loaded from a typed fake async API with a simulated delay
- **Profession Filter:** Sidebar `GroupList` filters users by profession; clears automatically when search is active
- **Live Search:** Real-time name filtering; resets profession filter and jumps to page 1
- **Sorting:** Click any column header to sort ascending/descending; arrow icons reflect current state
- **Pagination:** 8 users per page; hides automatically when only one page exists
- **Bookmarks:** Toggle per-user bookmark with a heart icon, state kept in memory
- **User Detail:** Individual page at `/users/:userId` with name, profession, qualities, stats, comment thread, and a Back button
- **Comments:** Add and remove comments on a user's profile, sorted by date, with per-comment author lookup
- **Profile Editor:** `/users/:userId/edit` — update name, email, profession, gender, and qualities through typed select/radio/multiselect fields
- **Registration Form:** Email, password, profession, gender, qualities, and license acceptance, all validated live
- **Login Form:** Email + password fields with per-field inline error messages and a disabled submit until valid
- **Validation Engine:** Standalone, generic `validator<T>` utility supporting `isRequired`, `isEmail`, `isCapital`, `isContainDigit`, `min` — reused across the login, registration, and edit-profile forms
- **Password Toggle:** Show/hide password via eye icon in the `TextField` component

## UI states

- **Loading (list):** Renders `"Loading..."` while the fake API resolves
- **Empty results:** `SearchStatus` badge turns red and shows `"Nobody needs you"` when count is 0
- **Loading (detail/edit):** Renders a loading placeholder until user data arrives
- **Not found:** Handled explicitly where an entity lookup can return `undefined` (e.g. a user id that doesn't exist)

This pattern is applied consistently across all data-dependent views.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

Available routes:

- `http://localhost:5173/` — Home (placeholder)
- `http://localhost:5173/login` — Login form
- `http://localhost:5173/login/register` — Registration form (same `Login` layout, switched via the `:type?` param)
- `http://localhost:5173/users` — Users list with all controls
- `http://localhost:5173/users/:userId` — Individual user page (with comments)
- `http://localhost:5173/users/:userId/edit` — Profile editor

## Data layer (how the fake API works)

`api/index.ts` exposes a unified, typed `API` facade backed by `localStorage`:

```ts
import API from "./api";

// Fetch all users
API.users.fetchAll().then((users) => {
  /* UserType[] */
});

// Fetch single user by id — may not find a match
API.users.getById("67rdca3eeb7f6fgeed471815").then((user) => {
  /* UserType | undefined */
});

// Partially update a user
API.users.update(userId, { bookmark: true }); // Partial<UserType>

// Fetch comments for a specific user
API.comments.fetchCommentsForUser(userId).then((comments) => {
  /* CommentType[] */
});

// Add a comment (server assigns _id and created_at)
API.comments.add({ userId, pageId, content }); // Omit<CommentType, "_id" | "created_at">
```

Each mock method is annotated with an explicit `Promise<T>` return type, so every consumer gets full type inference without manual casting.

## Validation engine

`utils/validator.ts` is a pure, generic function — no React dependency, no external libraries:

```ts
const errors = validator<LoginFormData>(
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
// → Partial<Record<keyof LoginFormData, string>>
```

Because it's generic over `T`, the same engine validates the login form, the registration form, and the profile editor — each with a completely different shape — without any duplication.

## Key technical decisions

1. **Typed generic Table:** `TableBody` uses `_.get(item, column.path)` for nested property access and accepts an optional `component` render function per column for custom cells, described by a shared `ColumnDefinition` type
2. **Dual filter modes:** Search and profession filter are mutually exclusive — activating one clears the other, and both reset `currentPage` to 1 via a dedicated `useEffect`
3. **Reusable, generic `GroupList<T>`:** Accepts `valueProperty`/`contentProperty` as `keyof T`, making it usable for any categorized data, not just professions — misspelled property names are caught at compile time
4. **Generic `Paginate<T>` and `validator<T>`:** Both utilities are data-shape-agnostic by design, reused across users, forms, and (potentially) any future list/entity in the app
5. **Explicit `api` contracts:** Every fake API method declares its own `Promise<T>` return type (including `T | undefined` where a lookup can fail), so consuming components are forced to handle "not found" and "still loading" as distinct states rather than trusting untyped data
6. **Form field composition:** Each form field component (`TextField`, `SelectField`, `RadioField`, `MultiSelectField`, `CheckBoxField`) exposes a uniform `onChange: (target: { name: string; value: ... }) => void` contract, letting a single `handleChange` drive an entire form while still being type-checked per field

## License

MIT — free to use and modify.
