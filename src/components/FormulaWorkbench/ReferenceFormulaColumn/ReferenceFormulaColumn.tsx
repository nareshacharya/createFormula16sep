import React, { useState, useMemo } from "react";
import { Icon } from "../../icons";
import FormulaSearchModal from "../modals/FormulaSearchModal";
import FormulaActionsMenu from "./FormulaActionsMenu";
import { CollapsibleColumnProps } from "../types";
import {
  GroupedColumn,
  CollapsibleColumnHeader,
  CollapsedColumnHeader,
  TableContainer,
  DiffIndicator,
  EmptyState,
  Badge,
  IconButton,
  CollapseButton,
  ColumnSubHeader,
  TableRowContainer,
} from "../styles";

interface ReferenceFormulaColumnProps extends CollapsibleColumnProps {
  activeIngredients: any[];
  referenceFormulas: any[];
  libraryFormulas: any[];
  unifiedRowOrder?: any[];
  onRemoveFormula: (id: string) => void;
  onAddFormula: (formula: any) => void;
  onAddMultipleFormulas?: (formulas: any[]) => void;
  onReplaceActiveFormula: (formulaId: string) => void;
  onMergeWithActiveFormula?: (formulaId: string) => void;
  onDeleteAllFormulas?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const ReferenceFormulaColumn: React.FC<ReferenceFormulaColumnProps> = ({
  activeIngredients,
  referenceFormulas,
  libraryFormulas,
  unifiedRowOrder,
  isCollapsed,
  onToggle,
  onRemoveFormula,
  onAddFormula,
  onAddMultipleFormulas,
  onReplaceActiveFormula,
  onMergeWithActiveFormula,
  onDeleteAllFormulas,
  onDragStart,
  onDragEnd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate difference between reference and active formula values
  const calculateDifference = (refValue: number, activeValue: number) => {
    if (!refValue || refValue === 0) return null;
    const diff = activeValue - refValue;
    const percentDiff = (diff / refValue) * 100;

    if (Math.abs(percentDiff) < 0.1) return null;
    return {
      type: percentDiff > 0 ? "positive" : ("negative" as const),
      text: `${percentDiff > 0 ? "+" : ""}${percentDiff.toFixed(1)}%`,
    };
  };

  // Find reference ingredient by name and formula ID
  const findReferenceIngredient = (
    ingredientName: string,
    formulaId: string
  ) => {
    const formula = referenceFormulas?.find(
      (f: any) => f.metadata?.id === formulaId
    );
    return formula?.ingredients.find(
      (ing: any) => ing.ingredientName === ingredientName
    );
  };

  // Handle modal actions
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSingleSelect = (formula: any) => {
    onAddFormula(formula);
  };

  const handleMultipleSelect = (formulas: any[]) => {
    if (onAddMultipleFormulas) {
      onAddMultipleFormulas(formulas);
    } else {
      formulas.forEach((formula) => onAddFormula(formula));
    }
  };

  // Get all excluded formulas (both reference and active formula groups)
  const getExcludedFormulas = () => {
    const excludedFormulas: any[] = [];

    // Add formulas that are already in active ingredients as formula groups
    activeIngredients.forEach((item) => {
      if ("type" in item && item.type === "formulaGroup") {
        // Find the original formula from library using formulaId
        const originalFormula = libraryFormulas.find((formula) => {
          const formulaId = formula.metadata?.id || formula.id;
          return formulaId === item.formulaId; // Use formulaId from the formula group
        });

        if (originalFormula) {
          excludedFormulas.push(originalFormula);
        }
      }
    });

    console.log(
      "Excluded formulas:",
      excludedFormulas.map((f) => f.metadata?.name || f.name)
    );

    return excludedFormulas;
  };

  // Sort formulas to show already added ones first, keep others in original order
  const sortedLibraryFormulas = useMemo(() => {
    const alreadyAdded: any[] = [];
    const remaining: any[] = [];
    const excludedFormulas = getExcludedFormulas();

    libraryFormulas.forEach((formula) => {
      const formulaId = formula.metadata?.id || formula.id;

      // Check if already in reference formulas
      const isInReference = referenceFormulas.some(
        (ref: any) => (ref.metadata?.id || ref.id) === formulaId
      );

      // Check if already in active formula as formula group
      const isInActive = excludedFormulas.some(
        (excluded: any) => (excluded.metadata?.id || excluded.id) === formulaId
      );

      if (isInReference || isInActive) {
        alreadyAdded.push(formula);
      } else {
        remaining.push(formula);
      }
    });

    return [...alreadyAdded, ...remaining];
  }, [libraryFormulas, referenceFormulas, activeIngredients]);

  // Collapsed state
  if (isCollapsed) {
    return (
      <GroupedColumn $collapsed>
        <CollapsedColumnHeader $variant="reference">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              cursor: "grab",
              paddingBottom: "24px",
            }}
            draggable={!!onDragStart}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {onDragStart && (
              <Icon
                name="gripLinesVertical"
                size="sm"
                style={{
                  opacity: 0.5,
                  cursor: "grab",
                }}
              />
            )}
            <CollapseButton onClick={onToggle}>
              <Icon name="expand" size="sm" />
            </CollapseButton>
          </div>
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
            Reference Formula
          </span>
        </CollapsedColumnHeader>
      </GroupedColumn>
    );
  }

