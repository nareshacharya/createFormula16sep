import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../icons";
import { IconButton } from "../styles";
import ReplaceFormulaModal from "./ReplaceFormulaModal";

interface FormulaActionsMenuProps {
  formulaId: string;
  formulaName: string;
  onReplaceActiveFormula: (formulaId: string) => void;
  onMergeWithActiveFormula?: (formulaId: string) => void;
  onRemoveFormula: (formulaId: string) => void;
}

const FormulaActionsMenu: React.FC<FormulaActionsMenuProps> = ({
  formulaId,
  formulaName,
  onReplaceActiveFormula,
  onMergeWithActiveFormula,
  onRemoveFormula,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + 4,
        left: buttonRect.right - 200, // Align right edge of dropdown with button
      });
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleReplaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false); // Close the dropdown menu
    setShowReplaceModal(true); // Open the modal
  };

  const handleConfirmReplace = () => {
    onReplaceActiveFormula(formulaId);
    setShowReplaceModal(false);
  };

  const handleCancelReplace = () => {
    setShowReplaceModal(false);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFormula(formulaId);
    setIsOpen(false);
  };

  const handleMergeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMergeWithActiveFormula) {
      onMergeWithActiveFormula(formulaId);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <IconButton
          ref={buttonRef}
          onClick={handleMenuToggle}
          title="Formula actions"
          style={{
            flexShrink: 0,
            background: isOpen ? "#f3f4f6" : "transparent",
            color: isOpen ? "#374151" : "#6b7280",
          }}
        >
          <Icon
            name="menu"
            size="sm"
            style={{
              color: "inherit",
            }}
          />
        </IconButton>

        {isOpen && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 99999,
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              minWidth: "200px",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={handleReplaceClick}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background-color 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon name="replace" size="sm" style={{ color: "#3b82f6" }} />
              Replace Active Formula
            </button>
            <div
              style={{
                height: "1px",
                background: "#e5e7eb",
                margin: "0 8px",
              }}
            />
            {onMergeWithActiveFormula && (
              <>
                <button
                  onClick={handleMergeClick}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background-color 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon name="add" size="sm" style={{ color: "#10b981" }} />
                  Merge with Active Formula
                </button>
                <div
                  style={{
                    height: "1px",
                    background: "#e5e7eb",
                    margin: "0 8px",
                  }}
                />
              </>
            )}
            <button
              onClick={handleRemoveClick}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background-color 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon name="delete" size="sm" style={{ color: "#dc2626" }} />
              Delete
            </button>
          </div>
        )}
      </div>

      <ReplaceFormulaModal
        isOpen={showReplaceModal}
        formulaName={formulaName}
        onConfirm={handleConfirmReplace}
        onCancel={handleCancelReplace}
      />
    </>
  );
};

export default FormulaActionsMenu;
