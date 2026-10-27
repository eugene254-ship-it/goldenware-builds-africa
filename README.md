# Goldenware Website

A modern, responsive landing page for **Goldenware Enterprises Ltd**, presenting an infrastructure-stewardship vision focused on resilient construction, water systems, and locally grounded production across Africa.

> **Positioning:** A steward of how Africa is built next.

## Overview

The page introduces Goldenware through a dark, editorial visual system with subtle entrance animation, four value pillars, a statement of mandate, target use cases, and calls to action for prospective partners.

### Page Sections

- **Hero** — Brand statement with partner and charter calls to action.
- **Trust Signal** — Company context: since 2013, Kenya, infrastructure stewardship.
- **Value Pillars** — Material stewardship, water infrastructure, long-term resilience, and local sovereignty.
- **Our Mandate** — The principles behind the company's approach.
- **Where We Build** — Urban housing and water, county infrastructure, and off-grid or climate-zone projects.
- **Closing CTA and Footer** — Invitation to start a conversation and a dynamic copyright year.

## Built With

- **React** — Component-based UI.
- **Tailwind CSS** — Responsive layout and styling.
- **Framer Motion** — Hero entrance animation.
- **Lucide React** — Interface icons.
- **shadcn/ui-style components** — `Button`, `Card`, and `CardContent` imported from the project's UI component library.

## Getting Started

This component expects an existing React application with Tailwind CSS configured and the `@` import alias mapped to your source directory.

### 1. Install Dependencies

```bash
npm install framer-motion lucide-react
```

If your project does not already include the UI components, install or generate the equivalent `Button` and `Card` components using your chosen component-library setup. Configure Tailwind CSS and the `@` path alias as well.

### 2. Add the Component

Save the page as `GoldenwareWebsite.jsx` or `GoldenwareWebsite.tsx` in your app's source directory, then render it from the relevant route or page.

Example:

```jsx
import GoldenwareWebsite from "./GoldenwareWebsite";

export default function App() {
  return <GoldenwareWebsite />;
}
```

Adjust the import path to match your project structure.

### 3. Run the App

Use the development command supplied by your app framework. For a typical Vite project:

```bash
npm run dev
```

## Analytics

The component includes a small `track(event, props)` helper. It sends events to whichever of these globals are present:

- `window.plausible` — Plausible Analytics.
- `window.gtag` — Google Analytics via `gtag.js`.

### Tracked Events

| Event | Trigger | Properties |
|---|---|---|
| `cta_partner_click` | “Partner With Us” in the hero | `location: "hero"` |
| `view_charter_click` | “View Our Charter” in the hero | `location: "hero"` |
| `cta_start_conversation` | “Start a Conversation” in the closing CTA | `location: "footer_cta"` |

Add and configure your analytics provider's script before expecting events to appear in its dashboard. The current code does **not** implement a PostHog call, despite the original inline comment describing the helper as PostHog-compatible.

## Before Launch

- **Connect the calls to action.** The buttons currently emit analytics events only. Add the relevant routes, external URLs, email link, or contact form so they perform the expected action.
- **Confirm the charter destination.** The “View Our Charter” button does not currently open a charter document or page.
- **Verify company claims.** Confirm the “Since 2013” statement and the legal company name before publishing.
- **Add real contact details.** Provide an email address, phone number, or contact page so visitors can follow through.
- **Check accessibility.** Test keyboard focus, contrast, semantic heading order, reduced-motion preferences, and screen-reader behavior.
- **Review responsive behavior.** Test narrow mobile widths, tablet layouts, and large desktop displays.
- **Add production metadata.** Include a page title, meta description, social-sharing image, favicon, and appropriate SEO metadata in the app framework.

## Implementation Notes

- Keep one `GoldenwareWebsite` component definition in the codebase. The supplied snippet repeats the same component several times; those copies should not be pasted into the same module because they redeclare the same default export.
- JSX section comments should use the valid form, for example `{/* HERO */}`, rather than `{/ HERO /}`.
- The footer uses `new Date().getFullYear()` so the copyright year updates automatically.
- The current landing page is a frontend presentation. It does not include backend services, form submission, user authentication, or a content-management system.

## Project Status

**Landing-page prototype.** The main visual sections and click-event hooks are present; production navigation, contact workflows, analytics-provider setup, and final content verification remain to be completed.

## License

Add the license appropriate for this project before making the repository public. Do not assume the project is open source unless you intend to grant those rights.
