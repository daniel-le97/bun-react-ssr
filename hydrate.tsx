import { hydrateRoot } from "react-dom/client";
// import {Config} from './uno.config.js'

const { default: App } = await import(globalThis.PATH_TO_PAGE);
// @ts-ignore - document is there from the client
// window.__unocss = await import(globalThis.PATH_TO_SCRIPT)
// @ts-ignore - document is there from the client
hydrateRoot(document, <App />);

