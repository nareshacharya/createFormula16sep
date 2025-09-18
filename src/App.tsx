import React from "react";
import FormulaWorkbench from "./components/FormulaWorkbench/FormulaWorkbench";
import { FormulaProvider } from "./context/FormulaContext";
import { ToastProvider } from "./components/common";
import { GlobalStyle } from "./design-system/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { theme } from "./design-system/theme";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            border: "1px solid #ff6b6b",
            borderRadius: "5px",
            backgroundColor: "#ffe6e6",
          }}
        >
          <h2>Something went wrong:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        <ToastProvider>
          <FormulaProvider>
            <FormulaWorkbench />
          </FormulaProvider>
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
