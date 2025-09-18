import React, { useState, useRef, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { Icon } from "../icons";
import type { IconName, IconColor } from "../icons/iconConfig";

// Dropdown menu item interface
export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: IconName;
  iconColor?: IconColor;
  action: () => void;
  disabled?: boolean;
}

// Dropdown separator type
export interface DropdownSeparator {
  type: "separator";
}

// Combined menu item type
export type DropdownMenuOption = DropdownMenuItem | DropdownSeparator;

// Dropdown component props
interface DropdownProps {
  trigger?: ReactNode; // Custom trigger element
  triggerIcon?: IconName; // Icon name for default trigger
  triggerIconColor?: IconColor;
  triggerTitle?: string; // Tooltip for trigger
  menuItems: DropdownMenuOption[];
  position?: "left" | "right"; // Menu position relative to trigger
  minWidth?: string; // Minimum width of dropdown menu
  disabled?: boolean;
  className?: string;
}

// Styled components
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button<{ $disabled?: boolean }>`
  width: 32px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  color: ${(props) => (props.$disabled ? "#9ca3af" : "#6b7280")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: rgba(107, 114, 128, 0.1);
    color: #374151;
  }

  &:active:not(:disabled) {
    background: rgba(107, 114, 128, 0.15);
  }
`;

const DropdownMenu = styled.div<{
  $isOpen: boolean;
  $position: "left" | "right";
  $minWidth: string;
}>`
  position: absolute;
  top: 100%;
  ${(props) => (props.$position === "right" ? "right: 0;" : "left: 0;")}
  z-index: 99999;
  min-width: ${(props) => props.$minWidth};
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-top: 4px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0)" : "translateY(-8px)"};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-size: 12px;
  color: ${(props) => (props.$disabled ? "#9ca3af" : "#374151")};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &:only-child {
    border-radius: 6px;
  }
`;

const DropdownSeparator = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
`;

const DropdownOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  background: transparent;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

// Main Dropdown component
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  triggerIcon = "menu",
  triggerIconColor = "secondary",
  triggerTitle = "Menu",
  menuItems,
  position = "right",
  minWidth = "180px",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick =
    (action: () => void, itemDisabled?: boolean) => (e: React.MouseEvent) => {
      if (itemDisabled) return;
      e.stopPropagation();
      action();
      setIsOpen(false);
    };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <DropdownOverlay $isOpen={isOpen} onClick={handleOverlayClick} />
      <DropdownContainer ref={dropdownRef} className={className}>
        {trigger ? (
          <div
            onClick={handleToggle}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {trigger}
          </div>
        ) : (
          <DropdownButton
            onClick={handleToggle}
            title={triggerTitle}
            $disabled={disabled}
            disabled={disabled}
          >
            <Icon name={triggerIcon} size="sm" color={triggerIconColor} />
          </DropdownButton>
        )}

        <DropdownMenu
          $isOpen={isOpen}
          $position={position}
          $minWidth={minWidth}
        >
          {menuItems.map((item, index) => {
            if ("type" in item && item.type === "separator") {
              return <DropdownSeparator key={`separator-${index}`} />;
            }

            const menuItem = item as DropdownMenuItem;
            return (
              <DropdownItem
                key={menuItem.id}
                onClick={handleItemClick(menuItem.action, menuItem.disabled)}
                $disabled={menuItem.disabled}
                disabled={menuItem.disabled}
              >
                {menuItem.icon && (
                  <Icon
                    name={menuItem.icon}
                    size="sm"
                    color={
                      menuItem.disabled
                        ? "secondary"
                        : menuItem.iconColor || "secondary"
                    }
                  />
                )}
                {menuItem.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </DropdownContainer>
    </>
  );
};

export default Dropdown;
