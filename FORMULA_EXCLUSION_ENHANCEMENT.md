# Enhancement: Formula Exclusion in Reference Panel

## Issue Description

When a formula (like "Classic Lavender") is added to the Active Formula as a formula group, it should be grayed out or disabled in the Reference Formula Panel search modal to prevent user confusion and duplicate selection.

**Problem Flow:**

1. User adds "Classic Lavender" formula to Active Formula from Library Panel > Formulas tab
2. Formula appears as a formula group in Active Formula panel ✅
3. User tries to add reference formulas for comparison
4. **Issue**: "Classic Lavender" still appears as selectable in the Reference Formula search modal ❌
5. **Expected**: "Classic Lavender" should be grayed out with "(Already Added)" label ✅

## Root Cause Analysis

The `getExcludeIds` function in the formula modal configuration was only checking for formulas already present in the `referenceFormulas` array, but it wasn't checking for formulas that are currently active as formula groups in the `activeIngredients` array.

**Before Fix:**

```typescript
getExcludeIds: (selectedFormulas: any[]) =>
  new Set(selectedFormulas.map((f) => f.metadata?.id || f.id));
```

This only excluded formulas that were already added as reference formulas, but not formulas that were added to the active formula as formula groups.

## Solution Implementation

### 1. **Enhanced Formula Tracking in ReferenceFormulaColumn**

Added logic to identify formulas that are already in the active formula as formula groups:

```typescript
// Get all excluded formulas (both reference and active formula groups)
const getExcludedFormulas = () => {
  const excludedFormulas: any[] = [];

  // Add formulas that are already in active ingredients as formula groups
  activeIngredients.forEach((item) => {
    if ("type" in item && item.type === "formulaGroup") {
      // Find the original formula from library
      const originalFormula = libraryFormulas.find((formula) => {
        const formulaId = formula.metadata?.id || formula.id;
        const itemId = item.metadata?.id || item.id;
        return formulaId === itemId;
      });

      if (originalFormula) {
        excludedFormulas.push(originalFormula);
      }
    }
  });

  return excludedFormulas;
};
```

### 2. **Updated FormulaSearchModal Interface**

Extended the modal to accept excluded formulas:

```typescript
interface FormulaSearchModalProps {
  // ... existing props
  excludedFormulas?: any[]; // ← Added this prop
  // ... rest of props
}
```

### 3. **Enhanced Modal Configuration**

Modified the formula search modal to use custom exclusion logic that combines both reference formulas and active formula groups:

```typescript
const config = {
  ...formulaModalConfig,
  title,
  data: formulas,
  getExcludeIds: (selectedItems: any[]) => {
    // Combine reference formulas + excluded formulas (active formula groups)
    const referenceIds = selectedItems.map((f) => f.metadata?.id || f.id);
    const excludedIds = excludedFormulas.map((f) => f.metadata?.id || f.id);
    return new Set([...referenceIds, ...excludedIds]);
  },
};
```

### 4. **Updated Sorting Logic**

Enhanced the formula sorting to consider both reference and active formulas:

```typescript
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
```

## Files Modified

### 1. **ReferenceFormulaColumn.tsx**

- Added `getExcludedFormulas()` function
- Updated `sortedLibraryFormulas` logic to consider active formula groups
- Modified FormulaSearchModal call to pass `excludedFormulas`

### 2. **FormulaSearchModal.tsx**

- Added `excludedFormulas?: any[]` prop to interface
- Enhanced modal config with custom `getExcludeIds` function
- Combined reference and excluded formulas for proper exclusion

### 3. **AddReferenceModal.tsx** (Existing Logic Used)

- The existing exclusion logic already handles grayed out display
- Items in the exclude list automatically show:
  - Grayed out appearance (`opacity: 0.7`)
  - "(Already Added)" label
  - Disabled click functionality
  - Green checkmark icon

## User Experience Flow

### **Before Fix:**

1. Add "Classic Lavender" to Active Formula ✅
2. Open Reference Formula search modal
3. "Classic Lavender" still appears selectable ❌
4. User might accidentally select it again, causing confusion

### **After Fix:**

1. Add "Classic Lavender" to Active Formula ✅
2. Open Reference Formula search modal
3. "Classic Lavender" appears grayed out with "(Already Added)" label ✅
4. User cannot select it again, preventing confusion ✅
5. Clear visual indication of which formulas are already in use ✅

## Technical Benefits

### **Data Consistency**

- Prevents duplicate formulas across Active and Reference panels
- Maintains single source of truth for formula state
- Reduces confusion about which formulas are where

### **Enhanced UX**

- Clear visual feedback about formula availability
- Prevents accidental duplicate selections
- Consistent behavior with ingredient exclusion patterns

### **Scalable Architecture**

- Easily extendable to other formula operations
- Follows existing exclusion patterns in the codebase
- Maintains separation of concerns between components

## Testing Recommendations

### **Functional Testing**

1. **Single Formula Flow**:
   - Add formula to Active Formula → Verify it's grayed out in Reference search
   - Remove formula from Active → Verify it becomes selectable again

2. **Multiple Formula Flow**:
   - Add multiple formulas to Active → Verify all are properly excluded
   - Mix of Active + Reference formulas → Verify correct exclusion logic

3. **Edge Cases**:
   - Empty Active Formula → No exclusions should occur
   - Formula with same name but different ID → Should not be excluded
   - Formula groups vs individual ingredients → Only formula groups should trigger exclusion

### **Visual Testing**

1. **Appearance Verification**:
   - Excluded formulas should have `opacity: 0.7`
   - "(Already Added)" label should appear
   - Green checkmark icon should be visible
   - Click should be disabled

2. **Modal Behavior**:
   - Excluded formulas appear at top of list
   - Available formulas appear below excluded ones
   - Multi-select should not allow selection of excluded items

## Future Enhancements

### **Immediate Improvements**

1. **Tooltip Enhancement**: Add detailed tooltip explaining why formula is excluded
2. **Color Coding**: Use different colors for "In Active" vs "In Reference" exclusions
3. **Status Icons**: Different icons for different exclusion reasons

### **Advanced Features**

1. **Quick Actions**: "Move to Reference" button for active formula groups
2. **Smart Suggestions**: Recommend related formulas when one is excluded
3. **Batch Operations**: Handle multiple formula movements efficiently

## Conclusion

This enhancement significantly improves the user experience by preventing confusion between Active and Reference formulas. The implementation follows existing patterns in the codebase and provides a solid foundation for future formula management features.

**Key Achievement**: Users can now clearly see which formulas are already in use and cannot accidentally create duplicates, leading to a more intuitive and error-free workflow.

## Testing Status

✅ **Implementation Complete**
✅ **No Compilation Errors**  
✅ **Development Server Running** (`http://localhost:3000/`)
🧪 **Ready for User Testing**

The feature is ready for testing with the workflow:

1. Add "Classic Lavender" to Active Formula
2. Open Reference Formula Panel search
3. Verify "Classic Lavender" is grayed out with "(Already Added)" label
