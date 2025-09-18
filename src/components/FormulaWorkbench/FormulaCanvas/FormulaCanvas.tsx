import React, { useState } from "react";
import { Icon } from "../../icons";
import { FormulaSummary, AttributeColumn } from "../types";
import ActiveFormulaColumn from "../ActiveFormulaColumn/ActiveFormulaColumn";
import ReferenceFormulaColumn from "../ReferenceFormulaColumn/ReferenceFormulaColumn";
import AttributesColumn from "../AttributesColumn/AttributesColumn";
import NotesColumn from "../NotesColumn/NotesColumn";
import {
  FormulaCanvasContainer,
  CombinedCanvasHeader,
  CanvasHeaderLeft,
  CanvasHeaderRight,
  SummaryItemsContainer,
  CompactSummaryItem,
  CompactSummaryLabel,
  CompactSummaryValue,
  GroupedColumnsContainer,
  SimpleBatchInput,
} from "../styles";

interface FormulaCanvasProps {
  activeIngredients: any[];
  referenceFormulas: any[];
  libraryFormulas: any[];
  formulaSummary: FormulaSummary;
  notes: { [id: string]: string };
  attributeColumns: AttributeColumn[];
  batchSize: number;
  canUndo?: boolean;
  onUpdateIngredient: (id: string, updates: any) => void;
  onRemoveIngredient: (id: string) => void;
  onAddIngredient: (ingredient: any) => void;
  onRemoveReferenceFormula: (id: string) => void;
  onAddReferenceFormula: (formula: any) => void;
  onAddMultipleReferenceFormulas?: (formulas: any[]) => void; // New prop
  onReplaceActiveFormula: (formulaId: string) => void; // New prop for replacing active formula
  onMergeWithActiveFormula?: (formulaId: string) => void; // New prop for merging with active formula
  onDeleteAllReferenceFormulas?: () => void; // New prop for deleting all formulas
  onUpdateBatchSize: (size: number) => void;
  onNotesChange: (ingredientId: string, value: string) => void;
  onUndo?: () => void;
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
  onDeleteAllAttributes?: () => void; // New prop for deleting all attributes
}

