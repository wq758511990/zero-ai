import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "virtual:windi.css";
import "./index.css";
import { RouterDom } from "./router/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterDom />
  </StrictMode>
);
