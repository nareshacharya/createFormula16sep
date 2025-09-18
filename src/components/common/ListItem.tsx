import React from "react";
import styled from "styled-components";
import { Icon, IconName } from "../icons";

// Types for list item configuration
export interface ListItemAction {
  id: string;
  label: string;
  icon?: IconName;
  onClick: (item: any) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  tooltip?: string;
}

export interface ListItemAttribute {
  key: string;
  label?: string;
  type?: "text" | "number" | "badge" | "date" | "percentage" | "custom";
  format?: (value: any) => string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ListItemConfig<T = any> {
  mainAttribute: ListItemAttribute;
  subAttributes?: ListItemAttribute[];
  actions?: ListItemAction[];
  selectable?: boolean;
  draggable?: boolean;
  avatar?: {
    key: string;
    fallback?: string;
    render?: (item: T) => React.ReactNode;
  };
  badge?: {
    key: string;
    variant?: "success" | "warning" | "error" | "info" | "neutral";
    render?: (value: any, item: T) => React.ReactNode;
  };
  onClick?: (item: T) => void;
  onDoubleClick?: (item: T) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ListItemProps<T = any> {
  item: T;
  config: ListItemConfig<T>;
  selected?: boolean;
  onSelectionChange?: (item: T, selected: boolean) => void;
  index?: number;
  isLast?: boolean;
  variant?: "default" | "compact" | "detailed";
}

// Styled components
const ListItemContainer = styled.div<{
  $selected?: boolean;
  $selectable?: boolean;
  $clickable?: boolean;
  $variant?: string;
}>`
  display: flex;
  align-items: center;
  padding: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "8px 12px";
      case "detailed":
        return "16px 20px";
      default:
        return "12px 16px";
    }
  }};
  background-color: ${(props) => (props.$selected ? "#fef3c7" : "white")};
  border: 1px solid ${(props) => (props.$selected ? "#fcd34d" : "#e5e7eb")};
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: ${(props) =>
    props.$clickable || props.$selectable ? "pointer" : "default"};

  &:hover {
    background-color: ${(props) => (!props.$selected ? "#f9fafb" : "#fef3c7")};
    border-color: ${(props) => (!props.$selected ? "#d1d5db" : "#fcd34d")};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const SelectionCheckbox = styled.input`
  margin-right: 12px;
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  cursor: pointer;
`;

const AvatarContainer = styled.div<{ $variant?: string }>`
  width: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "32px";
      case "detailed":
        return "48px";
      default:
        return "40px";
    }
  }};
  height: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "32px";
      case "detailed":
        return "48px";
      default:
        return "40px";
    }
  }};
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "12px";
      case "detailed":
        return "16px";
      default:
        return "14px";
    }
  }};
  font-weight: 500;
  color: #6b7280;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainAttribute = styled.div<{ $variant?: string }>`
  font-size: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "14px";
      case "detailed":
        return "16px";
      default:
        return "15px";
    }
  }};
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubAttributesContainer = styled.div<{ $variant?: string }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.$variant === "detailed" ? "8px" : "6px")};
  align-items: center;
