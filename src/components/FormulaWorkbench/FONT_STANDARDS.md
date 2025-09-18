# Font Size Consistency Standards

This document outlines the standardized font sizes used across the FormulaWorkbench application to ensure visual consistency.

## Font Scale Definition

```typescript
const FONT_SIZES = {
  xs: "10px", // Small badges, micro text
  sm: "12px", // Labels, secondary text
  base: "14px", // Body text, data values
  md: "16px", // Primary text, ingredient names
  lg: "18px", // Section headers, panel titles
  xl: "20px", // Main titles
};
```

## Applied Font Sizes by Component Type

### Main Titles & Headers

- **Canvas Title** (`CanvasTitle`): `18px` (xl) - Main application title
- **Panel Titles** (`PanelTitle`): `16px` (lg) - Library, panel sections
- **Column Headers** (`h3` in headers): `16px` (lg) - Active Formula, Reference, etc.

### Sub-Headers & Labels

- **Column Sub-Headers** (`ColumnSubHeader`): `14px` (md) - Reference formula names, attributes
- **Summary Labels** (`SummaryLabel`): `11px` (sm) - "Total Weight", "Total Cost" labels
- **Table Headers** (`TableHeader`): `12px` (sm) - "Ingredient", "Conc. %", etc.
- **Attribute Labels** (`AttributeLabel`): `13px` (base) - Individual attribute names

### Data & Content Text

- **Table Data** (`TableCell`): `13px` (base) - All data values in tables
- **Table Rows** (`TableRowContainer`): `14px` (md) - Row content in grouped columns
- **Ingredient Names** (`IngredientName`): `14px` (md) - Primary ingredient identification
- **Ingredient CAS** (`IngredientCAS`): `12px` (sm) - Secondary ingredient info
- **Empty State** (`EmptyState`): `14px` (md) - "No ingredients" messages

### Input Elements

- **Search Input** (`SearchInput`): `14px` (md) - Library search field
- **Batch Size Input** (`BatchSizeInput`): `13px` (base) - Numeric inputs
- **Editable Input** (`EditableInput`): `13px` (base) - Table cell inputs
- **Notes Input** (`NotesInput`): `13px` (base) - Notes textarea
- **Notes Input Inline**: `13px` (base) - Inline notes inputs in NotesColumn

### Indicators & Badges

- **Badges** (`Badge`): `11px` (sm) - Count indicators, status badges
- **Compliance Status** (`ComplianceStatus`): `11px` (sm) - Status indicators
- **Added Indicator** (`AddedIndicator`): `11px` (sm) - "Added" status
- **Diff Indicator** (`DiffIndicator`): `10px` (xs) - Difference indicators (+/-values)
- **Diff Indicator Inline**: `10px` (xs) - Inline difference markers

### Form Elements

- **Action Buttons**: `13px` (base) - Standard button text
- **Add Button** (`AddButton`): `12px` (sm) - Add ingredient buttons

### Summary Information

- **Formula Summary** (`FormulaSummaryRow`): `14px` (md) - Summary row content
- **Summary Values** (`SummaryValue`): Inherits from parent (14px)
- **Attribute Values** (`AttributeValue`): `12px` (sm) - Attribute data pairs

## Consistency Rules

### Do's ✅

- Use semantic font size constants from `FONT_SIZES`
- Match content hierarchy: titles > headers > content > labels > micro-text
- Keep related content at the same font size (all table data = 13px)
- Use 14px for primary content recognition (ingredient names, row data)
- Use 13px for all data values and inputs for consistency
- Use 11-12px for secondary/supportive information

### Don'ts ❌

- Don't use arbitrary font sizes like 15px, 17px, 19px
- Don't mix font sizes within the same content type
- Don't use different sizes for similar UI elements across components
- Don't use font sizes smaller than 10px for readability

## Component-Specific Notes

### Library Panel

- **Ingredient Names**: 14px (primary identification)
- **CAS Numbers**: 12px (secondary info)
- **Added Status**: 11px (status indicator)

### Grouped Columns

- **Column Titles**: 16px (section headers)
- **Sub-headers**: 14px (formula/attribute names)
- **Data Rows**: 13px (consistent data display)
- **Row Containers**: 14px (overall row text)

### Formula Canvas

- **Main Title**: 18px (primary application header)
- **Summary Info**: 14px (key information)
- **Summary Labels**: 11px (descriptive labels)

### Interactive Elements

- **All Inputs**: 13px (consistent data entry)
- **Button Text**: 13px (readable action text)
- **Search**: 14px (primary interaction)

## Validation Checklist

When adding new components, ensure:

- [ ] Main content uses 13-14px fonts
- [ ] Headers follow the lg (16px) → md (14px) → base (13px) hierarchy
- [ ] Labels and secondary info use sm (11-12px)
- [ ] Micro-indicators use xs (10px)
- [ ] All similar elements use identical font sizes
- [ ] Font sizes align with semantic meaning and visual hierarchy

This standardization ensures a professional, consistent user experience across the entire FormulaWorkbench application.
