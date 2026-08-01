# Percy Local Manager
### Product Requirements & Technical Design Document (v1.0)

---

# Overview

## Vision

Build a lightweight desktop application that completely abstracts away Percy server management for Manual QA Engineers.

The user should **never** have to:

- Install Node.js manually
- Run terminal commands
- Execute `npx percy`
- Configure environment variables
- Troubleshoot local servers

Instead, the experience should be:

> Install → Open App → Start Capturing Snapshots

The desktop application will automatically initialize, manage, monitor, and recover the Percy local server while exposing a simple local API for a custom Chrome Extension.

---

# Target Users

## Primary Users

Manual QA Engineers

Characteristics:

- Little or no programming knowledge
- Comfortable using desktop applications
- Uses Chrome daily
- Should never interact with CLI
- Needs one-click setup

---

# Goals

## Functional Goals

✓ Automatically start Percy

✓ Automatically restart Percy if it crashes

✓ Hide all CLI complexity

✓ Provide simple desktop interface

✓ Communicate with Chrome Extension

✓ Show connection status

✓ Store project configuration

✓ Auto start on OS boot (optional)

✓ Collect logs for debugging

---

## Non Functional Goals

- Lightweight
- Cross-platform
- Reliable
- Fast startup (<3 seconds)
- Small memory footprint
- Easy to maintain
- Easy to distribute

---

# High Level Architecture

```text
                    +---------------------+
                    | Chrome Extension    |
                    +----------+----------+
                               |
                         HTTP / WebSocket
                               |
                               |
+------------------------------------------------------+
|                Percy Desktop Manager                 |
|------------------------------------------------------|
|                                                      |
|  UI (Tauri)                                          |
|                                                      |
|  Settings                                             |
|  Logs                                                 |
|  Status                                               |
|                                                      |
+----------------------+-------------------------------+
                       |
                       | IPC
                       |
+----------------------v-------------------------------+
|                Go Background Service                 |
|------------------------------------------------------|
|                                                      |
| Process Manager                                      |
| Percy Controller                                     |
| Health Monitor                                       |
| Config Manager                                       |
| Log Manager                                          |
| Local HTTP Server                                    |
|                                                      |
+----------------------+-------------------------------+
                       |
                       |
                 spawn process
                       |
                       |
                 percy-cli server
                       |
                       |
                 Percy Cloud
```

---

# Technology Stack

## Desktop UI

Tauri

Reasons:

- Small executable
- Native performance
- Tray support
- Auto updater
- Installer generation
- Notifications

---

## Backend

Go

Reasons:

- Excellent process management
- Very lightweight
- Fast startup
- Cross-platform
- Built-in HTTP server
- Simple deployment

---

## Chrome Extension

React

TypeScript

Vite

Manifest V3

---

## Communication

HTTP over localhost

Future:

WebSockets

---

## Configuration

JSON

---

## Logging

Rolling log files

---

# Responsibilities

## Desktop Application

Responsible for

- User interface
- Settings
- Status
- Logs
- Auto updates
- Tray icon

Not responsible for

- Percy internals
- Snapshot logic

---

## Go Service

Responsible for

- Start Percy
- Stop Percy
- Restart Percy
- Health checks
- Configuration
- Local API
- Logging
- Process monitoring

---

## Chrome Extension

Responsible for

- Capture DOM
- Capture metadata
- Capture viewport
- Send snapshots

Nothing else.

No Percy logic.

No configuration.

No authentication.

---

# Project Structure

```text
percy-manager/

├── desktop/
│   ├── tauri/
│   ├── frontend/
│   └── assets/
│
├── backend/
│   ├── api/
│   ├── config/
│   ├── process/
│   ├── monitor/
│   ├── logs/
│   ├── percy/
│   └── main.go
│
├── extension/
│   ├── popup/
│   ├── background/
│   ├── content/
│   ├── services/
│   └── manifest.json
│
├── installer/
│
└── docs/
```

---

# Application Lifecycle

## Startup

```text
User launches app

↓

Load configuration

↓

Validate settings

↓

Start Go service

↓

Launch Percy

↓

Wait for health check

↓

Expose local API

↓

Status = READY

↓

Chrome Extension connects
```

