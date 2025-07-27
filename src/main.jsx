//react
import { createRoot } from "react-dom/client";
//@mui
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
//components
import App from "./App.jsx";

export const colMode = "dark";
// window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
// 	? "light"
// 	: "dark";

createRoot(document.getElementById("root")).render(
	<ThemeProvider
		theme={createTheme({
			palette: {
				mode: colMode,
			},
		})}
	>
		<CssBaseline />
		<App />
	</ThemeProvider>
);
