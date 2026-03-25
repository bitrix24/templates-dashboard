# Nuxt Dashboard Template

[![Bitrix24 UI](https://img.shields.io/badge/Made%20with-Bitrix24%20UI-2fc6f6?logo=bitrix24&labelColor=020420)](https://bitrix24.github.io/b24ui/)

Get started with the Nuxt dashboard template with multiple pages, collapsible sidebar, keyboard shortcuts, light & dark mode, command palette and more, powered by [Bitrix24 UI](https://bitrix24.github.io/b24ui/).

- [Live Demo](https://bitrix24.github.io/templates-dashboard/)
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

> [!NOTE]
> The idea is that this template can be used as a full-fledged Bitrix24 application. And without connecting to Bitrix24, it can display test data.
> As soon as we do this, we'll add instructions here.

# As B24 App

A browser-based application for Bitrix24.

## Required Scopes
The following permissions must be enabled in the application settings:
* `crm` — access to CRM entities.
* `user_brief` — access to basic user profile data.

## Configuration
When registering the application in the Bitrix24 Partner Portal or as a local app, use the following endpoints:


| Parameter | URL |
| :--- | :--- |
| **Application URL** | `https://your-app.example.com` |
| **Installation URL** | `https://your-app.example.com/install` |

## Getting Started
1. Open your **Bitrix24 account**.
2. Go to **Applications** -> **Add Application**.
3. Select **Local Application**
4. Fill in the URLs provided above and check the required **Scopes**.
5. Click **Save** and open the app.

# Translate

```
pnpm run translate-ui
```
