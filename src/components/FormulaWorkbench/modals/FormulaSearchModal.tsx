import React from "react";
import AddReferenceModal from "./AddReferenceModal";
import { formulaModalConfig } from "../../../data/referenceModalData";

interface FormulaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (formula: any) => void;
  onSelectMultiple?: (formulas: any[]) => void;
  formulas: any[];
  selectedFormulas: any[];
  excludedFormulas?: any[]; // Add excluded formulas prop
  title: string;
  allowMultiSelect?: boolean;
}

const FormulaSearchModal: React.FC<FormulaSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  formulas,
  selectedFormulas,
  excludedFormulas = [],
  title,
  allowMultiSelect = false,
}) => {
  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log("FormulaSearchModal opened with:");
      console.log("- Total formulas:", formulas.length);
      console.log("- Selected formulas:", selectedFormulas.length);
      console.log("- Excluded formulas:", excludedFormulas.length);
      console.log(
        "- Excluded formula names:",
        excludedFormulas.map((f) => f.metadata?.name || f.name)
      );
    }
  }, [isOpen, formulas, selectedFormulas, excludedFormulas]);

  // Create config with dynamic data and custom exclusion logic
  const config = {
    ...formulaModalConfig,
    title,
    data: formulas,
    getExcludeIds: (selectedItems: any[]) => {
      // Combine reference formulas + excluded formulas (active formula groups)
      const referenceIds = selectedItems.map((f) => f.metadata?.id || f.id);
      const excludedIds = excludedFormulas.map((f) => f.metadata?.id || f.id);
      const allExcludedIds = new Set([...referenceIds, ...excludedIds]);

      console.log("getExcludeIds called with:");
      console.log("- Reference IDs:", referenceIds);
      console.log("- Excluded IDs:", excludedIds);
      console.log("- All excluded IDs:", Array.from(allExcludedIds));

      return allExcludedIds;
    },
  };

  return (
    <AddReferenceModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={onSelect}
      onSelectMultiple={onSelectMultiple}
      config={config}
      selectedItems={selectedFormulas}
      allowMultiSelect={allowMultiSelect}
    />
  );
};

export default FormulaSearchModal;
