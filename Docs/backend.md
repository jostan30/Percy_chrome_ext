Go Backend

Responsibility

The Go backend is the central controller.

Manage Percy process

Expose localhost HTTP API

Receive snapshots from the Chrome extension

Store captured snapshots temporarily

Finalize the Percy build

Manage configuration

Collect logs

Report status to the desktop app

Main APIs

System

GET /health

GET /status

POST /start

POST /stop

POST /restart

Configuration

GET /config

PUT /config

Snapshots

POST /snapshot

GET /snapshots

DELETE /snapshots

Build

POST /build/finalize

Logs

GET /logs

Internal Modules

Process Manager

Percy Controller

Snapshot Store

Config Manager

Logger

HTTP Server