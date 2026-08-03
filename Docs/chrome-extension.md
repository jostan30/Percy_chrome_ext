Chrome Extension

Responsibility

Capture browser state only.

It does NOT manage Percy or configuration.

Components

Popup

Background Service Worker

Content Script

Flow

User clicks Capture → Content Script reads: - DOM - URL - Viewport -Snapshot Name

Background sends POST /snapshot to the Go backend.

Backend APIs Used

GET /health

GET /status

POST /snapshot