#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
    APP="./server-arm64"
elif [ "$ARCH" = "x86_64" ]; then
    APP="./server"
else
    echo "❌ Unsupported Mac architecture: $ARCH"
    exit 1
fi

PIDFILE="server.pid"
LOGFILE="server.log"

start() {
    if [ ! -f "$APP" ]; then
        echo "Error: $APP not found."
        exit 1
    fi

    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "Server is already running (PID: $PID)"
            exit 0
        else
            echo "Removing stale PID file..."
            rm -f "$PIDFILE"
        fi
    fi

    echo "Starting server..."
    nohup "$APP" >> "$LOGFILE" 2>&1 &
    echo $! > "$PIDFILE"

    sleep 1

    if kill -0 $(cat "$PIDFILE") 2>/dev/null; then
        echo "✅ Server started (PID: $(cat "$PIDFILE"))"
        echo "📄 Logs: $LOGFILE"
    else
        echo "❌ Server failed to start."
        rm -f "$PIDFILE"
    fi
}

stop() {
    if [ ! -f "$PIDFILE" ]; then
        echo "Server is not running."
        exit 0
    fi

    PID=$(cat "$PIDFILE")

    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping server (PID: $PID)..."
        kill "$PID"

        sleep 1

        if kill -0 "$PID" 2>/dev/null; then
            echo "Force killing..."
            kill -9 "$PID"
        fi
    fi

    rm -f "$PIDFILE"
    echo "✅ Server stopped."
}

status() {
    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "✅ Running (PID: $PID)"
            exit 0
        fi
    fi

    echo "❌ Not running"
}

restart() {
    stop
    sleep 1
    start
}

logs() {
    tail -f "$LOGFILE"
}

case "$1" in
    start) start ;;
    stop) stop ;;
    restart) restart ;;
    status) status ;;
    logs) logs ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac