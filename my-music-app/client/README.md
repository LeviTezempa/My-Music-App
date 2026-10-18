# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## API requests

The client calls the same-origin `/api` path. During development, Vite proxies `/api`
to the backend at `http://localhost:5000`; production hosting must route `/api` to
the backend on the same origin. Keep provider keys and other credentials in the
server environment, never in client `VITE_` variables. API paths remain visible in
the browser and must not be treated as secrets.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
