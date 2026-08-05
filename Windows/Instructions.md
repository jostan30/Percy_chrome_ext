# Server Setup & Usage (Windows)

## Prerequisites

* Windows 10 or later
* `server.exe`
* `server.bat`

## Folder Structure

```text
project/
├── server.exe
├── server.bat
```

> **Note:** `server.log` and `server.pid` are created automatically when the server starts.

---

## Starting the Server

Open **Command Prompt** or **PowerShell** in the project directory and run:

```cmd
server.bat start
```

---

## Check Status

```cmd
server.bat status
```

---

## Stop the Server

```cmd
server.bat stop
```

---

## Restart the Server

```cmd
server.bat restart
```

---

## View Logs

Open `server.log` with any text editor (Notepad, VS Code, etc.).

---

## Generated Files

| File         | Purpose                      |
| ------------ | ---------------------------- |
| `server.log` | Server logs                  |
| `server.pid` | Stores the server process ID |

These files are created automatically.

---

## Troubleshooting

### Windows Defender warning

If Windows SmartScreen displays a warning:

1. Click **More info**.
2. Click **Run anyway**.

### Server already running

Run:

```cmd
server.bat status
```

If necessary, stop the server:

```cmd
server.bat stop
```

Then start it again:

```cmd
server.bat start
```

### Available Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `server.bat start`   | Start the server               |
| `server.bat stop`    | Stop the server                |
| `server.bat restart` | Restart the server             |
| `server.bat status`  | Check if the server is running |
