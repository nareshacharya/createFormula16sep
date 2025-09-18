# Bug Fix: NormalizeFormulaModal CostPerKg Error

## Issue Description

When adding a formula from the library panel to the active formula panel, the application was throwing an error:

```
Cannot read properties of undefined (reading 'costPerKg')
```

This error occurred in `NormalizeFormulaModal.tsx` at line 79 during the calculation of formula totals.

## Root Cause Analysis

### Primary Issue: Ingredient Mapping in FormulaWorkbench

The error was caused by incomplete ingredient object mapping when converting reference formulas to active formulas in the `FormulaWorkbench.tsx` component.

**Problem Flow:**

1. Reference formulas store ingredients by `ingredientName` (string)
2. When converting to active formulas, `handleReplaceFormula` tried to find matching ingredients using exact string matching
3. If no exact match was found, it fell back to `mockIngredients[0]`
4. However, the ingredient object structure wasn't being properly validated
5. The `NormalizeFormulaModal` then tried to access `costPerKg` on potentially incomplete ingredient objects

### Secondary Issue: Missing Safety Checks

The `NormalizeFormulaModal` component lacked defensive programming to handle cases where ingredient objects might be incomplete or undefined.

## Fixes Implemented

### 1. Enhanced Ingredient Matching Logic (`FormulaWorkbench.tsx`)

**Before:**

```typescript
ingredient: mockIngredients.find((i) => i.name === ing.ingredientName) ||
  mockIngredients[0];
```

**After:**

```typescript
// Try exact match first
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
  matchedIngredient = mockIngredients[0];
}
```

**Benefits:**

- More robust ingredient matching
- Better error logging for debugging
- Handles case sensitivity issues
- Supports partial name matching

### 2. Added Safety Checks (`NormalizeFormulaModal.tsx`)

#### A. Ingredient Validation at Component Entry

```typescript
const hasInvalidIngredients = formula.ingredients.some(
  (ing) => !ing.ingredient || typeof ing.ingredient.costPerKg !== 'number'
);

if (hasInvalidIngredients) {
  // Show error modal instead of crashing
  return <ErrorModal />;
}
```

#### B. Defensive Cost Calculation

```typescript
// Before
sum + ing.quantity * ing.ingredient.costPerKg;

// After
const costPerKg = ing.ingredient?.costPerKg || 0;
return sum + ing.quantity * costPerKg;
```

### 3. Improved ID Generation

Changed from simple timestamp-based IDs to more robust format:

```typescript
// Before
id: `${ing.ingredientName}-${Date.now()}`;

// After
id: `FI-REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

### 4. Enhanced Merge Formula Logic

Applied the same improved ingredient matching to the `handleMergeFormula` function for consistency.

## Testing Recommendations

### Functional Tests

1. **Basic Formula Addition**: Add various reference formulas to active panel
2. **Name Matching**: Test formulas with different ingredient name formats
3. **Edge Cases**: Test formulas with missing or malformed ingredient data
4. **Error Handling**: Verify error modal appears for invalid formulas
5. **Cost Calculation**: Ensure total costs are calculated correctly

### Regression Tests

1. Verify existing formula functionality still works
2. Test ingredient search and selection
3. Confirm normalize modal calculations are accurate
4. Check merge formula functionality

## Error Prevention Strategy

### 1. Data Validation

- Validate ingredient objects at formula creation
- Ensure all required properties exist
- Type checking for numeric values

### 2. Graceful Error Handling

- Show user-friendly error messages
- Provide recovery suggestions
- Log detailed errors for debugging

### 3. Defensive Programming

- Use optional chaining (`?.`)
- Provide sensible defaults
- Validate inputs at component boundaries

## Monitoring and Debugging

### Console Warnings Added

- Ingredient matching failures are now logged
- Available ingredients are listed for debugging
- Clear error messages for troubleshooting

### Debug Information

```javascript
console.warn(`Could not find ingredient for: ${ing.ingredientName}`);
console.warn(
  "Available ingredients:",
  mockIngredients.map((i) => i.name)
);
```

## Future Improvements

### 1. Ingredient Mapping Service

Create a dedicated service for ingredient name resolution:

```typescript
class IngredientMappingService {
  static findByName(name: string): Ingredient | null;
  static fuzzyMatch(name: string): Ingredient[];
  static suggest(name: string): string[];
}
```

### 2. Formula Validation Schema

Implement comprehensive validation for formula objects:

```typescript
interface FormulaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

### 3. Better Error Boundaries

Add specific error boundaries for formula-related components to isolate failures.

## Summary

The bug has been resolved with multiple layers of protection:

1. **Better ingredient matching** prevents most mapping failures
2. **Safety checks** ensure the app doesn't crash on edge cases
3. **User-friendly error handling** provides clear feedback
4. **Enhanced logging** helps with debugging

The fix maintains backward compatibility while significantly improving robustness and user experience.
