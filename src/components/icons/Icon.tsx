import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ICONS,
  ICON_SIZES,
  ICON_COLORS,
  IconName,
  IconSize,
  IconColor,
} from "./iconConfig";
import styled from "styled-components";

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor | string;
  className?: string;
  onClick?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

const StyledIcon = styled(FontAwesomeIcon)<{
  $clickable?: boolean;
  $customColor?: string;
}>`
  color: ${(props) => props.$customColor || "inherit"};
  cursor: ${(props) => (props.$clickable ? "pointer" : "inherit")};
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover {
    opacity: ${(props) => (props.$clickable ? "0.7" : "1")};
  }
`;

export const Icon: React.FC<IconProps> = ({
  name,
  size = "base",
  color,
  className,
  onClick,
  title,
  style,
}) => {
  const iconDefinition = ICONS[name];
  const iconSize = ICON_SIZES[size];
  const iconColor =
    color && color in ICON_COLORS ? ICON_COLORS[color as IconColor] : color;

  return (
    <StyledIcon
      icon={iconDefinition}
      className={className}
      onClick={onClick}
      title={title}
      style={{
        fontSize: iconSize,
        ...style,
      }}
      $clickable={!!onClick}
      $customColor={iconColor}
    />
  );
};