const FormulaCanvas: React.FC<FormulaCanvasProps> = ({
  activeIngredients,
  referenceFormulas,
  libraryFormulas,
  formulaSummary,
  notes,
  attributeColumns,
  batchSize,
  canUndo,
  onUpdateIngredient,
  onRemoveIngredient,
  onAddIngredient,
  onRemoveReferenceFormula,
  onAddReferenceFormula,
  onAddMultipleReferenceFormulas,
  onReplaceActiveFormula,
  onMergeWithActiveFormula,
  onDeleteAllReferenceFormulas,
  onUpdateBatchSize,
  onNotesChange,
  onUndo,
  onAddAttribute,
  onAddMultipleAttributes,
  onRemoveAttribute,
  onDeleteAllAttributes,
}) => {
  const [referenceColumnCollapsed, setReferenceColumnCollapsed] =
    useState(false);
  const [attributesColumnCollapsed, setAttributesColumnCollapsed] =
    useState(true);
  const [notesColumnCollapsed, setNotesColumnCollapsed] = useState(true);

  // Column ordering - now dynamic and reorderable
  const [columnOrder, setColumnOrder] = useState([
    "reference",
    "attributes",
    "notes",
  ]);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );

  // Generate unified row order that all columns will use
  // This ensures perfect synchronization across all panels
  // Order: 1) Directly added ingredients, 2) Formula groups (with expanded ingredients), 3) Missing ingredients
  const getUnifiedRowOrder = () => {
    const rowItems: Array<{
      type: "ingredient" | "formulaGroup" | "expandedIngredient" | "blank";
      data: any;
    }> = [];

    // Track ingredients that are already present in active formula
    const activeIngredientNames = new Set<string>();
    const formulaGroupIngredientNames = new Set<string>();
    const processedMissingIngredients = new Set<string>();

    // Step 1: Process active ingredients and separate regular ingredients from formula groups
    const regularIngredients: any[] = [];
    const formulaGroups: any[] = [];

    activeIngredients.forEach((item, index) => {
      try {
        if ("type" in item && item.type === "formulaGroup") {
          formulaGroups.push({ ...item, originalIndex: index });

          // Track ingredients in formula groups (even if collapsed)
          if (item.ingredients && Array.isArray(item.ingredients)) {
            item.ingredients.forEach((groupIngredient: any) => {
              if (groupIngredient.ingredient?.name) {
                formulaGroupIngredientNames.add(
                  groupIngredient.ingredient.name
                );
              }
            });
          }
        } else {
          // Regular ingredient - preserve the order they were added
          regularIngredients.push({ ...item, originalIndex: index });
          if (item.ingredient?.name) {
            activeIngredientNames.add(item.ingredient.name);
          }
        }
      } catch (error) {
        console.error("Error processing active ingredient:", error);
      }
    });

    // Step 2: Add DIRECTLY ADDED ingredients first (maintain order of addition)
    // These are ingredients added via Library Panel > Ingredients or via 'Add Ingredient' button
    regularIngredients
      .sort((a, b) => a.originalIndex - b.originalIndex) // Maintain original order
      .forEach((item) => {
        rowItems.push({
          type: "ingredient",
          data: item,
        });
      });

    // Step 3: Add FORMULA GROUPS second (maintain order of addition)
    formulaGroups
      .sort((a, b) => a.originalIndex - b.originalIndex) // Maintain original order
      .forEach((formulaGroup) => {
        // Add formula group header row
        rowItems.push({
          type: "formulaGroup",
          data: formulaGroup,
        });

        // Add expanded ingredients if the group is expanded
        if (
          formulaGroup.isExpanded &&
          formulaGroup.ingredients &&
          Array.isArray(formulaGroup.ingredients)
        ) {
          formulaGroup.ingredients.forEach((groupIngredient: any) => {
            if (groupIngredient.ingredient?.name) {
              rowItems.push({
                type: "expandedIngredient",
                data: groupIngredient,
              });
            }
          });
        }
      });

    // Step 4: Add MISSING INGREDIENTS last (from reference formulas)
    // These are ingredients that exist in reference formulas but are NOT in active ingredients
    // AND are NOT in any formula groups (even collapsed ones)
    const missingIngredients: Array<{ name: string; data: any }> = [];

    referenceFormulas.forEach((refFormula) => {
      if (refFormula.ingredients && Array.isArray(refFormula.ingredients)) {
        refFormula.ingredients.forEach((ing: any) => {
          const ingredientName = ing.ingredientName;

          if (
            ingredientName &&
            ing.concentration &&
            ing.concentration > 0 &&
            !activeIngredientNames.has(ingredientName) && // Not in regular active ingredients
            !formulaGroupIngredientNames.has(ingredientName) && // Not in any formula group
            !processedMissingIngredients.has(ingredientName) // Avoid duplicates
          ) {
            processedMissingIngredients.add(ingredientName);

            missingIngredients.push({
              name: ingredientName,
              data: {
                id: `missing-${ingredientName}-${Date.now()}`,
                ingredient: {
                  name: ingredientName,
                  // Try to find the full ingredient data from mockIngredients if available
                  id: `missing-${ingredientName}`,
                  category: "Unknown",
                  defaultConcentration: 1.0,
                  costPerKg: 0,
                  attributes: {},
                },
                concentration: 0, // Not in active formula yet
                amount: 0,
                isMissing: true, // Mark as missing so ActiveFormulaColumn shows "add" button
              },
            });
          }
        });
      }
    });

    // Add missing ingredients sorted alphabetically for consistent display
    missingIngredients
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((missingIng) => {
        rowItems.push({
          type: "ingredient",
          data: missingIng.data,
        });
      });

    // Step 5: Add blank row for "Add Ingredient" button
    rowItems.push({
      type: "blank",
      data: null,
    });

    return rowItems;
  };

  const unifiedRowOrder = getUnifiedRowOrder();

  // Handle column reordering
  const handleColumnDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColumnIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedColumnIndex === null || draggedColumnIndex === dropIndex) {
      setDraggedColumnIndex(null);
      return;
    }

    const newOrder = [...columnOrder];
    const [draggedColumn] = newOrder.splice(draggedColumnIndex, 1);
    newOrder.splice(dropIndex, 0, draggedColumn);
    setColumnOrder(newOrder);
    setDraggedColumnIndex(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnIndex(null);
  };

  const renderColumn = (columnType: string, index: number) => {
    const dragProps = {
      onDragStart: (e: React.DragEvent) => handleColumnDragStart(e, index),
      onDragEnd: handleColumnDragEnd,
    };

    switch (columnType) {
      case "reference":
        return (
          <ReferenceFormulaColumn
            key="reference"
            title="Reference Formula"
            activeIngredients={activeIngredients}
            referenceFormulas={referenceFormulas}
            libraryFormulas={libraryFormulas}
            unifiedRowOrder={unifiedRowOrder}
            isCollapsed={referenceColumnCollapsed}
            onToggle={() =>
              setReferenceColumnCollapsed(!referenceColumnCollapsed)
            }
            onRemoveFormula={onRemoveReferenceFormula}
            onAddFormula={onAddReferenceFormula}
            onAddMultipleFormulas={onAddMultipleReferenceFormulas}
            onReplaceActiveFormula={onReplaceActiveFormula}
            onMergeWithActiveFormula={onMergeWithActiveFormula}
            onDeleteAllFormulas={onDeleteAllReferenceFormulas}
            onDragStart={dragProps.onDragStart}
            onDragEnd={dragProps.onDragEnd}
          />
        );
      case "attributes":
        return (
          <AttributesColumn
            key="attributes"
            title="Attributes"
            activeIngredients={activeIngredients}
            referenceFormulas={referenceFormulas}
            attributeColumns={attributeColumns}
            unifiedRowOrder={unifiedRowOrder}
            isCollapsed={attributesColumnCollapsed}
            onToggle={() =>
              setAttributesColumnCollapsed(!attributesColumnCollapsed)
            }
            onAddAttribute={onAddAttribute}
            onAddMultipleAttributes={onAddMultipleAttributes}
            onRemoveAttribute={onRemoveAttribute}
            onDeleteAllAttributes={onDeleteAllAttributes}
            onDragStart={dragProps.onDragStart}
            onDragEnd={dragProps.onDragEnd}
          />
        );
      case "notes":
        return (
          <NotesColumn
            key="notes"
            title="Notes & Comments"
            activeIngredients={activeIngredients}
            referenceFormulas={referenceFormulas}
            notes={notes}
            unifiedRowOrder={unifiedRowOrder}
            onNotesChange={onNotesChange}
            isCollapsed={notesColumnCollapsed}
            onToggle={() => setNotesColumnCollapsed(!notesColumnCollapsed)}
            onDragStart={dragProps.onDragStart}
            onDragEnd={dragProps.onDragEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormulaCanvasContainer>
      <CombinedCanvasHeader>
        <CanvasHeaderLeft>
          <SummaryItemsContainer>
            <CompactSummaryItem>
              <CompactSummaryLabel>Amount</CompactSummaryLabel>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon
                  name="balanceScale"
                  size="base"
                  style={{ color: "#3b82f6" }}
                />
                <CompactSummaryValue style={{ color: "#3b82f6" }}>
                  {formulaSummary.totalWeight.toFixed(1)}g
                </CompactSummaryValue>
              </div>
            </CompactSummaryItem>

            <CompactSummaryItem>
              <CompactSummaryLabel>Cost</CompactSummaryLabel>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon
                  name="euroSign"
                  size="base"
                  style={{ color: "#059669" }}
                />
                <CompactSummaryValue style={{ color: "#059669" }}>
                  {formulaSummary.totalCost.toFixed(2)}
                </CompactSummaryValue>
              </div>
            </CompactSummaryItem>

            <CompactSummaryItem>
              <CompactSummaryLabel>Components</CompactSummaryLabel>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="formula" size="base" style={{ color: "#7c3aed" }} />
                <CompactSummaryValue style={{ color: "#7c3aed" }}>
                  {formulaSummary.ingredientCount}
                </CompactSummaryValue>
              </div>
            </CompactSummaryItem>

            <CompactSummaryItem>
              <CompactSummaryLabel>Batch Size</CompactSummaryLabel>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon
                  name="calculator"
                  size="base"
                  style={{ color: "#8b5cf6" }}
                />
                <SimpleBatchInput
                  type="number"
                  value={batchSize}
                  onChange={(e) =>
                    onUpdateBatchSize(parseFloat(e.target.value) || 1)
                  }
                  min="0.1"
                  step="0.1"
                />
              </div>
            </CompactSummaryItem>

            <CompactSummaryItem>
              <CompactSummaryLabel>Compliance</CompactSummaryLabel>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="warning" size="base" style={{ color: "#f59e0b" }} />
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    lineHeight: "1",
                    backgroundColor:
                      formulaSummary.complianceStatus === "compliant"
                        ? "#dcfce7"
                        : formulaSummary.complianceStatus === "pending"
                          ? "#fef3c7"
                          : formulaSummary.complianceStatus === "non-compliant"
                            ? "#fee2e2"
                            : "#f3f4f6",
                    color:
                      formulaSummary.complianceStatus === "compliant"
                        ? "#166534"
                        : formulaSummary.complianceStatus === "pending"
                          ? "#92400e"
                          : formulaSummary.complianceStatus === "non-compliant"
                            ? "#991b1b"
                            : "#374151",
                  }}
                >
                  {formulaSummary.complianceStatus}
                </span>
              </div>
            </CompactSummaryItem>
          </SummaryItemsContainer>
        </CanvasHeaderLeft>

        <CanvasHeaderRight>
          {/*
          <CanvasTitle>Formula Canvas</CanvasTitle>
           <ActionButtons>
            <IconButton onClick={handleExport} title="Export for compounding">
              <Icon name="upload" size="sm" />
            </IconButton>
            <IconButton onClick={handleSave} title="Save formula">
              <Icon name="save" size="sm" />
            </IconButton>
          </ActionButtons>
          */}
        </CanvasHeaderRight>
      </CombinedCanvasHeader>

      <GroupedColumnsContainer>
        {/* Active Formula Column - Always first */}
        <ActiveFormulaColumn
          ingredients={activeIngredients}
          referenceFormulas={referenceFormulas}
          unifiedRowOrder={unifiedRowOrder}
          onUpdateIngredient={onUpdateIngredient}
          onRemoveIngredient={onRemoveIngredient}
          onAddIngredient={onAddIngredient}
          canUndo={canUndo}
          onUndo={onUndo}
        />

        {/* Reorderable Columns */}
        {columnOrder.map((columnType, index) => (
          <div
            key={columnType}
            style={{
              opacity: draggedColumnIndex === index ? 0.5 : 1,
              transition: "opacity 0.2s ease",
              height: "100%", // Ensure wrapper takes full height
            }}
            onDragOver={handleColumnDragOver}
            onDrop={(e) => handleColumnDrop(e, index)}
          >
            {renderColumn(columnType, index)}
          </div>
        ))}
      </GroupedColumnsContainer>
    </FormulaCanvasContainer>
  );
};

export default FormulaCanvas;
