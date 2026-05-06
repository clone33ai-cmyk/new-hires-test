import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App crash:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", padding: "2rem" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
              style={{ background: "#0077B6", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}
            >
              Go Back to Start
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
