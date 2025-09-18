import React, { useState, useMemo } from "react";
import { Icon } from "../../icons";
import { Search } from "../../common";
import { Ingredient } from "../../../models/Ingredient";
import { mockIngredients } from "../../../data/mockData";
import { TabType, PanelProps } from "../types";
import FormulaActionsDropdown from "../FormulaActionsDropdown";
import IngredientSearchModal from "../modals/IngredientSearchModal";
import IngredientCard from "./IngredientCard";
import { useFormula } from "../../../context/FormulaContext";
import {
  LibraryContainer,
  PanelHeader,
  CollapseButton,
  PanelTitle,
  TabContainer,
  TabButton,
  TabContent,
  FormulaList,
  FormulaItem,
  FormulaActions,
  SelectionModeBar,
  SelectionActions,
  SelectionButton,
  FormulaCheckbox,
  FormulaItemContent,
  FormulaDetails,
  IngredientName,
  IngredientCAS,
} from "../styles";

interface LibraryPanelProps extends PanelProps {
  activeIngredientIds: Set<string>;
  referenceFormulas: any[];
  selectedReferenceFormulas?: any[]; // Add this to track selected formulas for highlighting
  onAddIngredient: (ingredient: Ingredient) => void;
  onReplaceFormula: (formula: any) => void;
  onMergeFormula: (formula: any) => void;
  onCompareFormula: (formula: any) => void;
  onAddMultipleFormulas?: (formulas: any[]) => void; // New prop for bulk addition
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({
  isCollapsed,
  onToggle,
  activeIngredientIds,
  referenceFormulas,
  selectedReferenceFormulas = [],
  onAddIngredient,
  onReplaceFormula,
  onMergeFormula,
  onCompareFormula,
  onAddMultipleFormulas,
}) => {
  const { addFormulaGroup } = useFormula();
  const [activeTab, setActiveTab] = useState<TabType>("ingredients");
  const [searchTerm, setSearchTerm] = useState("");
  const [formulaSearchTerm, setFormulaSearchTerm] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedFormulaIds, setSelectedFormulaIds] = useState<Set<string>>(
    new Set()
  );
  const [ingredientModalState, setIngredientModalState] = useState<{
    isOpen: boolean;
    formula: any | null;
  }>({
    isOpen: false,
    formula: null,
  });

  // Create a set of reference formula IDs for quick lookup (already added to reference column)
  const referenceFormulaIds = useMemo(() => {
    return new Set(selectedReferenceFormulas.map((f) => f.metadata?.id));
  }, [selectedReferenceFormulas]);

  // Filter formulas based on search
  const filteredFormulas = useMemo(() => {
    return referenceFormulas.filter(
      (formula) =>
        formula.metadata?.name
          .toLowerCase()
          .includes(formulaSearchTerm.toLowerCase()) ||
        formula.metadata?.base
          ?.toLowerCase()
          .includes(formulaSearchTerm.toLowerCase()) ||
        formula.metadata?.cost
          ?.toString()
          .includes(formulaSearchTerm.toLowerCase()) ||
        formula.ingredients?.some((ing: any) =>
          ing.ingredientName
            .toLowerCase()
            .includes(formulaSearchTerm.toLowerCase())
        )
    );
  }, [referenceFormulas, formulaSearchTerm]);

