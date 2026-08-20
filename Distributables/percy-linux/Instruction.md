# Percy Server Setup & Usage — Linux

## Prerequisites

* Linux operating system
* Node.js
* npm
* `server`
* `server.sh`

> **Note:** Go is **not** required. The server is already compiled.

---

## 1. Install Node.js and npm

For Ubuntu/Debian-based Linux:

```bash
sudo apt update
sudo apt install nodejs npm
```

Verify the installation:

```bash
node --version
npm --version
```

Both commands should display a version number.

---

## 2. Folder Structure

Your Percy folder should look like:

```text
percy-linux/
├── server
├── server.sh
└── Instructions.md
```

> **Note:** `server.log` and `server.pid` are created automatically when the server starts. You do not need to create them manually.

---

## 3. One-Time Setup

Open a terminal inside the `percy-linux` directory.

Make the server and script executable:

```bash
chmod +x server
chmod +x server.sh
```

---

## 4. Start the Server

Run:

```bash
./server.sh start
```

Expected output:

```text
Starting server...
✅ Server started (PID: xxxx)
📄 Logs: server.log
```

---

## 5. Check Server Status

Run:

```bash
./server.sh status
```

If running:

```text
✅ Running (PID: xxxx)
```

If not running:

```text
❌ Not running
```

---

## 6. View Server Logs

To continuously monitor the server logs:

```bash
./server.sh logs
```

Press:

```text
Ctrl + C
```

to stop viewing the logs.

To view the last 50 lines:

```bash
tail -n 50 server.log
```

---

## 7. Restart the Server

```bash
./server.sh restart
```

---

## 8. Stop the Server

```bash
./server.sh stop
```

Expected output:

```text
Stopping server...
✅ Server stopped.
```

---

## Generated Files

The following files are created automatically:

| File         | Purpose                              |
| ------------ | ------------------------------------ |
| `server.log` | Stores server output and logs        |
| `server.pid` | Stores the PID of the running server |

Do not manually create these files.

---

## Troubleshooting

### Permission denied

If you receive a permission error:

```bash
chmod +x server
chmod +x server.sh
```

Then try again:

```bash
./server.sh start
```

### Node.js not found

Check:

```bash
node --version
```

If the command is not found, install Node.js:

```bash
sudo apt update
sudo apt install nodejs npm
```

Then verify:

```bash
node --version
npm --version
```

### Server already running

Check:

```bash
./server.sh status
```

If necessary:

```bash
./server.sh stop
```

Then:

```bash
./server.sh start
```

### Server failed to start

Check the logs:

```bash
tail -n 50 server.log
```

---

## Available Commands

| Command               | Description           |
| --------------------- | --------------------- |
| `./server.sh start`   | Start the server      |
| `./server.sh stop`    | Stop the server       |
| `./server.sh restart` | Restart the server    |
| `./server.sh status`  | Check server status   |
| `./server.sh logs`    | View live server logs |
