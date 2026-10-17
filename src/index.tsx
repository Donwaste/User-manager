import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  );
}
