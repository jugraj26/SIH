# AgriPrice Intel — Organized React Version

The original 1437-line JSX dashboard has been split into smaller files without changing the core UI/features. The original source contains dashboard, forecast, transport, weather, buffer stock, procurement, alerts, reports, settings and Ask AI functionality.

## Structure

- `src/App.jsx` — main app + global state
- `src/theme/theme.js` — colors, risk levels, font URL
- `src/data/constants.js` — commodities, states, navigation, default form
- `src/utils/helpers.js` — calculations, formatting, mock-data helpers
- `src/components/UI.jsx` — reusable Card/Button/Input/Badge components
- `src/components/Layout.jsx` — Sidebar + Topbar
- `src/pages/` — one file per dashboard page

## Install dependencies

```bash
npm install lucide-react recharts xlsx
```

Keep your existing Tailwind setup because the UI uses Tailwind utility classes.
