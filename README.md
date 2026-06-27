# Nuxt Dashboard Template

[![Bitrix24 UI](https://img.shields.io/badge/Made%20with-Bitrix24%20UI-2fc6f6?logo=bitrix24&labelColor=020420)](https://bitrix24.github.io/b24ui/)

Kickstart your project with the Nuxt application template — packed with multi‑page support, a collapsible sidebar, keyboard shortcuts, light/dark themes, a command palette, and more, all powered by [Bitrix24 UI](https://bitrix24.github.io/b24ui/).

- [Live demo](https://bitrix24.github.io/templates-dashboard/)
- [@bitrix24/b24ui](https://bitrix24.github.io/b24ui/docs/getting-started/installation/vue/)
- [@bitrix24/b24icons](https://bitrix24.github.io/b24icons/)
- [@bitrix24/b24jssdk](https://bitrix24.github.io/b24jssdk/)

> The dashboard template for Vue is on https://github.com/bitrix24/templates-dashboard-vue.

## Quick Start

```bash [Terminal]
git clone https://github.com/bitrix24/templates-dashboard.git <project-name>
cd <project-name>
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

Then create your local environment file from the example and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NUXT_PUBLIC_SITE_URL` | for prod | Public URL of the application (e.g. `https://example.com`). |
| `NUXT_APP_BASE_URL` | for prod | Application base path (e.g. `/` or `/some-folder/`). |
| `NUXT_ALLOWED_HOSTS` | for tunnels | Comma-separated allowed hosts for the Vite dev server (needed for ngrok and similar tunnels). |

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Development without Bitrix24

This template works both as a full-fledged Bitrix24 application and standalone.
When it is launched outside of a Bitrix24 frame (e.g. plain `pnpm dev` in the
browser), the Bitrix24 frame fails to initialize and the dashboard automatically
falls back to generated test data. This lets you develop and preview the UI
without a Bitrix24 account.

# As B24 App

A browser-based application for Bitrix24.

## Required Scopes

The following permissions must be enabled in the application settings:
* `crm` — access to CRM entities.
* `user_brief` — access to basic user profile data.
* `tasks` — access to tasks.
* `entity` — access to storage entities.

## Configuration

When registering the application in the Bitrix24 Partner Portal or as a local app, use the following endpoints:

| Parameter | URL |
| :--- | :--- |
| **Application URL** | `https://your-app.example.com` |
| **Installation URL** | `https://your-app.example.com/install` |

## Getting Started

1. Open your **Bitrix24**.
2. Go to **Applications** -> **Add Application**
3. Select **Local Application**
4. Fill in the URLs provided above and check the required **Scopes**.
5. Click **Save** and open the app.
