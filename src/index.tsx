import React from "react";
// import ReactDOM from "react-dom";

import { createRoot } from "react-dom/client";

import { App } from "./App";

const app = document.querySelector("#app") as HTMLDivElement;
const root = createRoot(app);
root.render(<App />);
