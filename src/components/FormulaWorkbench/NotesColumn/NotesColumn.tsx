import React from "react";
import { Icon } from "../../icons";
import { CollapsibleColumnProps } from "../types";
import { mockIngredients } from "../../../data/mockData";
import {
  GroupedColumn,
  CollapsibleColumnHeader,
  CollapsedColumnHeader,
  EmptyState,
  Badge,
  CollapseButton,
  TableRowContainer,
} from "../styles";

interface NotesColumnProps extends CollapsibleColumnProps {
  activeIngredients: any[];
  referenceFormulas: any[];
  notes: { [id: string]: string };
  unifiedRowOrder?: any[];
  onNotesChange: (ingredientId: string, value: string) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const NotesColumn: React.FC<NotesColumnProps> = ({
  activeIngredients,
  referenceFormulas,
  notes,
  unifiedRowOrder,
  onNotesChange,
  isCollapsed,
  onToggle,
  title,
  onDragStart,
  onDragEnd,
}) => {
  // Create unified row list - use unified order if provided, otherwise calculate
  const getAllRowItems = () => {
    // If unified row order is provided from FormulaCanvas, use it directly
    if (unifiedRowOrder && unifiedRowOrder.length > 0) {
      return unifiedRowOrder;
    }

    // Fallback to original logic if no unified order provided
    const rowItems: Array<{
      type: "ingredient" | "formulaGroup" | "expandedIngredient" | "blank";
      data: any;
    }> = [];
    const activeIngredientMap = new Map<string, any>();

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
            formulaGroup.ingredients.forEach((groupIngredient: any) => {
              if (
                groupIngredient.ingredient &&
                groupIngredient.ingredient.name
              ) {
                activeIngredientMap.set(
                  groupIngredient.ingredient.name,
                  groupIngredient
                );
                rowItems.push({
                  type: "expandedIngredient",
                  data: {
                    ...groupIngredient,
                    isMissing: false,
                  },
                });
              }
            });
          } else if (
            formulaGroup.ingredients &&
            Array.isArray(formulaGroup.ingredients)
          ) {
            // When collapsed, still track the ingredients in the map to prevent duplication
            // but don't add them as separate rows
            formulaGroup.ingredients.forEach((groupIngredient: any) => {
              if (
                groupIngredient.ingredient &&
                groupIngredient.ingredient.name
              ) {
                activeIngredientMap.set(
                  groupIngredient.ingredient.name,
                  groupIngredient
                );
              }
            });
          }
        } else {
          // Regular ingredient - use exact order from activeIngredients
          if (item.ingredient && item.ingredient.name) {
            activeIngredientMap.set(item.ingredient.name, item);
            rowItems.push({
              type: "ingredient",
              data: {
                ...item,
                isMissing: false,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error processing active ingredient:", error, item);
      }
    });

    // Add missing ingredients from reference formulas
    const processedIngredients = new Set<string>();

    // Mark ingredients that are already processed
    rowItems.forEach((rowItem) => {
      if (
        rowItem.type === "ingredient" ||
        rowItem.type === "expandedIngredient"
      ) {
        if (rowItem.data.ingredient && rowItem.data.ingredient.name) {
          processedIngredients.add(rowItem.data.ingredient.name);
        }
      }
    });

    referenceFormulas.forEach((formula) => {
      try {
        if (formula.ingredients && Array.isArray(formula.ingredients)) {
          formula.ingredients.forEach((ing: any) => {
            try {
              if (
                ing.concentration &&
                ing.concentration > 0 &&
                ing.ingredientName &&
                !processedIngredients.has(ing.ingredientName)
              ) {
                // Create missing ingredient entry
                const ingredient = mockIngredients.find(
                  (mockIng) => mockIng.name === ing.ingredientName
                );
                rowItems.push({
                  type: "ingredient",
                  data: {
                    id: `missing-${ing.ingredientName}`,
                    ingredient: ingredient || {
                      id: `unknown-${ing.ingredientName}`,
                      name: ing.ingredientName,
                    },
                    concentration: 0,
                    quantity: 0,
                    isMissing: true,
                  },
                });
                processedIngredients.add(ing.ingredientName);
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
        console.error("Error processing reference formula:", error, formula);
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
  if (isCollapsed) {
    return (
      <GroupedColumn $collapsed>
        <CollapsedColumnHeader $variant="notes">
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
            {title}
          </span>
        </CollapsedColumnHeader>
      </GroupedColumn>
    );
  }

  return (
    <GroupedColumn>
      <CollapsibleColumnHeader $variant="notes">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {onDragStart && (
            <div
              style={{
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
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
          <h3>{title}</h3>
          <Badge>Per ingredient</Badge>
        </div>
        <CollapseButton onClick={onToggle}>
          <Icon name="collapse" size="sm" />
        </CollapseButton>
      </CollapsibleColumnHeader>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          height: "100%",
        }}
      >
        {/* Sub-header to match other columns */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            minHeight: "48px",
          }}
        >
          <strong style={{ fontSize: "14px" }}>Comments</strong>
        </div>

        {/* Notes content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
            height: "100%",
          }}
        >
          {allRowItems.map((rowItem, index) => {
            // Handle formula group header row
            if (rowItem.type === "formulaGroup") {
              return (
                <TableRowContainer
                  key={`formula-group-${rowItem.data.id}`}
                  style={{
                    backgroundColor: "#f8fafc",
                    color: "#6b7280",
                    fontStyle: "italic",
                    fontWeight: "600",
                    fontSize: "13px",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                  }}
                >
                  <span>{rowItem.data.formulaName}</span>
                </TableRowContainer>
              );
            }

            // Handle blank rows (for Add Ingredient button alignment)
            if (rowItem.type === "blank") {
              return (
                <TableRowContainer
                  key={`blank-${index}`}
                  style={{
                    minHeight: "48px",
                    backgroundColor: "transparent",
                  }}
                >
                  {/* Empty row to align with Add Ingredient button in ActiveFormulaColumn */}
                </TableRowContainer>
              );
            }

            // Handle regular and expanded ingredients
            const item = rowItem.data;

            return (
              <TableRowContainer
                key={item.id}
                style={{
                  backgroundColor: item.isMissing ? "#fef3f2" : "transparent",
                }}
              >
                <input
                  type="text"
                  value={notes[item.ingredient.id] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onNotesChange(item.ingredient.id, e.target.value)
                  }
                  placeholder={
                    item.isMissing ? "Add note (missing)..." : "Add note..."
                  }
                  disabled={item.isMissing}
                  style={{
                    width: "100%",
                    padding: "4px 8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px" /* Consistent with FONT_SIZES.base */,
                    backgroundColor: item.isMissing ? "#f9fafb" : "white",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    cursor: item.isMissing ? "not-allowed" : "text",
                    height: "36px",
                  }}
                  onFocus={(e) => {
                    if (!item.isMissing) {
                      e.target.style.borderColor = "#3b82f6";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                  }}
                />
              </TableRowContainer>
            );
          })}

          {allRowItems.length === 0 && (
            <TableRowContainer>
              <EmptyState>No ingredients to add notes to</EmptyState>
            </TableRowContainer>
          )}
        </div>
      </div>
    </GroupedColumn>
  );
};

export default NotesColumn;
