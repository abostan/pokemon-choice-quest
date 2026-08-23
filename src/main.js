import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { applyStoredTheme } from "./engine/theme.js";

const e = React.createElement;

// Prima del render, così non c'è un flash del tema di default prima che
// quello scelto venga applicato.
applyStoredTheme();

const root = createRoot(document.getElementById("root"));
root.render(e(App));
