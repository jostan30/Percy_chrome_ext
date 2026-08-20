# Percy Server Setup & Usage — Windows

## Prerequisites

* Windows 10 or later
* Node.js
* npm
* `server.exe`
* `server.bat`

> **Note:** Go is **not** required. The server is already compiled.

---

## 1. Install Node.js

Install the **Node.js LTS** version.

If Windows Package Manager (`winget`) is available, open PowerShell or Command Prompt and run:

```powershell
winget install OpenJS.NodeJS.LTS
```

After installation, close and reopen Command Prompt or PowerShell.

Verify:

```cmd
node --version
npm --version
```

Both commands should display a version number.

> npm is included with the Node.js installation.

---

## 2. Folder Structure

Your Percy folder should look like:

```text
percy-windows/
├── server.exe
├── server.bat
└── Instructions.md
```

> **Note:** `server.log` and `server.pid` are created automatically when the server starts.

---

## 3. Start the Server

Open **Command Prompt** or **PowerShell** inside the `percy-windows` directory.

Run:

```cmd
./server.bat start
```

Expected output:

```text
Starting server...
Server started
```

---

## 4. Check Server Status

```cmd
./server.bat status
```

---

## 5. Stop the Server

```cmd
./server.bat stop
```

---

## 6. Restart the Server

```cmd
./server.bat restart
```

---

## 7. View Server Logs

The server writes its output to:

```text
server.log
```

You can open it using:

* Notepad
* VS Code
* Any text editor

---

## Generated Files

The following files are created automatically:

| File         | Purpose                       |
| ------------ | ----------------------------- |
| `server.log` | Stores server output and logs |
| `server.pid` | Stores the server process ID  |

Do not manually create these files.

---

## Troubleshooting

### Node.js not found

Check:

```cmd
node --version
```

If it is not installed, run:

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen your terminal, then check:

```cmd
node --version
npm --version
```

### Server already running

Check:

```cmd
./server.bat status
```

If necessary:

```cmd
./server.bat stop
```

Then:

```cmd
./server.bat start
```

### Server failed to start

Open:

```text
server.log
```

and check the latest error messages.

### Windows SmartScreen warning

If Windows displays a SmartScreen warning because the executable is not digitally signed:

1. Click **More info**.
2. Click **Run anyway**.

This warning can occur with locally distributed executables that do not have a trusted code-signing certificate.

---

## Available Commands

| Command              | Description         |
| -------------------- | ------------------- |
| `server.bat start`   | Start the server    |
| `server.bat stop`    | Stop the server     |
| `server.bat restart` | Restart the server  |
| `server.bat status`  | Check server status |