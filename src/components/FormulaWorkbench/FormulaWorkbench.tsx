import React, { useState, useMemo } from "react";
import { useFormula } from "../../context/FormulaContext";
import { mockIngredients } from "../../data/mockData";
import { Ingredient } from "../../models/Ingredient";
import { FormulaSummary, AttributeColumn } from "./types";
import LibraryPanel from "./LibraryPanel/LibraryPanel";
import FormulaCanvas from "./FormulaCanvas/FormulaCanvas";
import { WorkbenchContainer } from "./styles";

const FormulaWorkbench: React.FC = () => {
  const {
    activeIngredients,
    referenceFormulas,
    libraryFormulas,
    updateIngredient,
    removeIngredient,
    addIngredient,
    addReferenceFormula,
    removeReferenceFormula,
    replaceFormula,
    replaceWithReferenceFormula,
    formulaSummary: contextFormulaSummary,
    batchSize,
    setBatchSize,
    canUndo,
    undoLastAction,
  } = useFormula();

  const [libraryPanelCollapsed, setLibraryPanelCollapsed] = useState(false);
  const [notes, setNotes] = useState<{ [ingredientId: string]: string }>({});
  const [attributeColumns, setAttributeColumns] = useState<AttributeColumn[]>(
    []
  );
  // Start empty - user adds attributes as needed

  // Get ingredients already in active formula
  const activeIngredientIds = useMemo(() => {
    const ids = new Set<string>();

    activeIngredients.forEach((item) => {
      if ("type" in item && item.type === "formulaGroup") {
        // For formula groups, add all ingredient IDs from within the group
        item.ingredients.forEach((ingredient) => {
          ids.add(ingredient.ingredient.id);
        });
      } else {
        // For regular ingredients
        const formulaIngredient =
          item as import("../../models/Formula").FormulaIngredient;
        ids.add(formulaIngredient.ingredient.id);
      }
    });

    return ids;
  }, [activeIngredients]);

  // Enhanced formula summary with compliance status
  const formulaSummary: FormulaSummary = useMemo(
    () => ({
      ...contextFormulaSummary,
      complianceStatus: "pending" as const, // This would come from backend
      batchSize,
      batchUnit: "ml" as const,
    }),
    [contextFormulaSummary, batchSize]
  );

  const handleAddIngredient = (ingredient: Ingredient) => {
    addIngredient(ingredient);
  };

  const handleReplaceFormula = (formula: any) => {
    const formulaIngredients = formula.ingredients.map((ing: any) => {
      // Try to find ingredient by exact name match first
      let matchedIngredient = mockIngredients.find(
        (i) => i.name === ing.ingredientName
      );

      // If no exact match, try case-insensitive search
      if (!matchedIngredient) {
        matchedIngredient = mockIngredients.find(
          (i) => i.name.toLowerCase() === ing.ingredientName.toLowerCase()
        );
      }

      // If still no match, try partial name matching
      if (!matchedIngredient) {
        matchedIngredient = mockIngredients.find(
          (i) =>
            i.name.toLowerCase().includes(ing.ingredientName.toLowerCase()) ||
            ing.ingredientName.toLowerCase().includes(i.name.toLowerCase())
        );
      }

      // Log warning if no ingredient found
      if (!matchedIngredient) {
        console.warn(`Could not find ingredient for: ${ing.ingredientName}`);
        console.warn(
          "Available ingredients:",
          mockIngredients.map((i) => i.name)
        );
        // Use first ingredient as fallback but ensure it has all required properties
        matchedIngredient = mockIngredients[0];
      }

      return {
        id: `FI-REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ingredient: matchedIngredient,
        concentration: ing.concentration,
        quantity: (ing.concentration * batchSize) / 100,
        unit: "ml" as const,
      };
    });
    replaceFormula(formulaIngredients);
  };

  const handleMergeFormula = (formula: any) => {
    // Merge formula ingredients with active formula
    formula.ingredients.forEach((ing: any) => {
      const existingIngredient = activeIngredients.find((item) => {
        // Only check regular ingredients, not formula groups
        if ("type" in item && item.type === "formulaGroup") {
          return false;
        }
        const formulaIngredient =
          item as import("../../models/Formula").FormulaIngredient;
        return formulaIngredient.ingredient.name === ing.ingredientName;
      });

      if (existingIngredient) {
        // If ingredient already exists, add the concentrations together
        const formulaIngredient =
          existingIngredient as import("../../models/Formula").FormulaIngredient;
        const newConcentration =
          formulaIngredient.concentration + ing.concentration;
        const newQuantity = (newConcentration * batchSize) / 100;

        updateIngredient(formulaIngredient.id, {
          concentration: newConcentration,
          quantity: newQuantity,
        });
      } else {
        // If ingredient doesn't exist, add it as a new ingredient
        // Try to find ingredient by exact name match first
        let matchedIngredient = mockIngredients.find(
          (i) => i.name === ing.ingredientName
        );

        // If no exact match, try case-insensitive search
        if (!matchedIngredient) {
          matchedIngredient = mockIngredients.find(
            (i) => i.name.toLowerCase() === ing.ingredientName.toLowerCase()
          );
        }

        // If still no match, try partial name matching
        if (!matchedIngredient) {
          matchedIngredient = mockIngredients.find(
            (i) =>
              i.name.toLowerCase().includes(ing.ingredientName.toLowerCase()) ||
              ing.ingredientName.toLowerCase().includes(i.name.toLowerCase())
          );
        }

        if (matchedIngredient) {
          addIngredient(matchedIngredient);
        } else {
          console.warn(
            `Could not find ingredient for merge: ${ing.ingredientName}`
          );
        }
      }
    });
  };

  const handleMergeWithActiveFormula = (formulaId: string) => {
    const formula = referenceFormulas.find(
      (f: any) => f.metadata?.id === formulaId
    );
    if (formula) {
      handleMergeFormula(formula);
    }
  };

  const handleCompareFormula = (formula: any) => {
    const isAlreadyAdded = referenceFormulas.some(
      (ref) => ref.metadata?.id === formula.metadata?.id
    );

    if (!isAlreadyAdded) {
      addReferenceFormula(formula);
    }
  };

  const handleAddMultipleFormulas = (formulas: any[]) => {
    formulas.forEach((formula) => {
      const isAlreadyAdded = referenceFormulas.some(
        (ref) => ref.metadata?.id === formula.metadata?.id
      );

      if (!isAlreadyAdded) {
        addReferenceFormula(formula);
      }
    });
  };

  const handleNotesChange = (ingredientId: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [ingredientId]: value,
    }));
  };

  const handleAddAttribute = (attribute: {
    name: string;
    type: "text" | "number";
    unit?: string;
  }) => {
    const newAttribute: AttributeColumn = {
      id: Date.now().toString(),
      name: attribute.name,
      type: attribute.type,
      unit: attribute.unit,
    };
    setAttributeColumns((prev) => [...prev, newAttribute]);
  };

  const handleAddMultipleAttributes = (
    attributes: {
      name: string;
      type: "text" | "number";
      unit?: string;
    }[]
  ) => {
    const newAttributes: AttributeColumn[] = attributes.map(
      (attribute, index) => ({
        id: (Date.now() + index).toString(),
        name: attribute.name,
        type: attribute.type,
        unit: attribute.unit,
      })
    );
    setAttributeColumns((prev) => [...prev, ...newAttributes]);
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setAttributeColumns((prev) =>
      prev.filter((attr) => attr.id !== attributeId)
    );
  };

  const handleDeleteAllReferenceFormulas = () => {
    // Remove all reference formulas
    referenceFormulas.forEach((formula) => {
      removeReferenceFormula(formula.metadata?.id);
    });
  };

  const handleDeleteAllAttributes = () => {
    // Clear all attributes
    setAttributeColumns([]);
  };

  return (
    <WorkbenchContainer>
      <LibraryPanel
        isCollapsed={libraryPanelCollapsed}
        onToggle={() => setLibraryPanelCollapsed(!libraryPanelCollapsed)}
        activeIngredientIds={activeIngredientIds}
        referenceFormulas={libraryFormulas}
        selectedReferenceFormulas={referenceFormulas}
        onAddIngredient={handleAddIngredient}
        onReplaceFormula={handleReplaceFormula}
        onMergeFormula={handleMergeFormula}
        onCompareFormula={handleCompareFormula}
        onAddMultipleFormulas={handleAddMultipleFormulas}
      />

      <FormulaCanvas
        activeIngredients={activeIngredients}
        referenceFormulas={referenceFormulas}
        libraryFormulas={libraryFormulas}
        formulaSummary={formulaSummary}
        notes={notes}
        attributeColumns={attributeColumns}
        batchSize={batchSize}
        canUndo={canUndo}
        onUpdateIngredient={updateIngredient}
        onRemoveIngredient={removeIngredient}
        onAddIngredient={handleAddIngredient}
        onRemoveReferenceFormula={removeReferenceFormula}
        onAddReferenceFormula={addReferenceFormula}
        onAddMultipleReferenceFormulas={handleAddMultipleFormulas}
        onReplaceActiveFormula={replaceWithReferenceFormula}
        onMergeWithActiveFormula={handleMergeWithActiveFormula}
        onDeleteAllReferenceFormulas={handleDeleteAllReferenceFormulas}
        onUpdateBatchSize={setBatchSize}
        onNotesChange={handleNotesChange}
        onUndo={undoLastAction}
        onAddAttribute={handleAddAttribute}
        onAddMultipleAttributes={handleAddMultipleAttributes}
        onRemoveAttribute={handleRemoveAttribute}
        onDeleteAllAttributes={handleDeleteAllAttributes}
      />
    </WorkbenchContainer>
  );
};

export default FormulaWorkbench;
