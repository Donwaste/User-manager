# USER MANAGER — React SPA (Study Project)

A single-page application built with React and Vite. It features a user directory with profession-based filtering, multi-column sorting, live search, client-side pagination, bookmarks, and a login form with real-time validation.

**Live demo:** [user-manager-lyart-eta.vercel.app](https://user-manager-lyart-eta.vercel.app)

## Demo goals

- Practice component decomposition and props-driven architecture
- Implement reusable, generic UI components (Table, Pagination, GroupList)
- Build a custom validation engine without third-party form libraries
- Simulate async data layer with a fake API

## Tech stack

- React 18 (Hooks, StrictMode)
- React Router v6 (nested routing, dynamic segments)
- Vite (HMR, ES Modules)
- Bootstrap 5 + Bootstrap Icons
- Lodash (ordering, deep get)

## Project structure

```text
src/
  api/                        # Data layer
    fake.api/
      user.api.js             # Mock users with simulated async delay
      professions.api.js      # Mock professions with simulated async delay
    index.js                  # API facade { users, professions }
  layouts/                    # Page-level layout components
    main.jsx                  # Home page placeholder
    login.jsx                 # Login page wrapper
    users.jsx                 # Users router: list vs. detail view
  components/
    ui/                       # Domain-specific UI components
      navBar.jsx              # Top navigation with React Router links
      loginForm.jsx           # Login form with validation state
      userTable.jsx           # Configured table for users domain
      searchStatus.jsx        # Contextual "X people will hang out" badge
      qualities/              # Badge list for user qualities
        qualitiesList.jsx
        quality.jsx
        index.js
    common/                   # Generic reusable components
      bookMark.jsx            # Bookmark toggle button
      groupList.jsx           # Generic filterable list
      pagination.jsx          # Page-based navigation
      table/                  # Composable table primitives
        table.jsx             # Root table component
        tableHeader.jsx       # Sortable column headers
        tableBody.jsx         # Dynamic cell rendering with lodash.get
        index.js
      form/
        textField.jsx         # Input with label, error state, password toggle
      page/
        usersListPage/        # Full users list with all controls
          usersListPage.jsx
          index.js
        userPage/             # Individual user detail view
          userPage.jsx
          index.js
  utils/
    paginate.js               # Slice items array to current page
    validator.js              # Rule-based field validation engine
  app.jsx                     # Route declarations + NavBar
  index.jsx                   # React root, BrowserRouter, StrictMode
```

## Features

- **User Directory:** Full user list loaded from a fake async API with a 2-second simulated delay
- **Profession Filter:** Sidebar `GroupList` filters users by profession; clears automatically when search is active
- **Live Search:** Real-time name filtering; resets profession filter and jumps to page 1
- **Sorting:** Click any column header to sort ascending/descending; arrow icons reflect current state
- **Pagination:** 8 users per page; hides automatically when only one page exists
- **Bookmarks:** Toggle per-user bookmark with a heart icon, state kept in memory
- **User Detail:** Individual page at `/users/:userId` with name, profession, qualities, stats and a Back button
- **Login Form:** Email + password fields with per-field inline error messages and a disabled submit until valid
- **Validation Engine:** Standalone `Validator` utility supporting `isRequired`, `isEmail`, `isCapital`, `isContainDigit`, `min`
- **Password Toggle:** Show/hide password via eye icon in the `TextField` component

## UI states

- **Loading (list):** Renders `"Loading..."` string while the fake API resolves
- **Empty results:** `SearchStatus` badge turns red and shows `"Nobody needs you"` when count is 0
- **Loading (detail):** `UserPage` renders `<div>Loading...</div>` until user data arrives

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
- `http://localhost:5173/users` — Users list with all controls
- `http://localhost:5173/users/:userId` — Individual user page

## Data layer (how the fake API works)

`api/index.js` exposes a unified `API` facade:

```javascript
import API from "./api";

// Fetch all users (resolves after 2s)
API.users.fetchAll().then((users) => {
  /* [] */
});

// Fetch single user by id (resolves after 1s)
API.users.getById("67rdca3eeb7f6fgeed471815").then((user) => {
  /* {} */
});

// Fetch all professions (resolves after 2s)
API.professions.fetchAll().then((professions) => {
  /* [] */
});
```

Both `fetchAll` methods use `window.setTimeout` inside a `Promise` to simulate network latency, making it straightforward to swap in a real `fetch`/`axios` call later.

## Validation engine

`utils/validator.js` is a pure function — no React dependency, no external libraries:

```javascript
const errors = Validator({
  data: { email: "test", password: "weak" },
  config: {
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
});
// → { email: "...", password: "..." }
```

Returns an object of `{ fieldName: errorMessage }` pairs; empty object means all fields are valid.

## Key technical decisions

1. **Generic Table:** `TableBody` uses `_.get(item, column.path)` for nested property access and accepts a `component` render function per column for custom cells
2. **Dual filter modes:** Search and profession filter are mutually exclusive — activating one clears the other, and both reset `currentPage` to 1 via a dedicated `useEffect`
3. **Reusable GroupList:** Accepts `valueProperty` and `contentProperty` props, making it usable for any categorized data beyond professions
4. **Lodash ordering:** `_.orderBy` handles multi-key sort with direction — ready to extend to multi-column sorting
5. **TextField abstraction:** Password toggle and validation error display are encapsulated inside a single component, keeping form code clean

## License

MIT — free to use and modify.