`;

const SubAttribute = styled.span<{ $variant?: string }>`
  font-size: ${(props) => {
    switch (props.$variant) {
      case "compact":
        return "11px";
      case "detailed":
        return "13px";
      default:
        return "12px";
    }
  }};
  color: #6b7280;
  line-height: 1.3;

  &.text {
    color: #6b7280;
  }

  &.number {
    color: #374151;
    font-weight: 500;
  }

  &.badge {
    background-color: #f3f4f6;
    color: #374151;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }

  &.date {
    color: #6b7280;
    font-style: italic;
  }

  &.percentage {
    color: #059669;
    font-weight: 500;
  }
`;

const BadgeContainer = styled.div<{ $variant?: string }>`
  margin-left: auto;
  margin-right: 12px;
`;

const Badge = styled.span<{ $badgeVariant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;

  ${(props) => {
    switch (props.$badgeVariant) {
      case "success":
        return "background-color: #dcfce7; color: #166534;";
      case "warning":
        return "background-color: #fef3c7; color: #92400e;";
      case "error":
        return "background-color: #fee2e2; color: #991b1b;";
      case "info":
        return "background-color: #dbeafe; color: #1e40af;";
      default:
        return "background-color: #f3f4f6; color: #374151;";
    }
  }}
`;

const ActionsContainer = styled.div<{ $variant?: string }>`
  display: flex;
  gap: ${(props) => (props.$variant === "compact" ? "4px" : "6px")};
  align-items: center;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{
  $actionVariant?: string;
  $size?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.$size === "compact" ? "4px" : "6px")};
  border-radius: 4px;
  border: none;
  font-size: ${(props) => (props.$size === "compact" ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: ${(props) => (props.$size === "compact" ? "24px" : "28px")};
  height: ${(props) => (props.$size === "compact" ? "24px" : "28px")};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(props) => {
    switch (props.$actionVariant) {
      case "primary":
        return `
          background-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `;
      case "danger":
        return `
          background-color: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      case "secondary":
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover:not(:disabled) {
            background-color: #e5e7eb;
          }
        `;
      default: // ghost
        return `
          background-color: transparent;
          color: #6b7280;
          &:hover:not(:disabled) {
            background-color: #f3f4f6;
            color: #374151;
          }
        `;
    }
  }}
`;

// Helper functions
const formatValue = (value: any, attribute: ListItemAttribute): string => {
  if (attribute.format) {
    return attribute.format(value);
  }

  switch (attribute.type) {
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "percentage":
      return typeof value === "number" ? `${value}%` : String(value);
    case "date":
      return value instanceof Date ? value.toLocaleDateString() : String(value);
    default:
      return String(value);
  }
};

const getValueFromItem = (item: any, key: string): any => {
  return key.split(".").reduce((obj, k) => obj?.[k], item);
};

// Main component
export const ListItem = <T,>({
  item,
  config,
  selected = false,
  onSelectionChange,
  variant = "default",
}: ListItemProps<T>) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (config.selectable && onSelectionChange) {
      onSelectionChange(item, !selected);
    } else if (config.onClick) {
      config.onClick(item);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (config.onDoubleClick) {
      config.onDoubleClick(item);
    }
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(item, e.target.checked);
    }
  };

  const mainValue = getValueFromItem(item, config.mainAttribute.key);
  const isClickable = !!(config.onClick || config.onDoubleClick);

  return (
    <ListItemContainer
      $selected={selected}
      $selectable={config.selectable}
      $clickable={isClickable}
      $variant={variant}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={config.className}
      style={config.style}
    >
      {config.selectable && (
        <SelectionCheckbox
          type="checkbox"
          checked={selected}
          onChange={handleSelectionChange}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {config.avatar && (
        <AvatarContainer $variant={variant}>
          {config.avatar.render
            ? config.avatar.render(item)
            : getValueFromItem(item, config.avatar.key) ||
              config.avatar.fallback ||
              "?"}
        </AvatarContainer>
      )}

      <ContentContainer>
        <MainAttribute
          $variant={variant}
          className={config.mainAttribute.className}
          style={config.mainAttribute.style}
        >
          {config.mainAttribute.render
            ? config.mainAttribute.render(mainValue, item)
            : formatValue(mainValue, config.mainAttribute)}
        </MainAttribute>

        {config.subAttributes && config.subAttributes.length > 0 && (
          <SubAttributesContainer $variant={variant}>
            {config.subAttributes.map((attr, index) => {
              const value = getValueFromItem(item, attr.key);
              if (value === undefined || value === null || value === "")
                return null;

              return (
                <SubAttribute
                  key={index}
                  $variant={variant}
                  className={`${attr.type || "text"} ${attr.className || ""}`}
                  style={attr.style}
                >
                  {attr.label && `${attr.label}: `}
                  {attr.render
                    ? attr.render(value, item)
                    : formatValue(value, attr)}
                </SubAttribute>
              );
            })}
          </SubAttributesContainer>
        )}
      </ContentContainer>

      {config.badge && (
        <BadgeContainer $variant={variant}>
          <Badge $badgeVariant={config.badge.variant}>
            {config.badge.render
              ? config.badge.render(
                  getValueFromItem(item, config.badge.key),
                  item
                )
              : getValueFromItem(item, config.badge.key)}
          </Badge>
        </BadgeContainer>
      )}

      {config.actions && config.actions.length > 0 && (
        <ActionsContainer $variant={variant}>
          {config.actions.map((action) => (
            <ActionButton
              key={action.id}
              $actionVariant={action.variant}
              $size={variant}
              disabled={action.disabled}
              title={action.tooltip}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
              }}
            >
              {action.icon && <Icon name={action.icon} size="sm" />}
              {!action.icon && action.label}
            </ActionButton>
          ))}
        </ActionsContainer>
      )}
    </ListItemContainer>
  );
};

export default ListItem;
