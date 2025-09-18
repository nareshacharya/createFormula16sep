import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Ingredient } from "../models/Ingredient";
import {
  FormulaIngredient,
  FormulaSummary,
  ActiveFormulaItem,
  FormulaGroup,
} from "../models/Formula";
import { ReferenceFormula, ViewMode } from "../types/ReferenceFormula";
import { mockIngredients, mockReferenceFormulas } from "../data/mockData";

export interface YieldingOptions {
  targetYield: number; // in grams
  targetUnit: "g" | "kg" | "L";
  lossFactor: number; // percentage (0-100)
  rounding: "none" | "0.1g" | "0.01g";
  scope: "active" | "all";
  premixHandling: "preserve" | "flatten";
}

interface FormulaHistoryState {
  activeIngredients: ActiveFormulaItem[];
  batchSize: number;
  timestamp: number;
  action: string;
}

interface FormulaContextType {
  // State
  activeIngredients: ActiveFormulaItem[];
  batchSize: number;
  batchUnit: "ml" | "g";
  leftPanelCollapsed: boolean;
  referenceFormulas: ReferenceFormula[]; // For comparison view only
  libraryFormulas: ReferenceFormula[]; // For main library
  viewMode: ViewMode;

  // Undo functionality
  canUndo: boolean;
  undoHistory: FormulaHistoryState[];

  // Actions
  addIngredient: (ingredient: Ingredient) => void;
  addIngredientsFromFormula: (formula: ReferenceFormula) => void;
  addFormulaGroup: (formula: ReferenceFormula) => void;
  toggleFormulaGroup: (groupId: string) => void;
  expandFormulaGroup: (groupId: string) => void;
  updateIngredient: (id: string, updates: Partial<FormulaIngredient>) => void;
  removeIngredient: (id: string) => void;
  replaceFormula: (ingredients: FormulaIngredient[]) => void;
  replaceWithReferenceFormula: (formulaId: string) => void;
  clearFormula: () => void;
  setBatchSize: (size: number) => void;
  setBatchUnit: (unit: "ml" | "g") => void;
  toggleLeftPanel: () => void;
  addReferenceFormula: (formula: ReferenceFormula) => void;
  removeReferenceFormula: (formulaId: string) => void; // Removes from comparison view only
  setViewMode: (mode: ViewMode) => void;
  undoLastAction: () => void;
  roundOffIngredients: () => void;
  applyYielding: (options: YieldingOptions) => void;

  // Computed values
  formulaSummary: FormulaSummary;
  panelDimensions: {
    leftPanelWidth: number;
    middlePanelMinWidth: number;
  };
}

const FormulaContext = createContext<FormulaContextType | undefined>(undefined);

interface FormulaProviderProps {
  children: ReactNode;
}

