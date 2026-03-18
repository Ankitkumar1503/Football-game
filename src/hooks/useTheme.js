// This file now re-exports from ThemeContext so ALL components
// share the SAME theme state. No import paths need to change anywhere.
export { useTheme, ThemeProvider } from "../contexts/ThemeContext";