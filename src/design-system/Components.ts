import styled from "styled-components";
import { components, transitions, borderRadius } from "./theme";
import "./styled.d.ts";

// Standardized Button Components
export const BaseButton = styled.button`
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  border: 1px solid;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: ${components.button.primary.background};
  color: ${components.button.primary.color};
  border-color: ${components.button.primary.border};

  &:hover:not(:disabled) {
    background: ${components.button.primary.backgroundHover};
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: ${components.button.secondary.background};
  color: ${components.button.secondary.color};
  border-color: ${components.button.secondary.border};

  &:hover:not(:disabled) {
    background: ${components.button.secondary.backgroundHover};
  }
`;

export const DangerButton = styled(BaseButton)`
  background: ${components.button.danger.background};
  color: ${components.button.danger.color};
  border-color: ${components.button.danger.border};

  &:hover:not(:disabled) {
    background: ${components.button.danger.backgroundHover};
  }
`;

export const GhostButton = styled(BaseButton)`
  background: ${components.button.ghost.background};
  color: ${components.button.ghost.color};
  border-color: ${components.button.ghost.border};

  &:hover:not(:disabled) {
    background: ${components.button.ghost.backgroundHover};
  }
`;

// Standardized Badge Components
export const BaseBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: ${borderRadius.base};
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.25;
`;

export const SuccessBadge = styled(BaseBadge)`
  background: ${components.badge.success.background};
  color: ${components.badge.success.color};
`;

export const ErrorBadge = styled(BaseBadge)`
  background: ${components.badge.error.background};
  color: ${components.badge.error.color};
`;

export const WarningBadge = styled(BaseBadge)`
  background: ${components.badge.warning.background};
  color: ${components.badge.warning.color};
`;

export const InfoBadge = styled(BaseBadge)`
  background: ${components.badge.info.background};
  color: ${components.badge.info.color};
`;

export const NeutralBadge = styled(BaseBadge)`
  background: ${components.badge.neutral.background};
  color: ${components.badge.neutral.color};
`;

export const ActiveBadge = styled(BaseBadge)`
  background: ${components.badge.active.background};
  color: ${components.badge.active.color};
`;

// Standardized Panel Components

// Base panel component
export const DSBasePanel = styled.div`
  background: ${(props) => props.theme.components.panel.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.base};
  padding: ${(props) => props.theme.spacing.lg};
  margin: 0;
`;

// Panel header component
export const DSPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.components.panel.border};
  background: ${(props) => props.theme.components.panel.background};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

// Button components
export const DSBaseButton = styled.button`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  line-height: ${(props) => props.theme.typography.lineHeight.tight};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border: none;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const DSPrimaryButton = styled(DSBaseButton)`
  background: ${(props) => props.theme.colors.primary[500]};
  color: #ffffff;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary[600]};
  }

  &:active:not(:disabled) {
    background: ${(props) => props.theme.colors.primary[700]};
  }
`;

export const DSSecondaryButton = styled(DSBaseButton)`
  background: ${(props) => props.theme.components.panel.background};
  color: ${(props) => props.theme.colors.neutral[700]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.neutral[50]};
    border-color: ${(props) => props.theme.colors.neutral[300]};
  }
`;

// Badge component
export const DSBaseBadge = styled.span`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  line-height: ${(props) => props.theme.typography.lineHeight.tight};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.base};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const DSStatusBadge = styled(DSBaseBadge)`
  background: ${(props) => props.theme.components.badge.success.background};
  color: ${(props) => props.theme.components.badge.success.color};
`;

// Table components
export const DSTableRow = styled.tr`
  border-bottom: 1px solid ${(props) => props.theme.components.table.border};

  &:hover {
    background: ${(props) => props.theme.components.table.rowHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DSTableCell = styled.td`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.normal};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
  color: ${(props) => props.theme.colors.neutral[700]};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  vertical-align: middle;
`;

// Input components
export const DSBaseInput = styled.input`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.normal};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
  color: ${(props) => props.theme.colors.neutral[700]};
  background: ${(props) => props.theme.components.input.background};
  border: 1px solid ${(props) => props.theme.components.input.border};
  border-radius: ${(props) => props.theme.borderRadius.base};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.components.input.borderFocus};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary[100]};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.neutral[100]};
    cursor: not-allowed;
  }
`;

export const PanelHeader = styled.div<{
  variant?: "left" | "middle" | "right";
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 12px;
  border-bottom: 1px solid ${components.panel.border};
  background: ${(props) => {
    switch (props.variant) {
      case "left":
        return components.panel.headerBackground.left;
      case "middle":
        return components.panel.headerBackground.middle;
      case "right":
        return components.panel.headerBackground.right;
      default:
        return components.panel.background;
    }
  }};
`;

// Standardized Tab Components
export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  background: ${(props) =>
    props.active
      ? components.tab.active.background
      : components.tab.inactive.background};
  color: ${(props) =>
    props.active ? components.tab.active.color : components.tab.inactive.color};
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};

  &:hover {
    background: ${(props) =>
    props.active
      ? components.tab.active.background
      : components.tab.hover.background};
  }
`;

// Standardized Table Components
export const TableContainer = styled.div`
  border: 1px solid ${components.table.border};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  font-size: 0.75rem;
`;

export const TableHeaderRow = styled.div`
  background: ${components.table.headerBackground};
  border-bottom: 1px solid ${components.table.border};
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const TableRow = styled.div`
  border-bottom: 1px solid ${components.table.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${components.table.rowHover};
  }
`;

export const TableCell = styled.div`
  padding: ${components.table.cell.padding};
  border-right: 1px solid ${components.table.border};
  display: flex;
  align-items: center;
  color: #374151;

  &:last-child {
    border-right: none;
  }
`;

export const TableHeaderCell = styled(TableCell)`
  font-weight: 600;
  color: #374151;
`;

// Standardized Input Components
export const BaseInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${components.input.background};
  border: 1px solid ${components.input.border};
  border-radius: ${borderRadius.md};
  font-size: 0.875rem;
  font-family: inherit;
  transition: all ${transitions.fast};

  &:focus {
    outline: none;
    border-color: ${components.input.borderFocus};
    box-shadow: 0 0 0 1px ${components.input.borderFocus};
  }

  &::placeholder {
    color: ${components.input.placeholder};
  }
`;
