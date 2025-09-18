import React, { useState } from "react";
import { Icon } from "../../icons";
import { Modal, Search, SecondaryButton, PrimaryButton } from "../../common";
import {
  ReferenceModalConfig,
  ReferenceItem,
} from "../../../data/referenceModalData";

interface AddReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ReferenceItem) => void;
  onSelectMultiple?: (items: ReferenceItem[]) => void;
  config: ReferenceModalConfig;
  selectedItems?: any[];
  allowMultiSelect?: boolean;
}

const AddReferenceModal: React.FC<AddReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  config,
  selectedItems = [],
  allowMultiSelect = false,
}) => {
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(allowMultiSelect);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Transform data to ensure each item has an id property that matches config.getItemId
  const transformedData = config.data.map((item) => ({
    ...item,
    id: config.getItemId(item), // Ensure item.id matches what config.getItemId returns
  }));

  // Reset multi-select mode when allowMultiSelect changes
  React.useEffect(() => {
    setIsMultiSelectMode(allowMultiSelect);
  }, [allowMultiSelect]);

  // Reset selected IDs when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      // Reset selections when modal opens
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  const handleSelectionChange = (
    _selectedItems: ReferenceItem[],
    newSelectedIds: Set<string>
  ) => {
    setSelectedIds(newSelectedIds);
  };

  const handleSingleSelect = (item: ReferenceItem) => {
    onSelect(item);
    onClose();
  };

  const handleMultipleSelect = () => {
    if (onSelectMultiple && selectedIds.size > 0) {
      const itemsToAdd = transformedData.filter((item: ReferenceItem) =>
        selectedIds.has(item.id)
      );
      onSelectMultiple(itemsToAdd);
      onClose();
    }
  };

  // Header content for multi-select toggle
  const headerContent = (
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
  );

  // Footer content
  const footerContent =
    isMultiSelectMode && selectedIds.size > 0 ? (
      <>
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
        <PrimaryButton onClick={handleMultipleSelect}>
          <Icon name="add" size="sm" />
          {config.addButtonLabel} ({selectedIds.size})
        </PrimaryButton>
      </>
    ) : (
      <SecondaryButton onClick={onClose}>Close</SecondaryButton>
    );

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

  // Custom item renderer
  const renderItem = (
    item: ReferenceItem,
    isSelected: boolean,
    isExcluded: boolean
  ) => {
    const { title, subtitle, badge } = config.renderItemContent(item);

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
        handleSingleSelect(item);
      } else {
        // In multi-select mode, toggle the selection
        // Now item.id is guaranteed to be the same as config.getItemId(item)
        const itemId = item.id;
        const newSelectedIds = new Set(selectedIds);
        if (isSelected) {
          newSelectedIds.delete(itemId);
        } else {
          newSelectedIds.add(itemId);
        }
        setSelectedIds(newSelectedIds);

        // Notify the selection change
        if (handleSelectionChange) {
          const selectedItems = transformedData.filter(
            (dataItem: ReferenceItem) => newSelectedIds.has(dataItem.id)
          );
          handleSelectionChange(selectedItems, newSelectedIds);
        }
      }
    };
    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleItemClick();
    };

    return (
      <div
        key={config.getItemId(item)}
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
            {title}
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
            {badge && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "#059669",
                  backgroundColor: "#d1fae5",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>{subtitle}</div>
        </div>
        {isExcluded && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#B8EBC8",
            }}
          >
            <Icon name="success" size="base" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      size="large"
      headerContent={headerContent}
      footer={footerContent}
    >
      <Search<ReferenceItem>
        items={transformedData}
        searchFields={config.searchFields}
        placeholder={config.placeholder}
        allowMultiSelect={true}
        isMultiSelectMode={isMultiSelectMode}
        selectedIds={selectedIds}
        excludeIds={config.getExcludeIds(selectedItems)}
        onSelectionChange={handleSelectionChange}
        renderItem={renderItem}
        renderSelectionControls={renderCustomSelectionControls}
        itemCountLabel={config.itemCountLabel}
        showItemCount={false}
        autoFocus
        maxHeight="400px"
      />
    </Modal>
  );
};

export default AddReferenceModal;
