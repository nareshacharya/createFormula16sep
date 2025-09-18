import React from "react";
import { Dropdown, DropdownMenuOption } from "../common";

interface FormulaActionsDropdownProps {
  onAddToActive: () => void;
  onCompare: () => void;
  onMerge: () => void;
  onReplace: () => void;
  onSeeIngredients: () => void;
}

const FormulaActionsDropdown: React.FC<FormulaActionsDropdownProps> = ({
  onAddToActive,
  onCompare,
  onMerge,
  onReplace,
  onSeeIngredients,
}) => {
  const menuItems: DropdownMenuOption[] = [
    {
      id: "add-to-active",
      label: "Add to Active Formula",
      icon: "add",
      iconColor: "primary",
      action: onAddToActive,
    },
    {
      id: "compare",
      label: "Compare formula",
      icon: "compare",
      iconColor: "secondary",
      action: onCompare,
    },
    {
      id: "merge",
      label: "Merge with active",
      icon: "merge",
      iconColor: "secondary",
      action: onMerge,
    },
    {
      id: "replace",
      label: "Replace active",
      icon: "replace",
      iconColor: "secondary",
      action: onReplace,
    },
    {
      id: "see-ingredients",
      label: "See Ingredients",
      icon: "search",
      iconColor: "secondary",
      action: onSeeIngredients,
    },
  ];

  return (
    <Dropdown
      triggerIcon="menu"
      triggerIconColor="secondary"
      triggerTitle="Formula actions"
      menuItems={menuItems}
      position="right"
      minWidth="200px"
    />
  );
};

export default FormulaActionsDropdown;
