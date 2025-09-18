# FormulaWorkbench Component

A comprehensive 2-panel formula creation and comparison interface for perfumers and formulators.

## Overview

The `FormulaWorkbench` component provides a unified workspace for creating, refining, and comparing fragrance formulas. It implements a 2-panel layout that mimics 5-panel functionality through grouped columns.

## Features

### 🧩 **2-Panel Layout**

#### **Panel 1: Ingredient/Formula Selector**

- **Tab-based interface** with two modes:
  1. **Ingredients Tab**:
     - Searchable/filterable ingredient library
     - Visual indicators for already-added ingredients (✓ green tick)
     - One-click "Add" functionality
     - Displays: Name, CAS Number, and added status

  2. **Formulas Tab**:
     - List of saved/reference formulas
     - "Replace Active" - populate active formula with selected formula's ingredients
     - "Compare" - add formula to reference comparison columns
     - Shows ingredient count per formula

#### **Panel 2: Active Workspace with Grouped Columns**

**🔹 Grouped Column 1: Active Formula Table**

- Editable table with real-time updates
- Columns: Ingredient, Concentration (%), Quantity, Cost, Actions
- Row-level delete functionality
- Live cost calculations based on ingredient pricing
- Formula summary badge showing ingredient count

**🔹 Grouped Column 2: Reference Formula Comparison**

- Horizontal scrollable columns (one per reference formula)
- Side-by-side quantity comparison
- Inline diff indicators (+/- percentage changes)
- Individual formula deletion (× button)
- Shows "Missing" for ingredients not present in reference
- Color-coded diff badges (green=increase, red=decrease, blue=new)

**🔹 Grouped Column 3: Reference Attributes**

- Vertical attribute comparison per ingredient
- Dynamic attribute discovery from ingredient data
- Shows: Toxicity, Vapor Density, Flash Point, etc.
- Organized by attribute type with ingredient-specific values

**🔹 Grouped Column 4: Notes & Comments**

- Per-ingredient text input areas
- Persistent notes storage
- Placeholder text: "Add note..."
- Character count display
- Auto-expanding text areas

## Usage

```tsx
import FormulaWorkbench from "./components/FormulaWorkbench/FormulaWorkbench";

function App() {
  return (
    <FormulaProvider>
      <FormulaWorkbench />
    </FormulaProvider>
  );
}
```

## Data Flow

The component integrates with the `FormulaContext` to:

- Access active ingredients and reference formulas
- Update ingredient concentrations and quantities
- Add/remove ingredients and formulas
- Persist notes and comments

## Component Architecture

```
FormulaWorkbench/
├── FormulaWorkbench.tsx    # Main component logic
├── styles.ts               # Styled components
├── types.ts               # TypeScript interfaces
└── README.md              # This documentation
```

## Key Functions

### Ingredient Management

- `handleAddIngredient()` - Add ingredient to active formula
- `updateIngredient()` - Modify ingredient properties
- `removeIngredient()` - Remove ingredient from active formula

### Formula Operations

- `handleAddFormula()` - Replace active formula with selected formula
- `handleCompareFormula()` - Add formula to comparison columns
- `removeReferenceFormula()` - Remove formula from comparison

### Calculations

- `calculateCost()` - Real-time cost calculation per ingredient
- `calculateDifference()` - Percentage difference for comparisons
- `getAllAttributes()` - Dynamic attribute discovery

## Styling & Theming

Uses `styled-components` with:

- Consistent color palette
- Responsive grid layouts
- Hover states and transitions
- Focus indicators for accessibility
- Badge components for status display

### Color System

- Primary: `#3b82f6` (Blue)
- Success: `#059669` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)
- Neutral: `#6b7280` (Gray)

## Responsiveness

- **Desktop**: Full 2-panel layout with horizontal scrolling columns
- **Tablet**: Collapsible sidebar with maintained functionality
- **Mobile**: Tab-based navigation with stacked columns

## Data Requirements

### Ingredient Schema

```typescript
interface Ingredient {
  id: string;
  name: string;
  casNumber?: string;
  costPerKg: number;
  defaultConcentration: number;
  attributes?: Record<string, any>;
}
```

### Formula Schema

```typescript
interface Formula {
  metadata: {
    id: string;
    name: string;
    base?: string;
  };
  ingredients: Array<{
    ingredientName: string;
    concentration: number;
  }>;
}
```

## Performance Considerations

- Memoized calculations for diff comparisons
- Virtual scrolling for large ingredient lists
- Debounced search input
- Lazy loading of formula data

## Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- Focus management between panels
- Screen reader compatible
- High contrast mode support

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- ES2020+ features
- CSS Grid and Flexbox layouts

## Dependencies

- React 18+
- styled-components 5+
- TypeScript 4+
- FormulaContext provider

## Future Enhancements

- [ ] Drag-and-drop ingredient reordering
- [ ] Export formula to PDF/Excel
- [ ] Undo/redo functionality
- [ ] Formula version history
- [ ] Batch operations (add multiple ingredients)
- [ ] Advanced filtering (by category, supplier, etc.)
- [ ] Real-time collaboration features
- [ ] Mobile app companion
