import "./index.css";
import ReactDOM from "react-dom/client";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import AuthContextProvider from "./contexts/AuthContext";
import Router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthContextProvider>
		<ThemeContextProvider>
			<Router />
		</ThemeContextProvider>
	</AuthContextProvider>
);
