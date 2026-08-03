# Percy Local Manager — Desktop App (Tauri v2 + React + TS + Vite)

## Plan Steps

1. ✅ Build the Go backend binary (`go build -o server ./cmd/server`).
2. ✅ Scaffold Tauri v2 shell (`Cargo.toml`, `tauri.conf.json`, capabilities, build.rs, main.rs, lib.rs).
3. ✅ Implement Rust IPC commands: `launch_backend`, `stop_backend`, `is_backend_running`, auto-stop on exit.
4. ✅ Scaffold Vite + React + TS frontend (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`).
5. ✅ Add frontend types for the backend HTTP contract.
6. ✅ Add HTTP service (`backendApi.ts`) for health, snapshots, finalize.
7. ✅ Add IPC wrapper (`backendProcess.ts`) for launch/stop.
8. ✅ Add Zustand store(s) for backend status, snapshots, build result.
9. ✅ Build Dashboard UI (status, snapshot list, token input, finalize button, build-complete modal).
10. ✅ Wire startup flow (launch backend → poll /health → ready) and shutdown (stop backend on close).
11. ✅ Verify frontend build (`npm run build`), generate Tauri icons, and verify Rust compile (`cargo check`).
</content>
