import React, { useState } from "react";
import { Icon } from "../../icons";
import { CollapsibleColumnProps, AttributeColumn } from "../types";
import { mockIngredients } from "../../../data/mockData";
import AttributeSearchModal from "../modals/AttributeSearchModal";
import {
  GroupedColumn,
  CollapsibleColumnHeader,
  CollapsedColumnHeader,
  TableContainer,
  EmptyState,
  Badge,
  IconButton,
  CollapseButton,
} from "../styles";

interface AttributesColumnProps extends CollapsibleColumnProps {
  activeIngredients: any[];
  referenceFormulas: any[];
  attributeColumns: AttributeColumn[];
  unifiedRowOrder?: any[];
  onAddAttribute: (attribute: {
    name: string;
    type: "text" | "number";
    unit?: string;
  }) => void;
  onAddMultipleAttributes?: (
    attributes: {
      name: string;
      type: "text" | "number";
      unit?: string;
    }[]
  ) => void; // New prop for multi-selection
  onRemoveAttribute: (attributeId: string) => void;
  onDeleteAllAttributes?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const AttributesColumn: React.FC<AttributesColumnProps> = ({
  activeIngredients,
  referenceFormulas,
  attributeColumns,
  unifiedRowOrder,
  isCollapsed,
  onToggle,
  onAddAttribute,
  onAddMultipleAttributes,
  onRemoveAttribute,
  onDeleteAllAttributes,
  onDragStart,
  onDragEnd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          const formulaIngredient = item as any;
          if (
            formulaIngredient.ingredient &&
            formulaIngredient.ingredient.name
          ) {
            activeIngredientMap.set(
              formulaIngredient.ingredient.name,
              formulaIngredient
            );
            rowItems.push({
              type: "ingredient",
              data: {
                ...formulaIngredient,
                isMissing: false,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error processing active ingredient:", error, item);
      }
    });

    // Add missing ingredients from reference formulas that aren't in active or formula groups
    const processedIngredients = new Set<string>();

    // Track all ingredients we've already processed
    activeIngredientMap.forEach((_, ingredientName) => {
      processedIngredients.add(ingredientName);
    });

    // Add missing ingredients from reference formulas in consistent order
    referenceFormulas.forEach((formula) => {
      formula.ingredients.forEach((ing: any) => {
        if (
          ing.concentration &&
          ing.concentration > 0 &&
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
                attributes: {},
              },
              concentration: 0,
              quantity: 0,
              isMissing: true,
            },
          });
          processedIngredients.add(ing.ingredientName);
        }
      });
    });

    // Add a blank row to correspond to the "Add Ingredient" button or inline search row in ActiveFormulaColumn
    rowItems.push({
      type: "blank",
      data: null,
    });

    return rowItems;
  };

  const allRowItems = getAllRowItems();

  const handleAddAttribute = () => {
    setIsModalOpen(true);
  };

  const handleSelectAttribute = (attribute: {
    name: string;
    type: "text" | "number";
    unit?: string;
  }) => {
    onAddAttribute(attribute);
    setIsModalOpen(false);
  };

  const handleSelectMultipleAttributes = (
    attributes: {
      name: string;
      type: "text" | "number";
      unit?: string;
    }[]
  ) => {
    if (onAddMultipleAttributes) {
      onAddMultipleAttributes(attributes);
    } else {
      // Fallback: add one by one
      attributes.forEach((attr) => onAddAttribute(attr));
    }
    setIsModalOpen(false);
  };

  if (isCollapsed) {
    return (
      <GroupedColumn $collapsed>
        <CollapsedColumnHeader $variant="attributes">
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
            Attributes
          </span>
        </CollapsedColumnHeader>
      </GroupedColumn>
    );
  }

  return (
    <>
      <GroupedColumn>
        <CollapsibleColumnHeader $variant="attributes">
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
              Reference Attributes
            </h3>
            <Badge>{attributeColumns.length} attrs</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconButton
              onClick={handleAddAttribute}
              title="Search & Add Attributes"
            >
              <Icon name="add" size="sm" />
            </IconButton>
            {attributeColumns.length > 0 && onDeleteAllAttributes && (
              <IconButton
                onClick={onDeleteAllAttributes}
                title="Delete All Attributes"
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

        {attributeColumns.length === 0 ? (
          <EmptyState>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Icon
                name="add"
                size="lg"
                style={{ color: "#9ca3af", marginBottom: "8px" }}
              />
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                No attributes selected
              </p>
              <button
                onClick={handleAddAttribute}
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
                Add Reference Attribute
              </button>
            </div>
          </EmptyState>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              flex: 1,
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              minWidth: 0,
            }}
          >
            {attributeColumns.map((attribute) => (
              <div
                key={attribute.id}
                style={{
                  minWidth: "150px",
                  maxWidth: "200px",
                  flexShrink: 0,
                  width: "150px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "14px",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={`${attribute.name}${attribute.unit ? ` (${attribute.unit})` : ""}`}
                  >
                    {attribute.name}
                    {attribute.unit && (
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {" "}
                        ({attribute.unit})
                      </span>
                    )}
                  </strong>
                  <IconButton
                    onClick={() => onRemoveAttribute(attribute.id)}
                    title="Remove attribute"
                  >
                    <Icon name="close" size="xs" />
                  </IconButton>
                </div>

                <TableContainer>
                  {allRowItems.map((rowItem, index) => {
                    // Handle formula group header row
                    if (rowItem.type === "formulaGroup") {
                      return (
                        <div
                          key={`formula-group-${rowItem.data.id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderBottom: "1px solid #f3f4f6",
                            fontSize: "13px",
                            minHeight: "48px",
                            backgroundColor: "#f8fafc",
                            color: "#6b7280",
                            fontStyle: "italic",
                            fontWeight: "600",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <span title={rowItem.data.formulaName}>
                              {rowItem.data.formulaName}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Handle blank rows (for Add Ingredient button alignment)
                    if (rowItem.type === "blank") {
                      return (
                        <div
                          key={`blank-${index}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderBottom: "1px solid #f3f4f6",
                            fontSize: "14px",
                            minHeight: "48px",
                            opacity: 1,
                            backgroundColor: "#fafbfc",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            {/* Empty row to align with Add Ingredient button in ActiveFormulaColumn */}
                          </div>
                        </div>
                      );
                    }

                    // Handle regular and expanded ingredients
                    const item = rowItem.data;
                    const attributeValue =
                      (item.ingredient.attributes as any)?.[attribute.name] ||
                      "—";

                    return (
                      <div
                        key={`${item.id}-${index}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderBottom: "1px solid #f3f4f6",
                          fontSize: "14px",
                          minHeight: "48px",
                          opacity: 1,
                          backgroundColor: item.isMissing
                            ? "#fef3f2"
                            : rowItem.type === "expandedIngredient"
                              ? "#fafbfc"
                              : "transparent",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            title={attributeValue?.toString()}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flexShrink: 1,
                              minWidth: 0,
                            }}
                          >
                            {attributeValue}
                          </span>
                          {item.isMissing && (
                            <Icon
                              name="warning"
                              size="sm"
                              style={{
                                color: "#dc2626",
                                fontSize: "12px",
                                flexShrink: 0,
                              }}
                              title="Missing ingredient"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TableContainer>
              </div>
            ))}
          </div>
        )}

        {attributeColumns.length > 0 && allRowItems.length === 0 && (
          <EmptyState>No ingredients to show attributes for</EmptyState>
        )}
      </GroupedColumn>

      <AttributeSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectAttribute}
        onSelectMultiple={handleSelectMultipleAttributes}
        selectedAttributes={attributeColumns}
        title="Add Reference Attribute"
        allowMultiSelect
      />
    </>
  );
};

export default AttributesColumn;
