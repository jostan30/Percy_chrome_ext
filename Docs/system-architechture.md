System Integration

Overall Flow

Desktop App | | HTTP v Go Backend | | Spawn & Monitor v Percy CLI |v Percy Cloud

Chrome Extension | | HTTP (localhost) v Go Backend

User Workflow

Launch Desktop App.

Go backend starts Percy.

Open Chrome.

Capture snapshots from the extension while navigating pages.

Snapshots are queued by the backend.

Open Desktop App.

Click Finalize Build.

Backend uploads all queued snapshots to Percy.

Percy creates the build.