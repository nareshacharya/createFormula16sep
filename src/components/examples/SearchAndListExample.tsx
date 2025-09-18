/**
 * Example Usage of Search and ListItem Components
 *
 * This file demonstrates how to use the new reusable Search and ListItem components
 * to replace the existing ingredient and formula list implementations.
 */

import React, { useState } from "react";
import { Search, ListItem } from "../common";
import type { ListItemConfig } from "../common";
import { Ingredient } from "../../models/Ingredient";

// Example 1: Ingredient List Configuration
const ingredientListConfig: ListItemConfig<Ingredient> = {
  mainAttribute: {
    key: "name",
    type: "text",
  },
  subAttributes: [
    {
      key: "casNumber",
      label: "CAS",
      type: "text",
    },
    {
      key: "category",
      type: "badge",
    },
    {
      key: "defaultConcentration",
      type: "percentage",
      format: (value) => `${value}%`,
    },
  ],
  actions: [
    {
      id: "add",
      label: "Add",
      icon: "add",
      variant: "primary",
      onClick: (ingredient) =>
        console.log("Adding ingredient:", ingredient.name),
    },
    {
      id: "info",
      label: "Info",
      icon: "info",
      variant: "ghost",
      onClick: (ingredient) =>
        console.log("Showing info for:", ingredient.name),
    },
  ],
  avatar: {
    key: "name",
    fallback: "?",
    render: (ingredient) => ingredient.name.charAt(0).toUpperCase(),
  },
  badge: {
    key: "status",
    variant: "success",
  },
  selectable: true,
  onClick: (ingredient) => console.log("Selected ingredient:", ingredient.name),
};

// Example 2: Formula List Configuration
interface Formula {
  id: string;
  name: string;
  description: string;
  ingredients: number;
  lastModified: Date;
  status: "active" | "draft" | "archived";
  createdBy: string;
}

const formulaListConfig: ListItemConfig<Formula> = {
  mainAttribute: {
    key: "name",
    type: "text",
  },
  subAttributes: [
    {
      key: "description",
      type: "text",
    },
    {
      key: "ingredients",
      label: "Ingredients",
      type: "number",
    },
    {
      key: "lastModified",
      label: "Modified",
      type: "date",
    },
    {
      key: "createdBy",
      label: "Created by",
      type: "text",
    },
  ],
  actions: [
    {
      id: "replace",
      label: "Replace",
      icon: "replace",
      variant: "primary",
      onClick: (formula) =>
        console.log("Replacing with formula:", formula.name),
    },
    {
      id: "merge",
      label: "Merge",
      icon: "merge",
      variant: "secondary",
      onClick: (formula) => console.log("Merging formula:", formula.name),
    },
    {
      id: "compare",
      label: "Compare",
      icon: "compare",
      variant: "ghost",
      onClick: (formula) => console.log("Comparing formula:", formula.name),
    },
  ],
  badge: {
    key: "status",
    variant: "info",
    render: (status) => status.charAt(0).toUpperCase() + status.slice(1),
  },
  selectable: true,
};

// Example 3: Compact List Configuration (for sidebar)
const compactIngredientConfig: ListItemConfig<Ingredient> = {
  mainAttribute: {
    key: "name",
    type: "text",
  },
  subAttributes: [
    {
      key: "casNumber",
      type: "text",
    },
  ],
  actions: [
    {
      id: "add",
      label: "Add",
      icon: "add",
      variant: "ghost",
      onClick: (ingredient) => console.log("Quick add:", ingredient.name),
    },
  ],
  onClick: (ingredient) => console.log("Quick select:", ingredient.name),
};

// Example Component showing usage
const ExampleLibraryPanel: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [selectedFormulas, setSelectedFormulas] = useState<Set<string>>(
    new Set()
  );

  // Sample data
  const sampleIngredients: Ingredient[] = [
    {
      id: "1",
      name: "Water",
      casNumber: "7732-18-5",
      category: "Solvent",
      defaultConcentration: 80,
      costPerKg: 0.01,
      tags: ["solvent", "base"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Glycerin",
      casNumber: "56-81-5",
      category: "Functional",
      defaultConcentration: 15,
      costPerKg: 0.05,
      tags: ["humectant", "moisturizer"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const sampleFormulas: Formula[] = [
    {
      id: "1",
      name: "Moisturizing Cream Base",
      description: "Basic moisturizing cream formula",
      ingredients: 8,
      lastModified: new Date("2024-01-15"),
      status: "active",
      createdBy: "John Doe",
    },
    {
      id: "2",
      name: "Anti-Aging Serum",
      description: "Advanced anti-aging formula with peptides",
      ingredients: 12,
      lastModified: new Date("2024-01-10"),
      status: "draft",
      createdBy: "Jane Smith",
    },
  ];

  const handleIngredientSelection = (
    ingredient: Ingredient,
    selected: boolean
  ) => {
    const newSelection = new Set(selectedIngredients);
    if (selected) {
      newSelection.add(ingredient.id);
    } else {
      newSelection.delete(ingredient.id);
    }
    setSelectedIngredients(newSelection);
  };

  const handleFormulaSelection = (formula: Formula, selected: boolean) => {
    const newSelection = new Set(selectedFormulas);
    if (selected) {
      newSelection.add(formula.id);
    } else {
      newSelection.delete(formula.id);
    }
    setSelectedFormulas(newSelection);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>Reusable Search and ListItem Components Example</h2>

      {/* Ingredients Section */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Ingredients (Default Variant)</h3>
        <Search<Ingredient>
          items={sampleIngredients}
          searchFields={["name", "casNumber"]}
          placeholder="Search ingredients..."
          allowMultiSelect={true}
          isMultiSelectMode={true}
          renderItem={(ingredient, isSelected) => (
            <ListItem
              item={ingredient}
              config={ingredientListConfig}
              selected={isSelected}
              onSelectionChange={handleIngredientSelection}
              variant="default"
            />
          )}
          itemCountLabel="ingredients"
        />
      </div>

      {/* Formulas Section */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Formulas (Detailed Variant)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {sampleFormulas.map((formula) => (
            <ListItem
              key={formula.id}
              item={formula}
              config={formulaListConfig}
              selected={selectedFormulas.has(formula.id)}
              onSelectionChange={handleFormulaSelection}
              variant="detailed"
            />
          ))}
        </div>
      </div>

      {/* Compact List Section */}
      <div>
        <h3>Compact Ingredients (Compact Variant)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {sampleIngredients.map((ingredient) => (
            <ListItem
              key={ingredient.id}
              item={ingredient}
              config={compactIngredientConfig}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExampleLibraryPanel;
