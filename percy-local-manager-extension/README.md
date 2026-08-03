# Percy Local Manager — Chrome Extension

A thin browser-state capture client for the Percy Local Manager Go backend.
This extension **never** talks to Percy CLI, never downloads Percy, never
handles Percy tokens, and never knows about builds beyond the opaque
`{ buildId, buildUrl }` result returned by the backend.

```
Chrome Extension → HTTP (localhost:4321) → Go Backend → Percy CLI → Percy Cloud
```

## Folder structure

```
src/
├── popup/          # Popup entry point (main.tsx, Popup.tsx, popup.css)
├── components/     # Presentational React components
├── hooks/          # Reusable hooks (connection status, queue, capture, finalize)
├── services/       # DOM capture (chrome.scripting) + backend API client
├── types/          # Shared TypeScript types
└── utils/          # Constants and small formatting helpers
```

## Setup

```bash
npm install
npm run build
```

This produces a `dist/` folder ready to load as an unpacked extension.

## Load into Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

## Changing the UI

| To change...                                              | Edit this file                                    |
|-------------------------------------------------------------|--------------------------------------------------|
| Colors, spacing, fonts, general look and feel                | `src/popup/popup.css`                             |
| Popup layout / which sections appear and in what order        | `src/popup/Popup.tsx`                             |
| Connection status text/indicator ("Backend Connected", etc.)  | `src/components/ConnectionStatus.tsx`             |
| Queue count display                                            | `src/components/QueueCount.tsx`                   |
| Capture Snapshot button, name input, "✓ Snapshot Saved"        | `src/components/CaptureSnapshotPanel.tsx`         |
| Finalize Build button, "Build Finished", "Open Percy Build"    | `src/components/FinalizeBuildPanel.tsx`           |
| Popup title, page `<head>`                                     | `index.html`                                      |
| Extension icon images                                           | `public/icons/icon16.png`, `icon48.png`, `icon128.png` |
| Extension name/description shown in Chrome                     | `public/manifest.json`                            |

None of these files touch `src/services/` or `src/hooks/` — those hold the
backend communication and capture logic, so UI changes here won't affect how
the extension talks to the Go backend.

## Backend contract

The extension assumes a Go backend running at `http://localhost:4321` with:

- `POST /snapshots` — `{ name, url, dom, viewportWidth, viewportHeight }`
- `GET /snapshots` — returns an array, used for the queue count
- `DELETE /snapshots`
- `POST /build/finalize` — returns `{ buildId, buildUrl }`
- `GET /health` — used for the connection status indicator

## What this extension does NOT do

- No Percy CLI invocation
- No Percy binary download
- No Percy token handling
- No build lifecycle logic (starting/stopping Percy, upload sequencing)

All of that is the Go backend's responsibility. The extension only captures
`document.documentElement.outerHTML`, the active tab's URL, and the viewport
size, then POSTs it — and later asks the backend to finalize.