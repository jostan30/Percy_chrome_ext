# Percy Server Setup & Usage — macOS

## Prerequisites

* macOS
* Node.js
* npm
* `server`
* `server-arm64`
* `server.sh`

> **Note:** Go is **not** required. The server is already compiled.

The package supports both:

* Intel Macs
* Apple Silicon Macs (M1, M2, M3, M4, etc.)

The `server.sh` script automatically detects the Mac architecture and selects the correct binary.

---

## 1. Install Node.js and npm

The recommended method is Homebrew.

If Homebrew is already installed:

```bash
brew install node
```

Verify:

```bash
node --version
npm --version
```

Both commands should display a version number.

### If Homebrew is not installed

Install Homebrew from its official website, then run:

```bash
brew install node
```

---

## 2. Folder Structure

Your Percy folder should look like:

```text
percy-mac/
├── server
├── server-arm64
├── server.sh
└── Instructions.md
```

### Binaries

| File | Mac |
|---|---|
| `server` | Intel x86_64 |
| `server-arm64` | Apple Silicon ARM64 |

You do **not** need to choose the binary manually.

`server.sh` automatically selects the correct one.

> **Note:** `server.log` and `server.pid` are created automatically when the server starts.

---

## 3. One-Time Setup

Open Terminal and navigate to the `percy-mac` directory.

Make the files executable:

```bash
chmod +x server
chmod +x server-arm64
chmod +x server.sh
```

---

## 4. Remove macOS Quarantine

macOS may prevent the binaries from running because they were downloaded or transferred from another computer.

Run:

```bash
xattr -d com.apple.quarantine server
xattr -d com.apple.quarantine server-arm64
```

> **Note:** If you see `No such xattr: com.apple.quarantine`, that's okay. It means the file does not have the quarantine attribute.

---

## 5. Start the Server

Run:

```bash
./server.sh start
```

The script automatically detects your Mac architecture.

### Intel Mac

```text
x86_64 → server
```

### Apple Silicon Mac

```text
arm64 → server-arm64
```

Expected output:

```text
Starting server...
✅ Server started (PID: xxxx)
📄 Logs: server.log
```

---

## 6. Check Server Status

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

## 7. View Server Logs

To continuously monitor logs:

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

## 8. Restart the Server

```bash
./server.sh restart
```

---

## 9. Stop the Server

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

| File | Purpose |
|---|---|
| `server.log` | Stores server output and logs |
| `server.pid` | Stores the PID of the running server |

Do not manually create these files.

---

## Troubleshooting

### Permission denied

Run:

```bash
chmod +x server
chmod +x server-arm64
chmod +x server.sh
```

Then:

```bash
./server.sh start
```

### macOS quarantine issue

If macOS prevents the binary from running, run:

```bash
xattr -d com.apple.quarantine server
xattr -d com.apple.quarantine server-arm64
```

Then:

```bash
./server.sh start
```

### Node.js not found

Check:

```bash
node --version
```

If it is not installed:

```bash
brew install node
```

Then:

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

Check:

```bash
tail -n 50 server.log
```

### Unsupported Mac architecture

Check your architecture:

```bash
uname -m
```

Supported values:

```text
x86_64
arm64
```

---

## Available Commands

| Command | Description |
|---|---|
| `./server.sh start` | Start the server |
| `./server.sh stop` | Stop the server |
| `./server.sh restart` | Restart the server |
| `./server.sh status` | Check server status |
| `./server.sh logs` | View live server logs |