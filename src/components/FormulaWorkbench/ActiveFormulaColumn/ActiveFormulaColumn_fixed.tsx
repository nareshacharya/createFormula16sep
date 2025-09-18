import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../icons";
import { Dropdown, DropdownMenuOption } from "../../common";
import { mockIngredients } from "../../../data/mockData";
import { Ingredient } from "../../../models/Ingredient";
import { useFormula } from "../../../context/FormulaContext";
import IngredientSearchModal from "../modals/IngredientSearchModal";
import {
  ActiveGroupedColumn,
  ColumnHeader,
  ActiveTableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  EditableInput,
  ActionButton,
  EmptyState,
  Badge,
} from "../styles";
import styled from "styled-components";

// Styled components for inline search
const InlineSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  overflow: hidden;
`;

const InlineSearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  min-width: 0;
  max-width: 100%;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchDropdown = styled.div`
  position: fixed;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 99999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
`;

const SearchDropdownItem = styled.div<{ $isSelected?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${(props) => (props.$isSelected ? "#eff6ff" : "white")};
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AddIngredientButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
  }
`;

interface ActiveFormulaColumnProps {
  ingredients: any[];
  referenceFormulas: any[];
  unifiedRowOrder?: any[];
  onUpdateIngredient: (id: string, updates: any) => void;
  onRemoveIngredient: (id: string) => void;
  onAddIngredient: (ingredient: any) => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

const ActiveFormulaColumn: React.FC<ActiveFormulaColumnProps> = ({
  ingredients,
  referenceFormulas,
  unifiedRowOrder,
  onUpdateIngredient,
  onRemoveIngredient,
  onAddIngredient,
  canUndo = false,
  onUndo,
}) => {
  const { toggleFormulaGroup, expandFormulaGroup } = useFormula();
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showInlineSearch, setShowInlineSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [selectedSearchIngredient, setSelectedSearchIngredient] =
    useState<Ingredient | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter ingredients based on what's already in the active formula and reference formulas
  const usedIngredientNames = new Set([
    ...ingredients
      .filter((item) => !("type" in item) || item.type !== "formulaGroup")
      .map((ing) => (ing as any).ingredient.name),
    ...referenceFormulas.flatMap(
      (formula) =>
        formula.ingredients?.map((ing: any) => ing.ingredientName) || []
    ),
  ]);

  // Available ingredients for search (excluding already used ones)
  const availableIngredients = mockIngredients.filter(
    (ingredient) => !usedIngredientNames.has(ingredient.name)
  );

  // Create Set of ingredient IDs already used
  const usedIngredientIds = new Set(
    ingredients
      .filter((item) => !("type" in item) || item.type !== "formulaGroup")
      .map((ing) => (ing as any).ingredient.id)
  );

  // Handle ingredient selection from modal
  const handleIngredientSelect = (ingredient: Ingredient) => {
    onAddIngredient(ingredient);
    setShowIngredientModal(false);
  };

  // Handle adding ingredient via dropdown menu
  const handleAddIngredientClick = () => {
    setShowInlineSearch(!showInlineSearch);
    // Focus the search input when opening
    if (!showInlineSearch) {
      setTimeout(() => {
        updateDropdownPosition();
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const updateDropdownPosition = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleInlineSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length === 0) {
      setSearchResults([]);
      setSelectedSearchIngredient(null);
      return;
    }

    // Update dropdown position when search results change
    updateDropdownPosition();

    const filtered = availableIngredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm) ||
        ingredient.category.toLowerCase().includes(searchTerm) ||
        (ingredient.description &&
          ingredient.description.toLowerCase().includes(searchTerm))
    );

    setSearchResults(filtered.slice(0, 5)); // Limit to 5 results for dropdown
    setSelectedSearchIngredient(filtered.length > 0 ? filtered[0] : null);
  };

  const handleInlineIngredientSelect = (ingredient: Ingredient) => {
    onAddIngredient(ingredient);
    setShowInlineSearch(false);
    setSearchResults([]);
    setSelectedSearchIngredient(null);
  };

  const handleInlineSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && selectedSearchIngredient) {
      handleInlineIngredientSelect(selectedSearchIngredient);
    } else if (e.key === "Escape") {
      setShowInlineSearch(false);
      setSearchResults([]);
      setSelectedSearchIngredient(null);
    }
  };

  // Focus management for inline search
  useEffect(() => {
    if (showInlineSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showInlineSearch]);

  // Create dropdown menu items
  const dropdownMenuItems: DropdownMenuOption[] = [
    {
      id: "run-compliance",
      label: "Run Compliance",
      icon: "warning",
      iconColor: "secondary",
      action: () => {}, // TODO: Implement run compliance
    },
    {
      id: "yielding",
      label: "Yielding",
      icon: "calculator",
      iconColor: "secondary",
      action: () => {}, // TODO: Implement yielding
    },
    {
      id: "round-off",
      label: "Round Off",
      icon: "calculator",
      iconColor: "secondary",
      action: () => {}, // TODO: Implement round off
    },
    {
      id: "normalization",
      label: "Normalization",
      icon: "balanceScale",
      iconColor: "secondary",
      action: () => {}, // TODO: Implement normalization
    },
    {
      id: "create-version",
      label: "Create New Version",
      icon: "copy",
      iconColor: "secondary",
      action: () => {}, // TODO: Implement create new version
    },
    { type: "separator" },
    {
      id: "undo-last",
      label: "Undo Last Action",
      icon: "replace",
      iconColor: canUndo ? "primary" : "secondary",
      action: canUndo && onUndo ? onUndo : () => {}, // No actions to undo
      disabled: !canUndo,
    },
    {
      id: "add-ingredient",
      label: "Add Ingredient",
      icon: "add",
      iconColor: "secondary",
      action: handleAddIngredientClick,
    },
  ];

  const calculateCost = (ingredient: any, amount: number): number => {
    // Cost calculation - convert costPerKg to cost per gram
    // Assuming 1ml ≈ 1g for simplicity (can be adjusted based on density)
    const costPerGram = ingredient.ingredient.costPerKg || 0;
    return costPerGram * amount;
  };

  const calculateContributionCost = (
    ingredient: any,
    amount: number
  ): number => {
    // Contribution cost based on amount in grams
    return calculateCost(ingredient, amount);
  };

  const handleAmountChange = (id: string, amount: number) => {
    // For now, we'll just update the amount without concentration calculation
    // since batch size is moving to the summary section
    onUpdateIngredient(id, { amount });
  };

  // Create unified ingredient list using the unified row order if provided
  const getAllIngredients = () => {
    // If unified row order is provided from FormulaCanvas, use it directly
    if (unifiedRowOrder && unifiedRowOrder.length > 0) {
      return unifiedRowOrder
        .filter((item) => item.type !== "blank" && item.type !== "formulaGroup")
        .map((item) => {
          if (item.type === "expandedIngredient") {
            return {
              ...item.data,
              isMissing: false,
            };
          } else {
            return {
              ...item.data,
              isMissing: item.data.isMissing || false,
            };
          }
        });
    }

    // Fallback to original logic if no unified order provided
    const allIngredientNames = new Set<string>();
    const activeIngredientMap = new Map<string, any>();

    // Add active ingredients (filter out formula groups)
    ingredients
      .filter((item) => !("type" in item) || item.type !== "formulaGroup")
      .forEach((item) => {
        const formulaIngredient = item as any;
        allIngredientNames.add(formulaIngredient.ingredient.name);
        activeIngredientMap.set(
          formulaIngredient.ingredient.name,
          formulaIngredient
        );
      });

    // Track which formulas have already been processed as formula groups
    const formulaGroupIds = new Set(
      ingredients
        .filter((item) => "type" in item && item.type === "formulaGroup")
        .map((item: any) => item.formulaId)
    );

    // Add ingredients from reference formulas, but skip formulas that are already added as formula groups
    referenceFormulas.forEach((formula) => {
      // Skip this formula if it's already been added as a formula group
      if (formulaGroupIds.has(formula.metadata?.id)) {
        return;
      }

      formula.ingredients.forEach((ing: any) => {
        if (ing.concentration && ing.concentration > 0) {
          allIngredientNames.add(ing.ingredientName);
        }
      });
    });

    // Create unified rows
    return Array.from(allIngredientNames)
      .map((ingredientName) => {
        try {
          const activeIngredient = activeIngredientMap.get(ingredientName);

          if (activeIngredient) {
            return {
              ...activeIngredient,
              isMissing: false,
            };
          } else {
            // Create missing ingredient entry
            const mockIngredient = mockIngredients.find(
              (ing) => ing.name === ingredientName
            );

            return {
              id: `missing-${ingredientName}-${Date.now()}`,
              ingredient: mockIngredient || {
                id: `unknown-${ingredientName}-${Date.now()}`,
                name: ingredientName,
                costPerKg: 0,
                defaultConcentration: 1.0,
                category: "Unknown",
                description: "Unknown ingredient",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              concentration: 0,
              amount: 0,
              isMissing: true,
            };
          }
        } catch (error) {
          console.error(
            `Error processing ingredient "${ingredientName}":`,
            error
          );
          return {
            id: `error-${ingredientName}-${Date.now()}`,
            ingredient: {
              id: `error-${ingredientName}`,
              name: ingredientName,
              costPerKg: 0,
              defaultConcentration: 1.0,
              category: "Error",
              description: "Error processing ingredient",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            concentration: 0,
            amount: 0,
            isMissing: true,
          };
        }
      })
      .filter(Boolean); // Remove any null/undefined entries
  };

  const allIngredients = getAllIngredients();
  const activeCount = ingredients.filter(
    (item) => !("type" in item) || item.type !== "formulaGroup"
  ).length;

  const handleAddMissingIngredient = (ingredient: any) => {
    // Try to find the exact ingredient from mockIngredients first
    let mockIngredient = mockIngredients.find(
      (ing) =>
        ing.name === ingredient.ingredient?.name || ing.name === ingredient.name
    );

    // If no exact match, try partial matching for similar names
    if (!mockIngredient) {
      const targetName = ingredient.ingredient?.name || ingredient.name || "";
      mockIngredient = mockIngredients.find(
        (ing) =>
          ing.name.toLowerCase().includes(targetName.toLowerCase()) ||
          targetName.toLowerCase().includes(ing.name.toLowerCase())
      );
    }

    if (mockIngredient) {
      // Use the found ingredient from the library
      onAddIngredient(mockIngredient);
    } else {
      // Create a temporary ingredient with proper structure for missing ingredients
      const ingredientName =
        ingredient.ingredient?.name || ingredient.name || "Unknown Ingredient";

      const newIngredient: Ingredient = {
        id: `temp-${Date.now()}-${Math.random()}`,
        name: ingredientName,
        casNumber: ingredient.ingredient?.casNumber || "",
        category: ingredient.ingredient?.category || "Unknown",
        defaultConcentration:
          ingredient.ingredient?.defaultConcentration || 1.0,
        costPerKg: ingredient.ingredient?.costPerKg || 0.1, // Default cost per kg
        tags: ingredient.ingredient?.tags || [],
        attributes: ingredient.ingredient?.attributes || {
          intensity: 5,
          family: "Unknown",
          note: "Middle",
          volatility: "medium" as const,
          solubility: "oil" as const,
        },
        description:
          ingredient.ingredient?.description ||
          `Temporary ingredient: ${ingredientName}`,
        safetyNotes:
          ingredient.ingredient?.safetyNotes || "Safety data not available",
        regulatoryStatus: ingredient.ingredient?.regulatoryStatus || "Unknown",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onAddIngredient(newIngredient);
    }
  };

  return (
    <ActiveGroupedColumn>
      <ColumnHeader $variant="active">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h3>Active Formula</h3>
          <Badge>
            {activeCount} of {allIngredients.length} ingredients
          </Badge>
        </div>
        <Dropdown
          triggerIcon="menu"
          triggerIconColor="secondary"
          triggerTitle="Formula Actions"
          menuItems={dropdownMenuItems}
          position="right"
          minWidth="180px"
        />
      </ColumnHeader>

      <ActiveTableContainer>
        <TableHeader
          style={{ gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr" }}
        >
          <TableHeaderCell title="Ingredient name and details">
            Ingredient
          </TableHeaderCell>
          <TableHeaderCell title="Amount in grams">Amount (g)</TableHeaderCell>
          <TableHeaderCell title="Cost per milliliter in euros">
            Cost (€/ml)
          </TableHeaderCell>
          <TableHeaderCell title="Total contribution in euros">
            Contribution (€)
          </TableHeaderCell>
          <TableHeaderCell style={{ textAlign: "center" }} title="Actions">
            Actions
          </TableHeaderCell>
        </TableHeader>

        {/* Render ingredients using unified row order to ensure synchronization */}
        {unifiedRowOrder
          ? // Use unified row order when available (preferred for synchronization)
            unifiedRowOrder.map((rowItem, _index) => {
              try {
                // Handle formula group header row
                if (rowItem.type === "formulaGroup") {
                  const formulaGroup = rowItem.data;

                  // Validate formula group structure
                  if (!formulaGroup.id || !formulaGroup.formulaName) {
                    console.error(
                      `Invalid formula group structure:`,
                      formulaGroup
                    );
                    return null;
                  }

                  return (
                    <React.Fragment key={formulaGroup.id}>
                      {/* Formula Group Header Row - Grid Layout to match table */}
                      <TableRow
                        style={{
                          gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                          backgroundColor: "#f8fafc",
                          borderTop: "2px solid #e2e8f0",
                          fontWeight: "600",
                        }}
                      >
                        <TableCell
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleFormulaGroup(formulaGroup.id)}
                          title={`Click to ${formulaGroup.isExpanded ? "collapse" : "expand"} formula ingredients`}
                        >
                          <Icon
                            name={
                              formulaGroup.isExpanded
                                ? "chevronDown"
                                : "chevronRight"
                            }
                            size="sm"
                            color="secondary"
                          />
                          <span>{formulaGroup.formulaName}</span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              fontWeight: "normal",
                            }}
                          >
                            ({formulaGroup.metadata?.totalIngredients || 0}{" "}
                            ingredients)
                          </span>
                        </TableCell>

                        <TableCell
                          style={{ color: "#6b7280", fontStyle: "italic" }}
                        >
                          {formulaGroup.metadata?.totalConcentration?.toFixed(
                            1
                          )}
                          %
                        </TableCell>

                        <TableCell style={{ color: "#9ca3af" }}>—</TableCell>

                        <TableCell style={{ color: "#9ca3af" }}>—</TableCell>

                        <TableCell style={{ textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              justifyContent: "center",
                            }}
                          >
                            <ActionButton
                              onClick={() =>
                                expandFormulaGroup(formulaGroup.id)
                              }
                              title="Expand and add all ingredients to the list"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                borderRadius: "4px",
                                padding: "4px",
                                border: "none",
                                width: "24px",
                                height: "24px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#2563eb";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#3b82f6";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Icon name="add" size="xs" color="white" />
                            </ActionButton>
                            <ActionButton
                              onClick={() =>
                                onRemoveIngredient(formulaGroup.id)
                              }
                              title="Remove formula group"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ef4444",
                                color: "white",
                                borderRadius: "4px",
                                padding: "4px",
                                border: "none",
                                width: "24px",
                                height: "24px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#dc2626";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#ef4444";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Icon name="close" size="xs" color="white" />
                            </ActionButton>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Formula Group Ingredients */}
                      {formulaGroup.isExpanded &&
                        formulaGroup.ingredients?.map((ingredient: any) => {
                          try {
                            // Validate ingredient structure
                            if (!ingredient.id || !ingredient.ingredient) {
                              console.error(
                                `Invalid expanded ingredient:`,
                                ingredient
                              );
                              return null;
                            }

                            return (
                              <TableRow
                                key={`${formulaGroup.id}-${ingredient.id}`}
                                style={{
                                  gridTemplateColumns:
                                    "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                                  backgroundColor: "#fafbfc",
                                  paddingLeft: "20px",
                                }}
                              >
                                <TableCell
                                  title={
                                    ingredient.ingredient?.name ||
                                    "Unknown Ingredient"
                                  }
                                  style={{
                                    paddingLeft: "24px",
                                    color: "#4b5563",
                                  }}
                                >
                                  ↳{" "}
                                  {ingredient.ingredient?.name ||
                                    "Unknown Ingredient"}
                                </TableCell>
                                <TableCell
                                  title={`Concentration: ${ingredient.concentration}%`}
                                >
                                  {ingredient.concentration}%
                                </TableCell>
                                <TableCell
                                  title={`Cost: €${(ingredient.ingredient?.costPerKg || 0).toFixed(3)} per kg`}
                                >
                                  €
                                  {(
                                    ingredient.ingredient?.costPerKg || 0
                                  ).toFixed(3)}
                                </TableCell>
                                <TableCell
                                  title={`Amount: ${ingredient.quantity}g`}
                                >
                                  {ingredient.quantity?.toFixed(1) || 0}g
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  <span
                                    style={{
                                      color: "#9ca3af",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    —
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          } catch (error) {
                            console.error(
                              `Error rendering expanded ingredient:`,
                              error,
                              ingredient
                            );
                            return null;
                          }
                        })}
                    </React.Fragment>
                  );
                }

                // Handle blank rows (for Add Ingredient button alignment)
                if (rowItem.type === "blank") {
                  return null; // Will be handled separately below
                }

                // Handle expanded ingredients from formula groups
                // NOTE: Skip these in ActiveFormulaColumn because formula groups
                // handle their own expanded ingredient display
                if (rowItem.type === "expandedIngredient") {
                  // Skip rendering - formula groups handle their own expansion
                  return null;
                }

                // Handle regular ingredients
                if (rowItem.type === "ingredient") {
                  const item = rowItem.data;

                  if (item.isMissing) {
                    // Missing ingredient
                    return (
                      <TableRow
                        key={item.id}
                        style={{
                          gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                          backgroundColor: "#fef3f2",
                        }}
                      >
                        <TableCell title={item.ingredient.name}>
                          {item.ingredient.name}
                        </TableCell>
                        <TableCell title="Missing ingredient - amount cannot be edited">
                          <span style={{ color: "#9ca3af" }}>—</span>
                        </TableCell>
                        <TableCell title="Missing ingredient data">
                          <span style={{ color: "#9ca3af" }}>—</span>
                        </TableCell>
                        <TableCell title="Missing ingredient data">
                          <span style={{ color: "#9ca3af" }}>—</span>
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center" }}
                          title="Restore missing ingredient"
                        >
                          <ActionButton
                            onClick={() =>
                              handleAddMissingIngredient(item.ingredient)
                            }
                            title="Add ingredient to active formula"
                            style={{
                              backgroundColor: "#3bc989",
                              color: "white",
                              borderRadius: "4px",
                              padding: "4px",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.675rem",
                              width: "24px",
                              height: "24px",
                              margin: "0 auto",
                              opacity: 1,
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#059669";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#3bc989";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <Icon name="add" size="xs" color="white" />
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    // Regular active ingredient
                    const formulaIngredient = item;

                    // Validate ingredient structure
                    if (
                      !formulaIngredient.id ||
                      !formulaIngredient.ingredient
                    ) {
                      console.error(
                        `Invalid ingredient structure:`,
                        formulaIngredient
                      );
                      return null;
                    }

                    return (
                      <TableRow
                        key={formulaIngredient.id}
                        style={{
                          gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                          backgroundColor: "transparent",
                        }}
                      >
                        <TableCell title={formulaIngredient.ingredient.name}>
                          {formulaIngredient.ingredient.name}
                        </TableCell>
                        <TableCell
                          title={`Amount: ${formulaIngredient.amount || formulaIngredient.quantity || 0}g`}
                        >
                          <EditableInput
                            type="number"
                            value={
                              formulaIngredient.amount ||
                              formulaIngredient.quantity ||
                              0
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleAmountChange(
                                formulaIngredient.id,
                                Number(e.target.value)
                              )
                            }
                            step="0.1"
                            min="0"
                          />
                        </TableCell>
                        <TableCell
                          title={`Cost: €${(formulaIngredient.ingredient.costPerKg || 0).toFixed(3)} per kg`}
                        >
                          €
                          {(
                            formulaIngredient.ingredient.costPerKg || 0
                          ).toFixed(3)}
                        </TableCell>
                        <TableCell
                          title={`Total contribution: €${calculateContributionCost(formulaIngredient, formulaIngredient.amount || formulaIngredient.quantity || 0).toFixed(3)}`}
                        >
                          €
                          {calculateContributionCost(
                            formulaIngredient,
                            formulaIngredient.amount ||
                              formulaIngredient.quantity ||
                              0
                          ).toFixed(3)}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center" }}
                          title="Delete ingredient from formula"
                        >
                          <ActionButton
                            onClick={() =>
                              onRemoveIngredient(formulaIngredient.id)
                            }
                            title="Delete ingredient"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto",
                            }}
                          >
                            <Icon name="close" size="xs" color="error" />
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    );
                  }
                }

                return null;
              } catch (error) {
                console.error(`Error rendering row item:`, error, rowItem);
                return null;
              }
            })
          : // Fallback to original logic when unified row order is not available
            ingredients.map((item) => {
              try {
                // Check if this is a formula group
                if ((item as any).type === "formulaGroup") {
                  const formulaGroup = item as any;

                  // Validate formula group structure
                  if (!formulaGroup.id || !formulaGroup.formulaName) {
                    console.error(
                      `Invalid formula group structure:`,
                      formulaGroup
                    );
                    return null;
                  }

                  return (
                    <React.Fragment key={formulaGroup.id}>
                      {/* Formula Group Header Row - Grid Layout to match table */}
                      <TableRow
                        style={{
                          gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                          backgroundColor: "#f8fafc",
                          borderTop: "2px solid #e2e8f0",
                          fontWeight: "600",
                        }}
                      >
                        <TableCell
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleFormulaGroup(formulaGroup.id)}
                          title={`Click to ${formulaGroup.isExpanded ? "collapse" : "expand"} formula ingredients`}
                        >
                          <Icon
                            name={
                              formulaGroup.isExpanded
                                ? "chevronDown"
                                : "chevronRight"
                            }
                            size="sm"
                            color="secondary"
                          />
                          <span>{formulaGroup.formulaName}</span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              fontWeight: "normal",
                            }}
                          >
                            ({formulaGroup.metadata?.totalIngredients || 0}{" "}
                            ingredients)
                          </span>
                        </TableCell>

                        <TableCell
                          style={{ color: "#6b7280", fontStyle: "italic" }}
                        >
                          {formulaGroup.metadata?.totalConcentration?.toFixed(
                            1
                          )}
                          %
                        </TableCell>

                        <TableCell style={{ color: "#9ca3af" }}>—</TableCell>

                        <TableCell style={{ color: "#9ca3af" }}>—</TableCell>

                        <TableCell style={{ textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              justifyContent: "center",
                            }}
                          >
                            <ActionButton
                              onClick={() =>
                                expandFormulaGroup(formulaGroup.id)
                              }
                              title="Expand and add all ingredients to the list"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                borderRadius: "4px",
                                padding: "4px",
                                border: "none",
                                width: "24px",
                                height: "24px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#2563eb";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#3b82f6";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Icon name="add" size="xs" color="white" />
                            </ActionButton>
                            <ActionButton
                              onClick={() =>
                                onRemoveIngredient(formulaGroup.id)
                              }
                              title="Remove formula group"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ef4444",
                                color: "white",
                                borderRadius: "4px",
                                padding: "4px",
                                border: "none",
                                width: "24px",
                                height: "24px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#dc2626";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#ef4444";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Icon name="close" size="xs" color="white" />
                            </ActionButton>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Formula Group Ingredients */}
                      {formulaGroup.isExpanded &&
                        formulaGroup.ingredients?.map((ingredient: any) => {
                          try {
                            // Validate ingredient structure
                            if (!ingredient.id || !ingredient.ingredient) {
                              console.error(
                                `Invalid expanded ingredient:`,
                                ingredient
                              );
                              return null;
                            }

                            return (
                              <TableRow
                                key={`${formulaGroup.id}-${ingredient.id}`}
                                style={{
                                  gridTemplateColumns:
                                    "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                                  backgroundColor: "#fafbfc",
                                  paddingLeft: "20px",
                                }}
                              >
                                <TableCell
                                  title={
                                    ingredient.ingredient?.name ||
                                    "Unknown Ingredient"
                                  }
                                  style={{
                                    paddingLeft: "24px",
                                    color: "#4b5563",
                                  }}
                                >
                                  ↳{" "}
                                  {ingredient.ingredient?.name ||
                                    "Unknown Ingredient"}
                                </TableCell>
                                <TableCell
                                  title={`Concentration: ${ingredient.concentration}%`}
                                >
                                  {ingredient.concentration}%
                                </TableCell>
                                <TableCell
                                  title={`Cost: €${(ingredient.ingredient?.costPerKg || 0).toFixed(3)} per kg`}
                                >
                                  €
                                  {(
                                    ingredient.ingredient?.costPerKg || 0
                                  ).toFixed(3)}
                                </TableCell>
                                <TableCell
                                  title={`Amount: ${ingredient.quantity}g`}
                                >
                                  {ingredient.quantity?.toFixed(1) || 0}g
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  <span
                                    style={{
                                      color: "#9ca3af",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    —
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          } catch (error) {
                            console.error(
                              `Error rendering expanded ingredient:`,
                              error,
                              ingredient
                            );
                            return null;
                          }
                        })}
                    </React.Fragment>
                  );
                }

                // Regular ingredient rendering
                const formulaIngredient = item as any;

                // Validate ingredient structure
                if (!formulaIngredient.id || !formulaIngredient.ingredient) {
                  console.error(
                    `Invalid ingredient structure:`,
                    formulaIngredient
                  );
                  return null;
                }

                return (
                  <TableRow
                    key={formulaIngredient.id}
                    style={{
                      gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                      backgroundColor: "transparent",
                    }}
                  >
                    <TableCell title={formulaIngredient.ingredient.name}>
                      {formulaIngredient.ingredient.name}
                    </TableCell>
                    <TableCell
                      title={`Amount: ${formulaIngredient.amount || formulaIngredient.quantity || 0}g`}
                    >
                      <EditableInput
                        type="number"
                        value={
                          formulaIngredient.amount ||
                          formulaIngredient.quantity ||
                          0
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleAmountChange(
                            formulaIngredient.id,
                            Number(e.target.value)
                          )
                        }
                        step="0.1"
                        min="0"
                      />
                    </TableCell>
                    <TableCell
                      title={`Cost: €${(formulaIngredient.ingredient.costPerKg || 0).toFixed(3)} per kg`}
                    >
                      €
                      {(formulaIngredient.ingredient.costPerKg || 0).toFixed(3)}
                    </TableCell>
                    <TableCell
                      title={`Total contribution: €${calculateContributionCost(formulaIngredient, formulaIngredient.amount || formulaIngredient.quantity || 0).toFixed(3)}`}
                    >
                      €
                      {calculateContributionCost(
                        formulaIngredient,
                        formulaIngredient.amount ||
                          formulaIngredient.quantity ||
                          0
                      ).toFixed(3)}
                    </TableCell>
                    <TableCell
                      style={{ textAlign: "center" }}
                      title="Delete ingredient from formula"
                    >
                      <ActionButton
                        onClick={() => onRemoveIngredient(formulaIngredient.id)}
                        title="Delete ingredient"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        <Icon name="close" size="xs" color="error" />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                );
              } catch (error) {
                console.error(
                  `Error rendering ingredient/formula group:`,
                  error,
                  item
                );
                return null;
              }
            })}

        {/* Render missing ingredients only when not using unified row order */}
        {!unifiedRowOrder &&
          allIngredients
            .filter((item) => item.isMissing)
            .map((item) => (
              <TableRow
                key={item.id}
                style={{
                  gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
                  backgroundColor: "#fef3f2",
                }}
              >
                <TableCell title={item.ingredient.name}>
                  {item.ingredient.name}
                </TableCell>
                <TableCell title="Missing ingredient - amount cannot be edited">
                  <span style={{ color: "#9ca3af" }}>—</span>
                </TableCell>
                <TableCell title="Missing ingredient data">
                  <span style={{ color: "#9ca3af" }}>—</span>
                </TableCell>
                <TableCell title="Missing ingredient data">
                  <span style={{ color: "#9ca3af" }}>—</span>
                </TableCell>
                <TableCell
                  style={{ textAlign: "center" }}
                  title="Restore missing ingredient"
                >
                  <ActionButton
                    onClick={() => handleAddMissingIngredient(item.ingredient)}
                    title="Add ingredient to active formula"
                    style={{
                      backgroundColor: "#3bc989",
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.675rem",
                      width: "24px",
                      height: "24px",
                      margin: "0 auto",
                      opacity: 1,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#059669";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#3bc989";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Icon name="add" size="xs" color="white" />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}

        {/* Inline Search Row */}
        {showInlineSearch ? (
          <TableRow
            style={{
              gridTemplateColumns: "2.8fr 1.2fr 1.2fr 1.2fr 1fr",
              backgroundColor: "#fefbff",
              borderLeft: "3px solid #3b82f6",
            }}
          >
            <TableCell style={{ minWidth: 0, overflow: "hidden" }}>
              <InlineSearchContainer>
                <InlineSearchInput
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search ingredients..."
                  onChange={handleInlineSearchChange}
                  onKeyDown={handleInlineSearchKeyDown}
                  onFocus={updateDropdownPosition}
                />
              </InlineSearchContainer>
            </TableCell>
            <TableCell>
              <span style={{ color: "#9ca3af" }}>—</span>
            </TableCell>
            <TableCell>
              <span style={{ color: "#9ca3af" }}>—</span>
            </TableCell>
            <TableCell>
              <span style={{ color: "#9ca3af" }}>—</span>
            </TableCell>
            <TableCell style={{ textAlign: "center" }}>
              <ActionButton
                onClick={() => {
                  setShowInlineSearch(false);
                  setSearchResults([]);
                  setSelectedSearchIngredient(null);
                }}
                title="Cancel search"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <Icon name="close" size="xs" color="error" />
              </ActionButton>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow
            style={{
              gridTemplateColumns: "1fr",
              backgroundColor: "transparent",
              gridColumn: "1 / -1",
            }}
          >
            <TableCell style={{ gridColumn: "1 / -1" }}>
              <AddIngredientButton onClick={handleAddIngredientClick}>
                <Icon name="add" size="sm" color="secondary" />
                Add Ingredient
              </AddIngredientButton>
            </TableCell>
          </TableRow>
        )}

        {allIngredients.length === 0 && !showInlineSearch && (
          <EmptyState>No ingredients in formula</EmptyState>
        )}
      </ActiveTableContainer>

      {/* Ingredient Search Modal */}
      <IngredientSearchModal
        isOpen={showIngredientModal}
        onClose={() => setShowIngredientModal(false)}
        onSelect={handleIngredientSelect}
        availableIngredients={availableIngredients}
        selectedIngredientIds={usedIngredientIds}
        title="Add Ingredient to Active Formula"
        allowMultiSelect={false}
      />

      {/* Inline Search Dropdown - positioned absolutely */}
      {searchResults.length > 0 && showInlineSearch && (
        <SearchDropdown
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {searchResults.map((ingredient) => (
            <SearchDropdownItem
              key={ingredient.id}
              $isSelected={selectedSearchIngredient?.id === ingredient.id}
              onClick={() => handleInlineIngredientSelect(ingredient)}
            >
              <div style={{ fontWeight: 500 }}>{ingredient.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {ingredient.category} • €
                {(ingredient.costPerKg || 0).toFixed(3)}/ml
              </div>
            </SearchDropdownItem>
          ))}
        </SearchDropdown>
      )}
    </ActiveGroupedColumn>
  );
};

export default ActiveFormulaColumn;
