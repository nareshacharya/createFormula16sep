import React from "react";
import AddReferenceModal from "./AddReferenceModal";
import { attributeModalConfig } from "../../../data/referenceModalData";
import { AttributeColumn } from "../types";

interface AttributeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (attribute: {
    name: string;
    type: "text" | "number";
    unit?: string;
  }) => void;
  onSelectMultiple?: (
    attributes: {
      name: string;
      type: "text" | "number";
      unit?: string;
    }[]
  ) => void;
  selectedAttributes: AttributeColumn[];
  title: string;
  allowMultiSelect?: boolean;
}

const AttributeSearchModal: React.FC<AttributeSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  selectedAttributes,
  title,
  allowMultiSelect = false,
}) => {
  // Create config with dynamic title
  const config = {
    ...attributeModalConfig,
    title,
  };

  // Type conversion wrappers
  const handleSelect = (item: any) => {
    onSelect({
      name: item.name,
      type: item.type as "text" | "number",
      unit: item.unit,
    });
  };

  const handleSelectMultiple = onSelectMultiple
    ? (items: any[]) => {
        const convertedItems = items.map((item) => ({
          name: item.name,
          type: item.type as "text" | "number",
          unit: item.unit,
        }));
        onSelectMultiple(convertedItems);
      }
    : undefined;

  return (
    <AddReferenceModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={handleSelect}
      onSelectMultiple={handleSelectMultiple}
      config={config}
      selectedItems={selectedAttributes}
      allowMultiSelect={allowMultiSelect}
    />
  );
};

export default AttributeSearchModal;
