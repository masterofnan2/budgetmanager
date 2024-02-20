import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import initTranslation from "./core/function/initTranslation";

initTranslation();
const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App />
    </Router>
);