  // Multi-selection handlers
  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedFormulaIds(new Set());
  };

  const handleSelectFormula = (formulaId: string, checked: boolean) => {
    const newSelection = new Set(selectedFormulaIds);
    if (checked) {
      newSelection.add(formulaId);
    } else {
      newSelection.delete(formulaId);
    }
    setSelectedFormulaIds(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredFormulas.map((f) => f.metadata?.id));
    setSelectedFormulaIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedFormulaIds(new Set());
  };

  const handleAddSelectedFormulas = () => {
    if (selectedFormulaIds.size > 0 && onAddMultipleFormulas) {
      const formulasToAdd = filteredFormulas.filter((f) =>
        selectedFormulaIds.has(f.metadata?.id)
      );
      onAddMultipleFormulas(formulasToAdd);
      setSelectedFormulaIds(new Set());
      setIsSelectionMode(false);
    }
  };

  // Ingredient modal handlers
  const handleSeeIngredients = (formula: any) => {
    setIngredientModalState({
      isOpen: true,
      formula,
    });
  };

  const handleCloseIngredientModal = () => {
    setIngredientModalState({
      isOpen: false,
      formula: null,
    });
  };

  const handleSelectIngredientsFromModal = (ingredients: Ingredient[]) => {
    ingredients.forEach((ingredient) => {
      if (!activeIngredientIds.has(ingredient.id)) {
        onAddIngredient(ingredient);
      }
    });
  };

  if (isCollapsed) {
    return (
      <LibraryContainer $collapsed>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "16px 8px",
            background: "white",
            color: "#1f2937",
            borderBottom: "none",
            minHeight: "60px",
            flexShrink: 0,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            position: "relative",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <CollapseButton onClick={onToggle} style={{ marginBottom: "12px" }}>
            <Icon name="expand" size="sm" />
          </CollapseButton>
          <span
            style={{
              writingMode: "sideways-lr",
              textOrientation: "mixed",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              letterSpacing: "0.025em",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Library
          </span>
        </div>
      </LibraryContainer>
    );
  }

  return (
    <LibraryContainer>
      <PanelHeader>
        <PanelTitle>Library</PanelTitle>
        <CollapseButton onClick={onToggle}>
          <Icon name="collapse" size="base" />
        </CollapseButton>
      </PanelHeader>

      <TabContainer>
        <TabButton
          $active={activeTab === "ingredients"}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients
        </TabButton>
        <TabButton
          $active={activeTab === "formulas"}
          onClick={() => setActiveTab("formulas")}
        >
          Formulas
        </TabButton>
        <TabButton
          $active={activeTab === "base"}
          onClick={() => setActiveTab("base")}
        >
          Base
        </TabButton>
        <TabButton
          $active={activeTab === "dilutions"}
          onClick={() => setActiveTab("dilutions")}
        >
          Dilutions
        </TabButton>
      </TabContainer>

      <TabContent>
        {activeTab === "ingredients" && (
          <>
            <Search<Ingredient>
              items={mockIngredients}
              searchFields={["name", "casNumber", "description"]}
              placeholder="Search ingredients..."
              excludeIds={activeIngredientIds}
              isMultiSelectMode={false}
              renderItem={(ingredient, _isSelected, isExcluded) => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  onAdd={
                    isExcluded ? () => {} : () => onAddIngredient(ingredient)
                  }
                  isAdded={isExcluded}
                />
              )}
              itemCountLabel="ingredients"
            />
          </>
        )}{" "}
        {activeTab === "formulas" && (
          <>
            <div style={{ margin: "8px 0" }}>
              <input
                type="text"
                placeholder="Search formulas..."
                value={formulaSearchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormulaSearchTerm(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Multi-selection mode bar */}
            {isSelectionMode && (
              <SelectionModeBar>
                <div>
                  {selectedFormulaIds.size} of {filteredFormulas.length}{" "}
                  selected
                </div>
                <SelectionActions>
                  <SelectionButton onClick={handleSelectAll}>
                    Select All
                  </SelectionButton>
                  <SelectionButton onClick={handleDeselectAll}>
                    Clear
                  </SelectionButton>
                  <SelectionButton
                    $variant="primary"
                    onClick={handleAddSelectedFormulas}
                    disabled={selectedFormulaIds.size === 0}
                  >
                    <Icon name="add" size="xs" />
                    Add to References ({selectedFormulaIds.size})
                  </SelectionButton>
                </SelectionActions>
              </SelectionModeBar>
            )}

            {/* Action bar with selection mode toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "4px 0",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {filteredFormulas.length} formulas
              </div>
              <SelectionButton onClick={handleToggleSelectionMode}>
                <Icon name={isSelectionMode ? "close" : "edit"} size="xs" />
                {isSelectionMode ? "Exit Selection" : "Select Multiple"}
              </SelectionButton>
            </div>

            <FormulaList>
              {filteredFormulas.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontStyle: "italic",
                    fontSize: "14px",
                  }}
                >
                  {formulaSearchTerm
                    ? "No formulas match your search"
                    : "No formulas available"}
                </div>
              ) : (
                filteredFormulas.map((formula) => {
                  const isInReference = referenceFormulaIds.has(
                    formula.metadata?.id
                  );
                  const isSelected = selectedFormulaIds.has(
                    formula.metadata?.id
                  );

                  const getBackgroundColor = () => {
                    if (isInReference) return "#f0f9ff";
                    if (isSelected && isSelectionMode) return "#fef3c7";
                    return "white";
                  };

                  const getBorderColor = () => {
                    if (isInReference) return "1px solid #a9cef5";
                    if (isSelected && isSelectionMode)
                      return "1px solid #fcd34d";
                    return "1px solid #e5e7eb";
                  };

                  return (
                    <FormulaItem
                      key={formula.metadata?.id}
                      style={{
                        backgroundColor: getBackgroundColor(),
                        borderTop: getBorderColor(),
                      }}
                    >
                      <FormulaItemContent>
                        {isSelectionMode && (
                          <FormulaCheckbox
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleSelectFormula(
                                formula.metadata?.id,
                                e.target.checked
                              )
                            }
                            disabled={isInReference}
                          />
                        )}
                        <FormulaDetails>
                          <IngredientName>
                            {formula.metadata?.name}
                            {isInReference && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "10px",
                                  color: "#3b82f6",
                                  fontWeight: "normal",
                                }}
                              >
                                (In References)
                              </span>
                            )}
                          </IngredientName>
                          <IngredientCAS>
                            {formula.ingredients?.length || 0} ingredients
                          </IngredientCAS>
                        </FormulaDetails>
                      </FormulaItemContent>

                      {!isSelectionMode && (
                        <FormulaActions>
                          {isInReference && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#3b82f6",
                                marginRight: "8px",
                              }}
                            >
                              <Icon name="success" size="sm" />
                            </div>
                          )}
                          <FormulaActionsDropdown
                            onAddToActive={() => addFormulaGroup(formula)}
                            onCompare={() => onCompareFormula(formula)}
                            onMerge={() => onMergeFormula(formula)}
                            onReplace={() => onReplaceFormula(formula)}
                            onSeeIngredients={() =>
                              handleSeeIngredients(formula)
                            }
                          />
                        </FormulaActions>
                      )}
                    </FormulaItem>
                  );
                })
              )}
            </FormulaList>
          </>
        )}
        {activeTab === "base" && (
          <>
            <div style={{ margin: "8px 0" }}>
              <input
                type="text"
                placeholder="Search base materials..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <FormulaList>
              {/* Mock base materials - compact view */}
              {[
                {
                  id: "base1",
                  name: "Ethanol 96%",
                },
                {
                  id: "base2",
                  name: "Dipropylene Glycol",
                },
                {
                  id: "base3",
                  name: "Benzyl Benzoate",
                },
                {
                  id: "base4",
                  name: "Triethyl Citrate",
                },
                {
                  id: "base5",
                  name: "Isopropyl Myristate",
                },
                {
                  id: "base6",
                  name: "Diethyl Phthalate",
                },
                {
                  id: "base7",
                  name: "Propylene Glycol",
                },
                {
                  id: "base8",
                  name: "Glycerin",
                },
              ]
                .filter((base) =>
                  base.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((base) => (
                  <FormulaItem key={base.id}>
                    <FormulaItemContent>
                      <IngredientName>{base.name}</IngredientName>
                    </FormulaItemContent>
                  </FormulaItem>
                ))}
            </FormulaList>
          </>
        )}
        {activeTab === "dilutions" && (
          <>
            <div style={{ margin: "8px 0" }}>
              <input
                type="text"
                placeholder="Search dilutions..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <FormulaList>
              {/* Mock dilutions - compact view */}
              {[
                {
                  id: "dil1",
                  name: "10% in DPG",
                },
                {
                  id: "dil2",
                  name: "5% in Ethanol",
                },
                {
                  id: "dil3",
                  name: "1% in BB",
                },
                {
                  id: "dil4",
                  name: "20% in TEC",
                },
                {
                  id: "dil5",
                  name: "0.1% in IPM",
                },
                {
                  id: "dil6",
                  name: "50% in DPG",
                },
                {
                  id: "dil7",
                  name: "2% in Ethanol",
                },
                {
                  id: "dil8",
                  name: "25% in BB",
                },
              ]
                .filter((dilution) =>
                  dilution.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((dilution) => (
                  <FormulaItem key={dilution.id}>
                    <FormulaItemContent>
                      <IngredientName>{dilution.name}</IngredientName>
                    </FormulaItemContent>
                  </FormulaItem>
                ))}
            </FormulaList>
          </>
        )}
      </TabContent>

      {/* Ingredient Selection Modal */}
      <IngredientSearchModal
        isOpen={ingredientModalState.isOpen}
        onClose={handleCloseIngredientModal}
        onSelect={(ingredient) => {
          if (!activeIngredientIds.has(ingredient.id)) {
            onAddIngredient(ingredient);
          }
        }}
        onSelectMultiple={handleSelectIngredientsFromModal}
        availableIngredients={
          ingredientModalState.formula?.ingredients
            ?.map((ing: any) => {
              // If the ingredient has the full ingredient object, use it
              if (ing.ingredient) {
                return ing.ingredient;
              }
              // Otherwise, try to find it in mockIngredients by name
              const foundIngredient = mockIngredients.find(
                (mockIng) =>
                  mockIng.name.toLowerCase() ===
                    ing.ingredientName?.toLowerCase() ||
                  mockIng.casNumber === ing.casNumber
              );
              if (foundIngredient) {
                return foundIngredient;
              }
              // As a fallback, create a basic ingredient with defaults
              return {
                id: ing.id || ing.ingredientName || `temp-${Date.now()}`,
                name: ing.ingredientName || ing.name || "Unknown Ingredient",
                casNumber: ing.casNumber || "N/A",
                category: "Synthetic" as const,
                defaultConcentration: ing.concentration || 1.0,
                costPerKg: ing.costPerKg || 1.0,
                tags: ing.tags || [],
                attributes: ing.attributes || {},
                description: ing.description || "",
                safetyNotes: ing.safetyNotes || "",
                regulatoryStatus: ing.regulatoryStatus || "",
                createdAt: new Date(),
                updatedAt: new Date(),
              };
            })
            .filter(Boolean) || []
        }
        selectedIngredientIds={activeIngredientIds}
        title={`Add Ingredients from ${
          ingredientModalState.formula?.metadata?.name || "Formula"
        }`}
        allowMultiSelect
      />
    </LibraryContainer>
  );
};

export default LibraryPanel;