export const FormulaProvider: React.FC<FormulaProviderProps> = ({
  children,
}) => {
  // Initialize with empty ingredients array
  const [activeIngredients, setActiveIngredients] = useState<
    ActiveFormulaItem[]
  >([]);
  const [batchSize, setBatchSizeState] = useState(100);
  const [batchUnit, setBatchUnitState] = useState<"ml" | "g">("ml");
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [referenceFormulas, setReferenceFormulas] = useState<
    ReferenceFormula[]
  >([]); // Start empty - user selects formulas to compare
  const [libraryFormulas] = useState<ReferenceFormula[]>(
    mockReferenceFormulas // Full library of formulas
  );
  const [viewMode, setViewModeState] = useState<ViewMode>("matrix");

  // History state for undo functionality
  const [undoHistory, setUndoHistory] = useState<FormulaHistoryState[]>([]);
  const maxHistorySize = 10; // Keep last 10 actions

  // Function to save current state to history
  const saveToHistory = useCallback(
    (action: string) => {
      const historyEntry: FormulaHistoryState = {
        activeIngredients: activeIngredients,
        batchSize: batchSize,
        timestamp: Date.now(),
        action: action,
      };

      setUndoHistory((prev) => {
        const newHistory = [historyEntry, ...prev];
        return newHistory.slice(0, maxHistorySize);
      });
    },
    [activeIngredients, batchSize]
  );

  // Computed value for undo availability
  const canUndo = undoHistory.length > 0;

  const addIngredient = useCallback(
    (ingredient: Ingredient) => {
      // Save current state to history before making changes
      saveToHistory(`Add ingredient: ${ingredient.name}`);

      // Check if ingredient already exists in active ingredients
      const existingIngredientIndex = activeIngredients.findIndex((item) => {
        // Only check FormulaIngredient items (not formula groups)
        if ("type" in item && item.type === "formulaGroup") {
          return false;
        }
        const formulaIngredient = item as FormulaIngredient;
        return formulaIngredient.ingredient?.name === ingredient.name;
      });

      if (existingIngredientIndex >= 0) {
        // If ingredient already exists, update its concentration instead of duplicating
        setActiveIngredients((prev) => {
          const updated = [...prev];
          const existingItem = updated[
            existingIngredientIndex
          ] as FormulaIngredient;
          updated[existingIngredientIndex] = {
            ...existingItem,
            concentration: ingredient.defaultConcentration,
            quantity: (ingredient.defaultConcentration * batchSize) / 100,
          };
          return updated;
        });
      } else {
        // Create new ingredient
        const newFormulaIngredient: FormulaIngredient = {
          id: `${ingredient.id}-${Date.now()}`,
          ingredient,
          concentration: ingredient.defaultConcentration,
          quantity: (ingredient.defaultConcentration * batchSize) / 100,
          unit: batchUnit,
        };

        setActiveIngredients((prev) => {
          // IMPORTANT: Maintain order as specified in requirements
          // 1. Directly added ingredients (via Library Panel or Add Ingredient button) should appear at TOP
          // 2. Formula groups should appear AFTER directly added ingredients
          // 3. Missing ingredients appear at BOTTOM (handled by FormulaCanvas)

          // Find the position to insert - should be AFTER the last regular ingredient but BEFORE any formula groups
          const regularIngredients: ActiveFormulaItem[] = [];
          const formulaGroups: ActiveFormulaItem[] = [];

          prev.forEach((item) => {
            if ("type" in item && item.type === "formulaGroup") {
              formulaGroups.push(item);
            } else {
              regularIngredients.push(item);
            }
          });

          // Insert new ingredient at the END of regular ingredients (but before formula groups)
          return [
            ...regularIngredients,
            newFormulaIngredient,
            ...formulaGroups,
          ];
        });
      }
    },
    [batchSize, batchUnit, saveToHistory, activeIngredients]
  );

  const addIngredientsFromFormula = useCallback(
    (formula: ReferenceFormula) => {
      // Save current state to history before making changes
      saveToHistory(`Add ingredients from formula: ${formula.metadata?.name}`);

      // Convert reference formula ingredients to active formula ingredients
      const newFormulaIngredients: FormulaIngredient[] = formula.ingredients
        .filter(
          (refIngredient) =>
            refIngredient.concentration && refIngredient.concentration > 0
        ) // Only include ingredients with concentration
        .map((refIngredient) => {
          // Find the matching ingredient in our library
          const matchingIngredient = mockIngredients.find(
            (ing) => ing.name === refIngredient.ingredientName
          );

          if (!matchingIngredient || !refIngredient.concentration) {
            console.warn(
              `Ingredient "${refIngredient.ingredientName}" not found in library or has no concentration`
            );
            return null;
          }

          return {
            id: `${matchingIngredient.id}-${Date.now()}-${Math.random()}`,
            ingredient: matchingIngredient,
            concentration: refIngredient.concentration,
            quantity: (refIngredient.concentration * batchSize) / 100,
            unit: batchUnit,
          };
        })
        .filter(
          (ingredient): ingredient is FormulaIngredient => ingredient !== null
        );

      // Add the new ingredients to the end of the existing active ingredients
      setActiveIngredients((prev) => [...prev, ...newFormulaIngredients]);
    },
    [batchSize, batchUnit, saveToHistory]
  );

  const addFormulaGroup = useCallback(
    (formula: ReferenceFormula) => {
      // Check if this formula is already added as a reference formula
      const isAlreadyInReference = referenceFormulas.some(
        (refFormula) => refFormula.metadata?.id === formula.metadata?.id
      );

      // Check if this formula is already added as a formula group
      const isAlreadyInActive = activeIngredients.some(
        (item) =>
          "type" in item &&
          item.type === "formulaGroup" &&
          item.formulaId === formula.metadata?.id
      );

      if (isAlreadyInReference) {
        console.warn(
          `Formula "${formula.metadata?.name}" is already added as a reference formula. Skipping duplicate addition.`
        );
        return;
      }

      if (isAlreadyInActive) {
        console.warn(
          `Formula "${formula.metadata?.name}" is already added as a formula group. Skipping duplicate addition.`
        );
        return;
      }

      // Save current state to history before making changes
      saveToHistory(`Add formula group: ${formula.metadata?.name}`);

      // Validate formula structure
      if (!formula.metadata?.id) {
        console.error(`Formula is missing required metadata.id:`, formula);
        return;
      }

      if (!formula.ingredients || !Array.isArray(formula.ingredients)) {
        console.error(`Formula has invalid ingredients array:`, formula);
        return;
      }

      // Create formula group ingredients but don't add them to active list yet
      const groupIngredients: FormulaIngredient[] = formula.ingredients
        .filter(
          (refIngredient) =>
            refIngredient.concentration && refIngredient.concentration > 0
        )
        .map((refIngredient) => {
          const matchingIngredient = mockIngredients.find(
            (ing) => ing.name === refIngredient.ingredientName
          );

          if (!matchingIngredient || !refIngredient.concentration) {
            console.warn(
              `Ingredient "${refIngredient.ingredientName}" not found in library or has no concentration`
            );
            return null;
          }

          const newIngredient = {
            id: `${matchingIngredient.id}-${Date.now()}-${Math.random()}`,
            ingredient: matchingIngredient,
            concentration: refIngredient.concentration,
            quantity: (refIngredient.concentration * batchSize) / 100,
            unit: batchUnit,
          };

          // Validate the created ingredient
          if (
            !newIngredient.id ||
            !newIngredient.ingredient ||
            !newIngredient.ingredient.id
          ) {
            console.error(`Invalid ingredient created:`, newIngredient);
            return null;
          }

          return newIngredient;
        })
        .filter(
          (ingredient): ingredient is FormulaIngredient => ingredient !== null
        );

      // Validate that we have at least some valid ingredients
      if (groupIngredients.length === 0) {
        console.warn(
          `No valid ingredients found in formula "${formula.metadata?.name}". Skipping formula group creation.`
        );
        return;
      }

      const formulaGroup: FormulaGroup = {
        id: `formula-group-${Date.now()}-${Math.random()}`, // Make ID more unique
        type: "formulaGroup",
        formulaName: formula.metadata?.name || "Unknown Formula",
        formulaId: formula.metadata?.id || "",
        isExpanded: false,
        ingredients: groupIngredients,
        metadata: {
          totalIngredients: groupIngredients.length,
          totalConcentration: groupIngredients.reduce(
            (sum, ing) => sum + (ing.concentration || 0),
            0
          ),
        },
      };

      // Validate the formula group before adding
      if (
        !formulaGroup.id ||
        !formulaGroup.formulaId ||
        !formulaGroup.formulaName
      ) {
        console.error(`Invalid formula group created:`, formulaGroup);
        return;
      }

      // IMPORTANT: Add formula groups AFTER regular ingredients to maintain proper order
      setActiveIngredients((prev) => {
        const regularIngredients: ActiveFormulaItem[] = [];
        const existingFormulaGroups: ActiveFormulaItem[] = [];

        prev.forEach((item) => {
          if ("type" in item && item.type === "formulaGroup") {
            existingFormulaGroups.push(item);
          } else {
            regularIngredients.push(item);
          }
        });

        // Maintain order: regular ingredients + all formula groups (including new one)
        return [...regularIngredients, ...existingFormulaGroups, formulaGroup];
      });
    },
    [batchSize, batchUnit, saveToHistory, referenceFormulas, activeIngredients]
  );

  const toggleFormulaGroup = useCallback(
    (groupId: string) => {
      saveToHistory(`Toggle formula group`);
      setActiveIngredients((prev) =>
        prev.map((item) => {
          if (
            "type" in item &&
            item.type === "formulaGroup" &&
            item.id === groupId
          ) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          return item;
        })
      );
    },
    [saveToHistory]
  );

  const expandFormulaGroup = useCallback(
    (groupId: string) => {
      saveToHistory(`Expand formula group`);

      setActiveIngredients((prev) => {
        // IMPORTANT: When expanding formula groups, ingredients should be added to the regular ingredients list
        // while maintaining the correct order: directly added ingredients first, then expanded ingredients, then remaining formula groups

        const regularIngredients: ActiveFormulaItem[] = [];
        const formulaGroups: ActiveFormulaItem[] = [];
        let expandedIngredients: FormulaIngredient[] = [];

        prev.forEach((item) => {
          if ("type" in item && item.type === "formulaGroup") {
            if (item.id === groupId) {
              // This is the group to expand - extract its ingredients
              if (item.ingredients && Array.isArray(item.ingredients)) {
                expandedIngredients = item.ingredients;
              }
              // Don't add the formula group itself anymore
            } else {
              // Keep other formula groups as they are
              formulaGroups.push(item);
            }
          } else {
            // Regular ingredient
            regularIngredients.push(item);
          }
        });

        // Maintain proper order: regular ingredients + expanded ingredients + remaining formula groups
        return [
          ...regularIngredients,
          ...expandedIngredients,
          ...formulaGroups,
        ];
      });
    },
    [saveToHistory]
  );

  const updateIngredient = useCallback(
    (id: string, updates: Partial<FormulaIngredient>) => {
      // Save current state to history before making changes
      saveToHistory(`Update ingredient`);

      setActiveIngredients((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    [saveToHistory]
  );

  const removeIngredient = useCallback(
    (id: string) => {
      // Save current state to history before making changes
      saveToHistory(`Remove ingredient`);

      setActiveIngredients((prev) => prev.filter((item) => item.id !== id));
    },
    [saveToHistory]
  );

  const replaceFormula = useCallback(
    (ingredients: FormulaIngredient[]) => {
      // Save current state to history before making changes
      saveToHistory(`Replace formula`);

      setActiveIngredients(ingredients);
    },
    [saveToHistory]
  );

  // Undo functionality
  const undoLastAction = useCallback(() => {
    if (undoHistory.length === 0) return;

    const lastState = undoHistory[0];

    // Restore the previous state
    setActiveIngredients(lastState.activeIngredients);
    setBatchSizeState(lastState.batchSize);

    // Remove the last state from history
    setUndoHistory((prev) => prev.slice(1));
  }, [undoHistory]);

  const replaceWithReferenceFormula = useCallback(
    (formulaId: string) => {
      // Find the reference formula
      const referenceFormula = referenceFormulas.find(
        (f) => f.metadata.id === formulaId
      );

      if (!referenceFormula) {
        console.error("Reference formula not found:", formulaId);
        return;
      }

      // Convert reference formula ingredients to active formula ingredients
      const newActiveIngredients: FormulaIngredient[] =
        referenceFormula.ingredients
          .filter(
            (refIngredient) =>
              refIngredient.concentration && refIngredient.concentration > 0
          ) // Only include ingredients with concentration
          .map((refIngredient) => {
            // Find the matching ingredient in our library
            const matchingIngredient = mockIngredients.find(
              (ing) => ing.name === refIngredient.ingredientName
            );

            if (!matchingIngredient || !refIngredient.concentration) {
              console.warn(
                `Ingredient "${refIngredient.ingredientName}" not found in library or has no concentration`
              );
              return null;
            }

            return {
              id: `${matchingIngredient.id}-${Date.now()}-${Math.random()}`,
              ingredient: matchingIngredient,
              concentration: refIngredient.concentration,
              quantity: (refIngredient.concentration * batchSize) / 100,
              unit: batchUnit,
            };
          })
          .filter(
            (ingredient): ingredient is FormulaIngredient => ingredient !== null
          );

      // Replace the active ingredients
      setActiveIngredients(newActiveIngredients);
    },
    [referenceFormulas, batchSize, batchUnit]
  );

  const clearFormula = useCallback(() => {
    setActiveIngredients([]);
  }, []);

  const setBatchSize = useCallback((size: number) => {
    setBatchSizeState(size);
    // Recalculate all quantities based on new batch size
    setActiveIngredients((prev) =>
      prev.map((item) => {
        if ("type" in item && item.type === "formulaGroup") {
          // For formula groups, update the quantities of the ingredients within
          return {
            ...item,
            ingredients: item.ingredients.map(
              (ingredient: FormulaIngredient) => ({
                ...ingredient,
                quantity: (ingredient.concentration * size) / 100,
              })
            ),
          };
        }
        // For regular ingredients
        const formulaIngredient = item as FormulaIngredient;
        return {
          ...formulaIngredient,
          quantity: (formulaIngredient.concentration * size) / 100,
        };
      })
    );
  }, []);

  const setBatchUnit = useCallback((unit: "ml" | "g") => {
    setBatchUnitState(unit);
  }, []);

  const toggleLeftPanel = useCallback(() => {
    setLeftPanelCollapsed((prev) => !prev);
  }, []);

  const addReferenceFormula = useCallback(
    (formula: ReferenceFormula) => {
      // Check if this formula is already added as a formula group
      const isAlreadyInActive = activeIngredients.some(
        (item) =>
          "type" in item &&
          item.type === "formulaGroup" &&
          item.formulaId === formula.metadata?.id
      );

      // Check if this formula is already in reference formulas
      const isAlreadyInReference = referenceFormulas.some(
        (refFormula) => refFormula.metadata?.id === formula.metadata?.id
      );

      if (isAlreadyInActive) {
        console.warn(
          `Formula "${formula.metadata?.name}" is already added as a formula group. Skipping duplicate addition to references.`
        );
        return;
      }

      if (isAlreadyInReference) {
        console.warn(
          `Formula "${formula.metadata?.name}" is already in reference formulas. Skipping duplicate addition.`
        );
        return;
      }

      setReferenceFormulas((prev) => [...prev, formula]);
    },
    [activeIngredients, referenceFormulas]
  );

  const removeReferenceFormula = useCallback((formulaId: string) => {
    setReferenceFormulas((prev) =>
      prev.filter((f) => f.metadata.id !== formulaId)
    );
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  const roundOffIngredients = useCallback(() => {
    // Save current state to history before making changes
    saveToHistory("Round off ingredients");

    setActiveIngredients((prev) =>
      prev.map((item) => {
        if ("type" in item && item.type === "formulaGroup") {
          // For formula groups, round off the quantities of the ingredients within
          return {
            ...item,
            ingredients: item.ingredients.map(
              (ingredient: FormulaIngredient) => {
                const ingredientWithAmount = ingredient as any;
                return {
                  ...ingredient,
                  quantity: Math.round(ingredient.quantity * 10) / 10, // Round to 1 decimal place
                  ...(ingredientWithAmount.amount !== undefined && {
                    amount: Math.round(ingredientWithAmount.amount * 10) / 10,
                  }), // Round amount if it exists
                  concentration: Math.round(ingredient.concentration * 10) / 10, // Round concentration too
                };
              }
            ),
          };
        } else {
          // For regular ingredients, round off amount and concentration
          const formulaIngredient = item as FormulaIngredient;
          const ingredientWithAmount = formulaIngredient as any;
          return {
            ...formulaIngredient,
            quantity: Math.round(formulaIngredient.quantity * 10) / 10, // Round to 1 decimal place
            ...(ingredientWithAmount.amount !== undefined && {
              amount: Math.round(ingredientWithAmount.amount * 10) / 10,
            }), // Round amount if it exists
            concentration:
              Math.round(formulaIngredient.concentration * 10) / 10, // Round concentration too
          };
        }
      })
    );
  }, [saveToHistory]);

  const applyYielding = useCallback(
    (options: YieldingOptions) => {
      // Save current state to history before making changes
      const auditMessage = `Yielded to ${options.targetYield}${options.targetUnit.toLowerCase()}, loss=${options.lossFactor}%, rounding=${options.rounding}, scope=${options.scope}`;
      saveToHistory(auditMessage);

      // Calculate current total weight
      const actualIngredients = activeIngredients.filter(
        (item): item is FormulaIngredient =>
          !("type" in item) || item.type !== "formulaGroup"
      );

      const currentTotal = actualIngredients.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      if (currentTotal === 0) return;

      // Calculate scaling factor with loss compensation
      const adjustedTarget =
        options.targetYield * (1 + options.lossFactor / 100);
      const scalingFactor = adjustedTarget / currentTotal;

      // Apply rounding function
      const applyRounding = (value: number): number => {
        switch (options.rounding) {
          case "0.1g":
            return Math.round(value * 10) / 10;
          case "0.01g":
            return Math.round(value * 100) / 100;
          default:
            return value;
        }
      };

      setActiveIngredients((prev) =>
        prev.map((item) => {
          if ("type" in item && item.type === "formulaGroup") {
            // For formula groups, scale the quantities of the ingredients within
            if (options.premixHandling === "preserve") {
              // Scale the whole group while preserving internal ratios
              return {
                ...item,
                ingredients: item.ingredients.map(
                  (ingredient: FormulaIngredient) => ({
                    ...ingredient,
                    quantity: applyRounding(
                      ingredient.quantity * scalingFactor
                    ),
                  })
                ),
              };
            } else {
              // Flatten and scale leaf ingredients
              // This would require more complex logic to handle nested structures
              return {
                ...item,
                ingredients: item.ingredients.map(
                  (ingredient: FormulaIngredient) => ({
                    ...ingredient,
                    quantity: applyRounding(
                      ingredient.quantity * scalingFactor
                    ),
                  })
                ),
              };
            }
          } else {
            // For regular ingredients, scale the quantity
            const formulaIngredient = item as FormulaIngredient;
            return {
              ...formulaIngredient,
              quantity: applyRounding(
                formulaIngredient.quantity * scalingFactor
              ),
            };
          }
        })
      );

      // Update batch size to reflect the new yield
      setBatchSizeState(options.targetYield);
    },
    [saveToHistory, activeIngredients]
  );

  const formulaSummary: FormulaSummary = useMemo(() => {
    // Filter out formula groups and only include actual ingredients
    const actualIngredients = activeIngredients.filter(
      (item): item is FormulaIngredient =>
        !("type" in item) || item.type !== "formulaGroup"
    );

    const totalWeight = actualIngredients.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const totalCost = actualIngredients.reduce(
      (sum, item) =>
        sum + (item.quantity || 0) * (item.ingredient?.costPerKg || 0),
      0
    );
    const totalConcentration = actualIngredients.reduce(
      (sum, item) => sum + (item.concentration || 0),
      0
    );
    const averageCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

    return {
      totalWeight,
      totalCost,
      ingredientCount: actualIngredients.length,
      totalConcentration,
      averageCostPerKg,
      complianceStatus: totalConcentration > 100 ? "warning" : "pending",
    };
  }, [activeIngredients]);

  // Calculate panel dimensions based on content and screen size
  const panelDimensions = useMemo(() => {
    const SCREEN_WIDTH =
      typeof window !== "undefined" ? window.innerWidth : 1920;
    const LEFT_PANEL_EXPANDED = 280;
    const LEFT_PANEL_COLLAPSED = 60;
    const MIN_MIDDLE_PANEL = 550;

    // Left panel width
    const leftPanelWidth = leftPanelCollapsed
      ? LEFT_PANEL_COLLAPSED
      : LEFT_PANEL_EXPANDED;

    // Middle panel gets the remaining space
    const getMiddlePanelMinWidth = () => {
      if (activeIngredients.length > 0) return MIN_MIDDLE_PANEL;
      if (SCREEN_WIDTH > 1200) return 350;
      return 400;
    };

    return {
      leftPanelWidth,
      middlePanelMinWidth: getMiddlePanelMinWidth(),
    };
  }, [activeIngredients.length, leftPanelCollapsed]);

  const value: FormulaContextType = useMemo(
    () => ({
      activeIngredients,
      batchSize,
      batchUnit,
      leftPanelCollapsed,
      referenceFormulas,
      libraryFormulas,
      viewMode,
      canUndo,
      undoHistory,
      addIngredient,
      addIngredientsFromFormula,
      addFormulaGroup,
      toggleFormulaGroup,
      expandFormulaGroup,
      updateIngredient,
      removeIngredient,
      replaceFormula,
      replaceWithReferenceFormula,
      clearFormula,
      setBatchSize,
      setBatchUnit,
      toggleLeftPanel,
      addReferenceFormula,
      removeReferenceFormula,
      setViewMode,
      undoLastAction,
      roundOffIngredients,
      applyYielding,
      formulaSummary,
      panelDimensions,
    }),
    [
      activeIngredients,
      batchSize,
      batchUnit,
      leftPanelCollapsed,
      referenceFormulas,
      libraryFormulas,
      viewMode,
      canUndo,
      undoHistory,
      addIngredient,
      addIngredientsFromFormula,
      addFormulaGroup,
      toggleFormulaGroup,
      expandFormulaGroup,
      updateIngredient,
      removeIngredient,
      replaceFormula,
      replaceWithReferenceFormula,
      clearFormula,
      setBatchSize,
      setBatchUnit,
      toggleLeftPanel,
      addReferenceFormula,
      removeReferenceFormula,
      setViewMode,
      undoLastAction,
      roundOffIngredients,
      applyYielding,
      formulaSummary,
      panelDimensions,
    ]
  );

  return (
    <FormulaContext.Provider value={value}>{children}</FormulaContext.Provider>
  );
};

export const useFormula = (): FormulaContextType => {
  const context = useContext(FormulaContext);
  if (context === undefined) {
    throw new Error("useFormula must be used within a FormulaProvider");
  }
  return context;
};
