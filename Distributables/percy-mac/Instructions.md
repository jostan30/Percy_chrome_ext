# Server Setup & Usage (macOS)

## Prerequisites

* macOS 11 or later
* The server binary (`server`)
* The management script (`server.sh`)

## Folder Structure

```text
project/
├── server
└── server.sh
```

> **Note:** `server.log` and `server.pid` are created automatically when the server starts. You do **not** need to create them manually.

---

## One-Time Setup

### 1. Open Terminal

Open the **Terminal** application and navigate to the project folder.

Example:

```bash
cd /path/to/project
```

---

### 2. Make the files executable

```bash
chmod +x server
chmod +x server.sh
```

---

### 3. (First Launch Only) Allow the Application

If macOS blocks the application because it was downloaded from the Internet, remove the quarantine attribute:

```bash
xattr -d com.apple.quarantine server
```

If prompted, you can also allow it from:

**System Settings → Privacy & Security → Open Anyway**

---

## Running the Server

### Start the server

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

### Check server status

```bash
./server.sh status
```

---

### View live logs

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

---

## Generated Files

The following files are created automatically:

| File         | Purpose                       |
| ------------ | ----------------------------- |
| `server.log` | Stores server logs            |
| `server.pid` | Stores the running process ID |

---

## Troubleshooting

### Permission denied

Run:

```bash
chmod +x server
chmod +x server.sh
```

---

### "Cannot be opened because Apple cannot check it for malicious software"

Open:

**System Settings → Privacy & Security**

Scroll down and click **Open Anyway**.

Or remove the quarantine attribute:

```bash
xattr -d com.apple.quarantine server
```

---

### Server already running

Check:

```bash
./server.sh status
```

Stop it:

```bash
./server.sh stop
```

Start again:

```bash
./server.sh start
```

---

### View recent logs

```bash
tail -n 50 server.log
```

---

## Available Commands

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `./server.sh start`   | Start the server                    |
| `./server.sh stop`    | Stop the server                     |
| `./server.sh restart` | Restart the server                  |
| `./server.sh status`  | Check whether the server is running |
| `./server.sh logs`    | View live server logs               |
