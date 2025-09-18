import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Icon } from "../icons";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  animation: ${({ $isVisible }) => ($isVisible ? slideIn : slideOut)} 0.3s
    ease-in-out;
`;

const ToastContent = styled.div<{
  $variant: "success" | "error" | "warning" | "info";
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ $variant }) => {
    switch ($variant) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
      default:
        return "#3b82f6";
    }
  }};
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 500px;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;

  &:hover {
    opacity: 0.8;
  }
`;

interface ToastProps {
  message: string;
  variant?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant = "info",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return "success";
      case "error":
        return "warning";
      case "warning":
        return "warning";
      case "info":
      default:
        return "info";
    }
  };

  return (
    <ToastContainer $isVisible={isVisible}>
      <ToastContent $variant={variant}>
        <Icon name={getIcon()} size="sm" color="white" />
        <span>{message}</span>
        <CloseButton onClick={handleClose}>
          <Icon name="close" size="xs" color="white" />
        </CloseButton>
      </ToastContent>
    </ToastContainer>
  );
};

export default Toast;
