# Server Setup & Usage

## Prerequisites

* Linux operating system
* The server binary (`server`)
* The management script (`server.sh`)

## Folder Structure

```
project/
├── server
└── server.sh
```

> **Note:** `server.log` and `server.pid` are created automatically when the server starts. You do **not** need to create them manually.

---

## One-Time Setup

1. Open a terminal in the project directory.

2. Make the files executable:

```bash
chmod +x server
chmod +x server.sh
```

---

## Running the Server

### Start the server

```bash
./server.sh start
```

Expected output:

```
Starting server...
✅ Server started (PID: xxxx)
📄 Logs: server.log
```

---

### Check server status

```bash
./server.sh status
```

Output examples:

```
✅ Running (PID: xxxx)
```

or

```
❌ Not running
```

---

### View server logs

To continuously monitor the logs:

```bash
./server.sh logs
```

Press **Ctrl + C** to stop viewing the logs.

---

### Restart the server

```bash
./server.sh restart
```

---

### Stop the server

```bash
./server.sh stop
```

Expected output:

```
Stopping server...
✅ Server stopped.
```

---

## Generated Files

After starting the server, the following files are created automatically:

| File         | Purpose                                           |
| ------------ | ------------------------------------------------- |
| `server.log` | Stores the server output and logs                 |
| `server.pid` | Stores the Process ID (PID) of the running server |

Do **not** edit or delete these files while the server is running.

---

## Troubleshooting

### Permission denied

If you see a permission error, run:

```bash
chmod +x server
chmod +x server.sh
```

---

### Server already running

Check the status:

```bash
./server.sh status
```

If necessary, stop the existing instance:

```bash
./server.sh stop
```

Then start it again:

```bash
./server.sh start
```

---

### View recent logs

To see the latest log entries without following them:

```bash
tail -n 50 server.log
```

---

## Available Commands

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `./server.sh start`   | Start the server               |
| `./server.sh stop`    | Stop the server                |
| `./server.sh restart` | Restart the server             |
| `./server.sh status`  | Check if the server is running |
| `./server.sh logs`    | View live server logs          |