  return (
    <>
      <GroupedColumn>
        <CollapsibleColumnHeader $variant="reference">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {onDragStart && (
              <div
                style={{
                  cursor: "grab",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                  flexShrink: 0,
                }}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon
                  name="gripLinesVertical"
                  size="sm"
                  style={{
                    color: "#6b7280",
                  }}
                />
              </div>
            )}
            <h3 style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
              Reference Formula
            </h3>
            <Badge>{referenceFormulas.length} formulas</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconButton onClick={handleOpenModal} title="Search & Add Formula">
              <Icon name="add" size="sm" />
            </IconButton>
            {referenceFormulas.length > 0 && onDeleteAllFormulas && (
              <IconButton
                onClick={onDeleteAllFormulas}
                title="Delete All Formulas"
                style={{
                  color: "#9ca3af",
                  backgroundColor: "transparent",
                }}
              >
                <Icon name="delete" size="sm" />
              </IconButton>
            )}
            <CollapseButton onClick={onToggle}>
              <Icon name="collapse" size="sm" />
            </CollapseButton>
          </div>
        </CollapsibleColumnHeader>

        {referenceFormulas.length === 0 ? (
          <EmptyState>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Icon
                name="add"
                size="lg"
                style={{ color: "#9ca3af", marginBottom: "8px" }}
              />
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                No reference formulas for comparison
              </p>
              <button
                onClick={handleOpenModal}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  margin: "12px auto 0",
                }}
              >
                <Icon name="add" size="sm" />
                Add Reference Formula
              </button>
            </div>
          </EmptyState>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              width: "fit-content",
              overflowX: "auto",
              flex: 1,
              height: "100%",
            }}
          >
            {referenceFormulas.map((formula) => {
              // Get all row items - use unified order if provided, otherwise calculate
              const getAllRowItems = () => {
                // If unified row order is provided from FormulaCanvas, use it directly
                if (unifiedRowOrder && unifiedRowOrder.length > 0) {
                  return unifiedRowOrder;
                }

                // Fallback to original logic if no unified order provided
                const rowItems: Array<{
                  type:
                    | "ingredient"
                    | "formulaGroup"
                    | "expandedIngredient"
                    | "blank";
                  data: any;
                }> = [];

                // Process active ingredients in EXACT order as they appear in the activeIngredients array
                // This ensures perfect synchronization with ActiveFormulaColumn
                activeIngredients.forEach((item) => {
                  try {
                    // Check if this is a formula group
                    if ("type" in item && item.type === "formulaGroup") {
                      const formulaGroup = item as any;

                      // Add formula group header row
                      rowItems.push({
                        type: "formulaGroup",
                        data: formulaGroup,
                      });

                      // Only add ingredients if the formula group is expanded
                      // to match the behavior of ActiveFormulaColumn
                      if (
                        formulaGroup.isExpanded &&
                        formulaGroup.ingredients &&
                        Array.isArray(formulaGroup.ingredients)
                      ) {
                        formulaGroup.ingredients.forEach(
                          (groupIngredient: any) => {
                            if (
                              groupIngredient.ingredient &&
                              groupIngredient.ingredient.name
                            ) {
                              rowItems.push({
                                type: "expandedIngredient",
                                data: groupIngredient,
                              });
                            }
                          }
                        );
                      }
                    } else {
                      // Regular ingredient - use exact order from activeIngredients
                      if (item.ingredient && item.ingredient.name) {
                        rowItems.push({
                          type: "ingredient",
                          data: item,
                        });
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Error processing active ingredient:",
                      error,
                      item
                    );
                  }
                });

                // Now add missing ingredients that appear in ANY reference formula
                // but are not in the active ingredients list
                const activeIngredientNames = new Set<string>();

                // Collect all ingredient names that are already accounted for
                activeIngredients.forEach((item) => {
                  try {
                    if ("type" in item && item.type === "formulaGroup") {
                      const formulaGroup = item as any;
                      if (
                        formulaGroup.ingredients &&
                        Array.isArray(formulaGroup.ingredients)
                      ) {
                        formulaGroup.ingredients.forEach(
                          (groupIngredient: any) => {
                            if (
                              groupIngredient.ingredient &&
                              groupIngredient.ingredient.name
                            ) {
                              activeIngredientNames.add(
                                groupIngredient.ingredient.name
                              );
                            }
                          }
                        );
                      }
                    } else {
                      if (item.ingredient && item.ingredient.name) {
                        activeIngredientNames.add(item.ingredient.name);
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Error collecting active ingredient names:",
                      error,
                      item
                    );
                  }
                });

                // Add missing ingredients from reference formulas in consistent order
                // Process reference formulas in order to maintain consistency
                referenceFormulas.forEach((refFormula) => {
                  try {
                    if (
                      refFormula.ingredients &&
                      Array.isArray(refFormula.ingredients)
                    ) {
                      refFormula.ingredients.forEach((ing: any) => {
                        try {
                          if (
                            ing.concentration &&
                            ing.concentration > 0 &&
                            ing.ingredientName &&
                            !activeIngredientNames.has(ing.ingredientName)
                          ) {
                            rowItems.push({
                              type: "ingredient",
                              data: {
                                ingredient: { name: ing.ingredientName },
                                concentration: 0, // Not in active formula
                              },
                            });
                            activeIngredientNames.add(ing.ingredientName); // Avoid duplicates
                          }
                        } catch (error) {
                          console.error(
                            "Error processing reference ingredient:",
                            error,
                            ing
                          );
                        }
                      });
                    }
                  } catch (error) {
                    console.error(
                      "Error processing reference formula:",
                      error,
                      refFormula
                    );
                  }
                });

                // Add a blank row to correspond to the "Add Ingredient" button or inline search row in ActiveFormulaColumn
                rowItems.push({
                  type: "blank",
                  data: null,
                });

                return rowItems;
              };

              const allRowItems = getAllRowItems();

              return (
                <div
                  key={formula.metadata?.id}
                  style={{
                    minWidth: "200px",
                    width: "200px",
                    flexShrink: 0,
                    overflow: "hidden",
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <ColumnSubHeader>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      <strong style={{ fontSize: "14px", flex: 1 }}>
                        {formula.metadata?.name}
                      </strong>
                    </div>
                    <FormulaActionsMenu
                      formulaId={formula.metadata?.id}
                      formulaName={formula.metadata?.name}
                      onReplaceActiveFormula={onReplaceActiveFormula}
                      onMergeWithActiveFormula={onMergeWithActiveFormula}
                      onRemoveFormula={onRemoveFormula}
                    />
                  </ColumnSubHeader>

                  <TableContainer>
                    {allRowItems.map((rowItem, index) => {
                      // Handle formula group header row
                      if (rowItem.type === "formulaGroup") {
                        return (
                          <TableRowContainer
                            key={`formula-group-${rowItem.data.id}`}
                          >
                            <div
                              style={{
                                flex: 1,
                                color: "#6b7280",
                                fontStyle: "italic",
                                fontSize: "13px",
                              }}
                            >
                              {rowItem.data.formulaName}
                            </div>
                          </TableRowContainer>
                        );
                      }

                      // Handle blank rows (for Add Ingredient button alignment)
                      if (rowItem.type === "blank") {
                        return (
                          <TableRowContainer key={`blank-${index}`}>
                            <div style={{ flex: 1, minHeight: "48px" }}>
                              {/* Empty row to align with Add Ingredient button in ActiveFormulaColumn */}
                            </div>
                          </TableRowContainer>
                        );
                      }

                      // Handle expanded ingredients from formula groups
                      if (rowItem.type === "expandedIngredient") {
                        const ingredientName =
                          rowItem.data.ingredient?.name || rowItem.data.name;
                        const refIngredient = findReferenceIngredient(
                          ingredientName,
                          formula.metadata?.id
                        );

                        // Only render if this reference formula actually has this ingredient
                        if (!refIngredient) {
                          return (
                            <TableRowContainer
                              key={`empty-${ingredientName}-${index}`}
                            >
                              <div style={{ flex: 1, minHeight: "48px" }}>
                                {/* Empty row - this reference formula doesn't have this ingredient */}
                              </div>
                            </TableRowContainer>
                          );
                        }

                        const refConcentration =
                          refIngredient.concentration || 0;
                        const activeConcentration =
                          rowItem.data.concentration || 0;
                        const diff = calculateDifference(
                          refConcentration,
                          activeConcentration
                        );

                        return (
                          <TableRowContainer
                            key={`expanded-${ingredientName}-${index}`}
                          >
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "12px",
                              }}
                            >
                              <span style={{ fontSize: "13px" }}>
                                {refConcentration.toFixed(1)}%
                              </span>
                              {diff && (
                                <span
                                  style={{
                                    marginLeft: "4px",
                                    fontSize: "11px",
                                    color:
                                      diff.type === "positive"
                                        ? "#10b981"
                                        : "#ef4444",
                                  }}
                                >
                                  ({diff.text})
                                </span>
                              )}
                            </div>
                          </TableRowContainer>
                        );
                      }

                      // Handle regular ingredients
                      if (rowItem.type === "ingredient") {
                        const ingredientName = rowItem.data.ingredient?.name;
                        if (!ingredientName) return null;

                        const refIngredient = findReferenceIngredient(
                          ingredientName,
                          formula.metadata?.id
                        );
                        const refConcentration =
                          refIngredient?.concentration || 0;
                        const activeConcentration =
                          rowItem.data.concentration || 0;

                        const diff =
                          refIngredient && refConcentration
                            ? calculateDifference(
                                refConcentration,
                                activeConcentration
                              )
                            : null;

                        return (
                          <TableRowContainer
                            key={`ingredient-${ingredientName}-${index}`}
                          >
                            <div style={{ flex: 1 }}>
                              {refIngredient ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <span>{refConcentration}%</span>
                                  {diff && (
                                    <DiffIndicator
                                      type={
                                        diff.type as
                                          | "positive"
                                          | "negative"
                                          | "neutral"
                                          | "new"
                                      }
                                      style={{
                                        fontSize: "11px",
                                        padding: "2px 4px",
                                      }}
                                    >
                                      {diff.text}
                                    </DiffIndicator>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: "#9ca3af" }}>—</span>
                              )}
                            </div>
                          </TableRowContainer>
                        );
                      }

                      return null;
                    })}
                  </TableContainer>
                </div>
              );
            })}
          </div>
        )}
      </GroupedColumn>

      {/* Formula Search Modal */}
      <FormulaSearchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSingleSelect}
        onSelectMultiple={handleMultipleSelect}
        formulas={sortedLibraryFormulas}
        selectedFormulas={referenceFormulas}
        excludedFormulas={getExcludedFormulas()} // Pass excluded formulas
        title="Add Reference Formulas"
        allowMultiSelect={true}
      />
    </>
  );
};

export default ReferenceFormulaColumn;
