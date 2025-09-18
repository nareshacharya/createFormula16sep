import React from "react";

const DiagnosticCheck: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        padding: "20px",
        backgroundColor: "#ff6b6b",
        color: "white",
        borderRadius: "5px",
        zIndex: 9999,
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      ✓ React is Working!
    </div>
  );
};

export default DiagnosticCheck;