---

## Shutdown

```text
Close desktop app

↓

Stop Go service

↓

Gracefully terminate Percy

↓

Save logs

↓

Exit
```

---

# Percy Process Management

## Start

```text
Read Config

↓

Set Environment Variables

↓

Spawn Percy

↓

Monitor stdout

↓

Monitor stderr

↓

Health check
```

---

## Crash Recovery

```text
Percy exits unexpectedly

↓

Detect exit

↓

Log reason

↓

Restart automatically

↓

Notify UI

↓

Update status
```

---

# Local API

Base URL

```
http://localhost:4321
```

---

## Health

GET

```
/health
```

Response

```json
{
    "status":"ready"
}
```

---

## Status

GET

```
/status
```

Response

```json
{
    "running":true,
    "percy":true,
    "version":"1.0.0"
}
```

---

## Start Percy

POST

```
/start
```

---

## Stop Percy

POST

```
/stop
```

---

## Restart Percy

POST

```
/restart
```

---

## Logs

GET

```
/logs
```

---

## Snapshot

POST

```
/snapshot
```

Payload

```json
{
    "url":"",
    "dom":"",
    "viewport":{
        "width":1440,
        "height":900
    }
}
```

---

# Chrome Extension Flow

```text
User clicks Capture

↓

Capture DOM

↓

Capture URL

↓

Capture viewport

↓

POST localhost/snapshot

↓

Go Service

↓

Percy

↓

Percy Cloud

↓

Success
```

---

# Desktop UI

## Dashboard

Display

- Percy Status
- Extension Status
- Project Name
- Percy Version

Buttons

- Start
- Stop
- Restart
- View Logs

---

## Settings

Fields

Project Token

Project Name

Server Port

Auto Start

Launch on Boot

Theme

---

## Logs

Display

Application logs

Percy logs

Errors

Warnings

Export logs

---

## System Tray

Menu

```text
Open Dashboard

Restart Percy

View Logs

Settings

Quit
```

---

# Configuration

config.json

```json
{
    "projectToken":"",
    "projectName":"",
    "port":4321,
    "autoStart":true,
    "launchOnBoot":true
}
```

---

# Logging

Store

```
logs/

app.log

percy.log
```

Each entry

```
Timestamp

Severity

Source

Message
```

---

# Installer

Installer responsibilities

- Install application
- Install Go backend
- Install Percy CLI
- Create configuration folder
- Register application
- Optional auto launch

After installation

User simply opens

```
Percy Desktop
```

Everything starts automatically.

---

# Error Handling

Examples

### Percy crashes

```
Percy stopped unexpectedly.

Restarting...
```

---

### Token missing

```
Please enter your project token.
```

---

### Port already in use

```
Local server unavailable.

Retrying...
```

---

### Extension disconnected

```
Chrome Extension not connected.
```

---

# Future Features

## Version 1.1

- Auto updates
- Multiple Percy projects
- Screenshot history
- Diagnostics page

---

## Version 1.2

- WebSocket communication
- Multiple browser support
- Background synchronization

---

## Version 2.0

- Team login
- Cloud sync
- Analytics
- Session history
- Auto bug reports

---

# Development Roadmap

## Phase 1

Backend

- Go service
- Process manager
- Percy launcher
- HTTP API
- Configuration

---

## Phase 2

Chrome Extension

- DOM capture
- Snapshot request
- Status indicator

---

## Phase 3

Desktop UI

- Dashboard
- Settings
- Logs
- Tray

---

## Phase 4

Installer

- Windows
- macOS
- Linux

---

## Phase 5

Production

- Auto updates
- Telemetry
- Crash reporting

---

# Success Criteria

A Manual QA Engineer should be able to:

1. Install the application.
2. Open the application.
3. See **"Percy Ready"**.
4. Open Chrome.
5. Use the extension.
6. Capture snapshots successfully.

Without ever opening a terminal, installing Node.js, or knowing that Percy is running in the background.

---

# Guiding Principle

> **The user should never know Percy exists.**

Percy is an implementation detail.

The product is a seamless Visual Testing Desktop Companion that manages everything automatically while the Chrome Extension focuses solely on capturing browser state.
