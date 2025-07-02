import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <>
    <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
    <App />
  </>
  // {/* </React.StrictMode> */}
);


