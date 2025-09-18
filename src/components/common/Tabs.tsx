import React from "react";
import styled from "styled-components";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "minimal";
}

const TabContainer = styled.div<{
  $size: TabsProps["size"];
  $variant: TabsProps["variant"];
}>`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: ${(props) =>
    props.$variant === "minimal" ? "transparent" : "#f8fafc"};
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return "2px 2px 0 2px";
      case "large":
        return "6px 6px 0 6px";
      default:
        return "4px 4px 0 4px";
    }
  }};
  gap: 2px;
`;

const TabButton = styled.button<{
  $active: boolean;
  $size: TabsProps["size"];
  $variant: TabsProps["variant"];
  $disabled?: boolean;
}>`
  flex: 1;
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return "6px 8px";
      case "large":
        return "14px 20px";
      default:
        return "12px 16px";
    }
  }};
  border: none;
  background: ${(props) => {
    if (props.$disabled) return "#f9fafb";
    if (props.$variant === "minimal") {
      return props.$active ? "#3b82f6" : "transparent";
    }
    return props.$active
      ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      : "transparent";
  }};
  color: ${(props) => {
    if (props.$disabled) return "#9ca3af";
    if (props.$variant === "minimal") {
      return props.$active ? "#ffffff" : "#6b7280";
    }
    return props.$active ? "#ffffff" : "#6b7280";
  }};
  font-weight: ${(props) => (props.$active ? 600 : 400)};
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return "12px";
      case "large":
        return "16px";
      default:
        return "14px";
    }
  }};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: ${(props) => (props.$active ? "6px 6px 0 0" : "0")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => {
      if (props.$disabled) return "#f9fafb";
      if (props.$variant === "minimal") {
        return props.$active ? "#2563eb" : "rgba(59, 130, 246, 0.1)";
      }
      return props.$active
        ? "linear-gradient(135deg, #2563eb, #1e40af)"
        : "linear-gradient(135deg, #f8fafc, #f1f5f9)";
    }};
    color: ${(props) => {
      if (props.$disabled) return "#9ca3af";
      if (props.$variant === "minimal") {
        return props.$active ? "#ffffff" : "#374151";
      }
      return props.$active ? "#ffffff" : "#1f2937";
    }};
    transform: ${(props) => {
      if (props.$disabled) return "none";
      return props.$active ? "none" : "translateY(-1px)";
    }};
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) =>
      props.$disabled ? "none" : "0 0 0 3px rgba(59, 130, 246, 0.1)"};
  }

  &:active {
    transform: ${(props) => {
      if (props.$disabled) return "none";
      return props.$active ? "scale(0.98)" : "translateY(0)";
    }};
  }

  /* Add a subtle bottom border for inactive tabs */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${(props) => (props.$active ? "transparent" : "#e5e7eb")};
    transition: all 0.3s ease;
    display: ${(props) => (props.$variant === "minimal" ? "none" : "block")};
  }

  /* Keyboard navigation indicator */
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange,
  className,
  size = "medium",
  variant = "default",
}) => {
  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (!disabled) {
      onTabChange(tabId);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    tabId: string,
    disabled?: boolean
  ) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTabChange(tabId);
    }

    // Arrow key navigation
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const currentIndex = items.findIndex((item) => item.id === activeTab);
      let nextIndex;

      if (event.key === "ArrowLeft") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else {
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }

      // Skip disabled tabs
      while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
        if (event.key === "ArrowLeft") {
          nextIndex = nextIndex > 0 ? nextIndex - 1 : items.length - 1;
        } else {
          nextIndex = nextIndex < items.length - 1 ? nextIndex + 1 : 0;
        }
      }

      if (!items[nextIndex]?.disabled) {
        onTabChange(items[nextIndex].id);
        // Focus the new tab
        const tabElements = document.querySelectorAll("[data-tab-id]");
        const targetTab = Array.from(tabElements).find(
          (el) => el.getAttribute("data-tab-id") === items[nextIndex].id
        ) as HTMLElement;
        targetTab?.focus();
      }
    }
  };

  return (
    <TabContainer
      $size={size}
      $variant={variant}
      className={className}
      role="tablist"
    >
      {items.map((item) => (
        <TabButton
          key={item.id}
          $active={activeTab === item.id}
          $size={size}
          $variant={variant}
          $disabled={item.disabled}
          onClick={() => handleTabClick(item.id, item.disabled)}
          onKeyDown={(e) => handleKeyDown(e, item.id, item.disabled)}
          role="tab"
          aria-selected={activeTab === item.id}
          aria-controls={`tabpanel-${item.id}`}
          tabIndex={activeTab === item.id ? 0 : -1}
          data-tab-id={item.id}
          disabled={item.disabled}
        >
          {item.label}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default Tabs;
