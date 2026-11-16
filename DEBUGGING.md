# Local Debugging Guide

## VS Code Launch Configuration

Add the following to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug: Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "backend:dev"],
      "console": "integratedTerminal",
      "port": 9229,
      "skipFiles": ["<node_internals>/**", "node_modules/**"]
    },
    {
      "name": "Debug: Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3090",
      "webRoot": "${workspaceFolder}/client"
    }
  ],
  "compounds": [
    {
      "name": "Debug: Full Stack",
      "configurations": ["Debug: Backend", "Debug: Frontend"],
      "stopAll": true
    }
  ]
}
```

---

## Full Stack Debugging

### Steps

1. **In a separate terminal**, start the frontend dev server (the only manual step):

   ```bash
   npm run frontend:dev
   ```

2. Wait for it to say `ready in...`

3. Set your breakpoints in both backend (`.ts`) and frontend (`.tsx`) files.

4. In VS Code's **Run and Debug** panel, select **Debug: Full Stack** from the dropdown.

5. Press the green play button (**F5**).

### What Happens

- **Debug: Backend** — runs `npm run backend:dev` in a VS Code terminal and automatically attaches the debugger.
- **Debug: Frontend** — opens a new Chrome window with debugging enabled, navigating to `http://localhost:3090`.
- Because the frontend server is already running, the page loads correctly.
- Breakpoints will be hit reliably in both backend and frontend code.

---

## Speeding Up the Build

Avoid `npm run frontend` — it runs 5 builds sequentially every time. Use `npm run build` instead, which runs them in parallel and **caches unchanged packages** via Turborepo.

| Changed | Command |
|---|---|
| Only `packages/data-provider` | `npm run build:data-provider` |
| Only `packages/api` | `cd packages/api && npm run build` |
| Full rebuild | `npm run build` |

---

## Backend-Only Debugging (Express API)

1. Set the Node memory limit:

   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. In VS Code's **Run and Debug** panel, select **Debug: Backend** and press **F5**.

4. Open your browser and go to `http://localhost:3080`.
