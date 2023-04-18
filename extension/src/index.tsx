import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import { App } from "./App";

require("./note_ui.css");

// make sure that indexed db is persistent
// if running as webextension, will not prompt user
navigator.storage.persist()

const app = document.querySelector("#app") as HTMLDivElement;
const root = createRoot(app);
root.render(<App />);
