import React, { useState } from "react";
import { Icon } from "../../icons";
import { Modal, Search, SecondaryButton, PrimaryButton } from "../../common";
import { Ingredient } from "../../../models/Ingredient";

interface IngredientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ingredient: Ingredient) => void;
  onSelectMultiple?: (ingredients: Ingredient[]) => void;
  availableIngredients: Ingredient[];
  selectedIngredientIds: Set<string>;
  title: string;
  allowMultiSelect?: boolean;
}

const IngredientSearchModal: React.FC<IngredientSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  availableIngredients,
  selectedIngredientIds,
  title,
  allowMultiSelect = true,
}) => {
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(allowMultiSelect);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectionChange = (
    _selectedItems: Ingredient[],
    newSelectedIds: Set<string>
  ) => {
    setSelectedIds(newSelectedIds);
  };

  const handleMultipleSelect = () => {
    if (onSelectMultiple && selectedIds.size > 0) {
      const ingredientsToAdd = availableIngredients.filter((ing) =>
        selectedIds.has(ing.id)
      );
      onSelectMultiple(ingredientsToAdd);
      onClose();
    }
  };

  // Header content for multi-select toggle
  const headerContent = allowMultiSelect ? (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        onClick={() => {
          const newMode = !isMultiSelectMode;
          setIsMultiSelectMode(newMode);
          // Always clear selections when switching modes
          setSelectedIds(new Set());
        }}
        style={{
          padding: "6px 12px",
          backgroundColor: isMultiSelectMode ? "#e0f2fe" : "transparent",
          color: isMultiSelectMode ? "#0369a1" : "#6b7280",
          border: `1px solid ${isMultiSelectMode ? "#0369a1" : "#d1d5db"}`,
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Icon name={isMultiSelectMode ? "success" : "add"} size="sm" />
        {isMultiSelectMode ? "Multi-Select" : "Single Select"}
      </button>
      {isMultiSelectMode && selectedIds.size > 0 && (
        <span
          style={{
            fontSize: "14px",
            color: "#3b82f6",
            fontWeight: "500",
            backgroundColor: "#eff6ff",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {selectedIds.size} selected
        </span>
      )}
    </div>
  ) : undefined;

  // Footer content for multi-select
  const footerContent =
    allowMultiSelect && selectedIds.size > 0 ? (
      <>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={handleMultipleSelect}
          disabled={selectedIds.size === 0}
        >
          <Icon name="add" size="sm" />
          Add {selectedIds.size} Ingredient{selectedIds.size !== 1 ? "s" : ""}{" "}
          to Active Formula
        </PrimaryButton>
      </>
    ) : undefined;

  // Custom item renderer with consistent styling
  const renderIngredientItem = (
    ingredient: Ingredient,
    isSelected: boolean,
    isExcluded: boolean
  ) => {
    const getBackgroundColor = () => {
      if (isExcluded) return "#f9fafb";
      if (isSelected && isMultiSelectMode) return "#eff6ff";
      if (isSelected) return "#f0f9ff";
      return "white";
    };

    const getBorderColor = () => {
      if (isExcluded) return "1px solid #10b981";
      if (isSelected && isMultiSelectMode) return "2px solid #3b82f6";
      if (isSelected) return "1px solid #3b82f6";
      return "1px solid #e5e7eb";
    };

    const handleItemClick = () => {
      if (isExcluded) return;

      if (!isMultiSelectMode) {
        onSelect(ingredient);
        onClose();
      } else {
        // In multi-select mode, toggle the selection
        const newSelectedIds = new Set(selectedIds);
        if (isSelected) {
          newSelectedIds.delete(ingredient.id);
        } else {
          newSelectedIds.add(ingredient.id);
        }
        setSelectedIds(newSelectedIds);

        // Notify the selection change
        const selectedItems = availableIngredients.filter((ing) =>
          newSelectedIds.has(ing.id)
        );
        handleSelectionChange(selectedItems, newSelectedIds);
      }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleItemClick();
    };

    return (
      <div
        key={ingredient.id}
        style={{
          backgroundColor: getBackgroundColor(),
          border: getBorderColor(),
          cursor: isExcluded ? "default" : "pointer",
          margin: "0 16px 6px 16px",
          borderRadius: "6px",
          padding: "8px",
          opacity: isExcluded ? 0.7 : 1,
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={handleItemClick}
        onMouseEnter={(e) => {
          if (!isExcluded) {
            e.currentTarget.style.backgroundColor =
              isSelected && isMultiSelectMode ? "#dbeafe" : "#f8fafc";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = getBackgroundColor();
        }}
      >
        {isMultiSelectMode && !isExcluded && (
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: isSelected ? "2px solid #3b82f6" : "2px solid #d1d5db",
              backgroundColor: isSelected ? "#3b82f6" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
            onClick={handleCheckboxClick}
          >
            {isSelected && (
              <Icon name="success" size="sm" style={{ color: "white" }} />
            )}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: "15px", color: "#111827" }}>
            {ingredient.name}
            {isExcluded && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "10px",
                  color: "#3b82f6",
                  fontWeight: "normal",
                }}
              >
                (Already Added)
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {ingredient.casNumber}
          </div>
        </div>
      </div>
    );
  };

  // Custom selection controls - only show Clear All
  const renderCustomSelectionControls = (
    selectedCount: number,
    _filteredCount: number,
    _onSelectAll: () => void,
    onClearAll: () => void
  ) => (
    <>
      {selectedCount > 0 && (
        <button
          onClick={() => {
            onClearAll();
            // Also reset the modal's selectedIds state
            setSelectedIds(new Set());
          }}
          style={{
            padding: "6px 12px",
            border: "1px solid #dc2626",
            borderRadius: "4px",
            background: "white",
            color: "#dc2626",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Icon name="close" size="sm" />
          Clear All
        </button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="large"
      headerContent={headerContent}
      footer={footerContent}
    >
      <Search<Ingredient>
        items={availableIngredients}
        searchFields={["name", "casNumber"]}
        placeholder="Search ingredients..."
        allowMultiSelect={allowMultiSelect}
        isMultiSelectMode={isMultiSelectMode}
        selectedIds={selectedIds}
        excludeIds={selectedIngredientIds}
        onSelectionChange={handleSelectionChange}
        renderItem={renderIngredientItem}
        renderSelectionControls={renderCustomSelectionControls}
        itemCountLabel="ingredients"
        autoFocus
        maxHeight="400px"
        showItemCount={false}
      />
    </Modal>
  );
};

export default IngredientSearchModal;
