import styled from "styled-components";
import { typography, colors } from "./theme";

// Base typography components using semantic styles
// Panel and section headers
export const DSPanelTitle = styled.h2`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.semantic.panelTitle.fontSize};
  font-weight: ${(props) =>
    props.theme.typography.semantic.panelTitle.fontWeight};
  line-height: ${(props) =>
    props.theme.typography.semantic.panelTitle.lineHeight};
  color: ${(props) => props.theme.typography.semantic.panelTitle.color};
  margin: 0;
`;

export const DSSectionTitle = styled.h3`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) =>
    props.theme.typography.semantic.sectionTitle.fontSize};
  font-weight: ${(props) =>
    props.theme.typography.semantic.sectionTitle.fontWeight};
  line-height: ${(props) =>
    props.theme.typography.semantic.sectionTitle.lineHeight};
  color: ${(props) => props.theme.typography.semantic.sectionTitle.color};
  margin: 0;
`;

export const DSSubsectionTitle = styled.h4`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) =>
    props.theme.typography.semantic.sectionTitle.fontSize};
  font-weight: ${(props) =>
    props.theme.typography.semantic.sectionTitle.fontWeight};
  line-height: ${(props) =>
    props.theme.typography.semantic.sectionTitle.lineHeight};
  color: ${(props) => props.theme.typography.semantic.sectionTitle.color};
  margin: 0;
`;

// Table headers
export const DSTableHeader = styled.th`
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  font-size: ${(props) => props.theme.typography.semantic.tableHeader.fontSize};
  font-weight: ${(props) =>
    props.theme.typography.semantic.tableHeader.fontWeight};
  line-height: ${(props) =>
    props.theme.typography.semantic.tableHeader.lineHeight};
  color: ${(props) => props.theme.typography.semantic.tableHeader.color};
  text-align: left;
  padding: 0;
  margin: 0;
`;

export const TableHeader = styled.div`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.tableHeader.fontSize};
  font-weight: ${typography.semantic.tableHeader.fontWeight};
  line-height: ${typography.semantic.tableHeader.lineHeight};
  color: ${typography.semantic.tableHeader.color};
`;

export const BodyText = styled.div`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.body.fontSize};
  font-weight: ${typography.semantic.body.fontWeight};
  line-height: ${typography.semantic.body.lineHeight};
  color: ${typography.semantic.body.color};
`;

export const Caption = styled.div`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.caption.fontSize};
  font-weight: ${typography.semantic.caption.fontWeight};
  line-height: ${typography.semantic.caption.lineHeight};
  color: ${typography.semantic.caption.color};
`;

export const Label = styled.label`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.label.fontSize};
  font-weight: ${typography.semantic.label.fontWeight};
  line-height: ${typography.semantic.label.lineHeight};
  color: ${typography.semantic.label.color};
  display: block;
`;

// Button text component
export const ButtonText = styled.span`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.button.fontSize};
  font-weight: ${typography.semantic.button.fontWeight};
  line-height: ${typography.semantic.button.lineHeight};
`;

// Tab text component
export const TabText = styled.span`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.tab.fontSize};
  font-weight: ${typography.semantic.tab.fontWeight};
  line-height: ${typography.semantic.tab.lineHeight};
`;

// Badge text component
export const BadgeText = styled.span`
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.semantic.badge.fontSize};
  font-weight: ${typography.semantic.badge.fontWeight};
  line-height: ${typography.semantic.badge.lineHeight};
`;

// Utility components for common text styling
export const Muted = styled.span`
  color: ${colors.neutral[500]};
`;

export const Success = styled.span`
  color: ${colors.success[600]};
`;

export const Error = styled.span`
  color: ${colors.error[600]};
`;

export const Warning = styled.span`
  color: ${colors.warning[600]};
`;

export const Info = styled.span`
  color: ${colors.info[600]};
`;
