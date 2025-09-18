import React, { useState } from "react";
import { Icon } from "../../icons";
import { Ingredient } from "../../../models/Ingredient";
import IngredientCompositionModal from "./IngredientCompositionModal";
import styled from "styled-components";

interface IngredientCardProps {
  ingredient: Ingredient;
  isAdded: boolean;
  onAdd: (ingredient: Ingredient) => void;
}

const CardContainer = styled.div<{ $isAdded: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-left: 2px solid
    ${(props) => (props.$isAdded ? "#7705bc" : "transparent")};
  border-top: 1px solid #e5e7eb;
  border-radius: 0;
  margin-bottom: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(props) => (props.$isAdded ? "#FAF3FF" : "white")};
  cursor: pointer;
  position: relative;

  &:hover {
    background: ${(props) => (props.$isAdded ? "#FAF3FF" : "#EAF4FF")};
    transform: translateX(-1px);
  }
`;

const IngredientInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IngredientName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.2;
  word-break: break-word;
`;

const InfoButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95),
    rgba(249, 250, 251, 0.9)
  );
  border: 1px solid rgba(229, 231, 235, 0.8);
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  width: 32px;
  height: 32px;

  ${CardContainer}:hover & {
    opacity: 1;
    visibility: visible;
    animation: slideInScale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    color: #3b82f6;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
    transition: transform 0.1s ease;
  }

  @keyframes slideInScale {
    0% {
      opacity: 0;
      transform: translateY(-50%) scale(0.8) translateX(8px);
    }
    50% {
      transform: translateY(-50%) scale(1.05) translateX(0);
    }
    100% {
      opacity: 1;
      transform: translateY(-50%) scale(1) translateX(0);
    }
  }
`;

const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  isAdded,
  onAdd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    // If not added, add the ingredient
    if (!isAdded) {
      onAdd(ingredient);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <CardContainer $isAdded={isAdded} onClick={handleCardClick}>
        <IngredientInfo>
          <IngredientName>{ingredient.name}</IngredientName>
        </IngredientInfo>

        <InfoButton onClick={handleInfoClick} title="View ingredient details">
          <Icon name="info" size="sm" />
        </InfoButton>
      </CardContainer>

      <IngredientCompositionModal
        ingredient={ingredient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default IngredientCard;
