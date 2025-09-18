# Formula Exclusion Debug Guide

## Problem

"Classic Lavender" is not appearing grayed out in the Reference Formula Panel search when it should be excluded.

## Fix Applied

Fixed the exclusion logic in `ReferenceFormulaColumn.tsx` to use `item.formulaId` instead of `item.metadata?.id` when matching formula groups to library formulas.

## Testing Steps

### Step 1: Check Browser Console

1. Open the application at http://localhost:3000/
2. Open browser Developer Tools (F12)
3. Go to the Console tab
4. Clear the console

### Step 2: Add Classic Lavender to Active Formula

1. In the Left Panel (Library), click on "Formulas" tab
2. Find "Classic Lavender" in the formula list
3. Click the "Add to Active Formula" button (this should add it as a formula group)
4. Check the console for logging messages

### Step 3: Test Exclusion in Reference Panel

1. In the Reference Formula Panel (middle area), click the "+" (Search & Add Formula) button
2. The modal should open
3. Look for "Classic Lavender" in the list
4. **Expected Result**: "Classic Lavender" should:
   - Have a grayed background (opacity: 0.7)
   - Show "(Already Added)" text next to the name
   - Have a green checkmark icon
   - Be non-clickable

### Step 4: Check Console Logs

Look for these log messages in the console:

```
Excluded formulas: ["Classic Lavender"]
FormulaSearchModal opened with:
- Total formulas: [number]
- Selected formulas: [number]
- Excluded formulas: 1
- Excluded formula names: ["Classic Lavender"]
getExcludeIds called with:
- Reference IDs: [array]
- Excluded IDs: ["REF-001"]
- All excluded IDs: [array including "REF-001"]
```

## Troubleshooting

### If Classic Lavender is NOT grayed out:

1. **Check if it was added as formula group**: Look in the Active Formula column for "Classic Lavender" as a collapsible group header
2. **Check console logs**: Verify the exclusion logic is detecting it correctly
3. **Verify IDs match**: The formula ID should be "REF-001" in both the library and the active formula group

### If no console logs appear:

1. Refresh the page
2. Try the steps again
3. Check if there are any JavaScript errors in the console

## Code Changes Made

### File: `ReferenceFormulaColumn.tsx`

- Fixed `getExcludedFormulas()` to use `item.formulaId` for matching
- Added console logging to see excluded formulas

### File: `FormulaSearchModal.tsx`

- Added debug logging to trace exclusion process
- Logs when modal opens and when exclusion IDs are calculated

## Expected vs Actual Behavior

**Expected**: When "Classic Lavender" is added to Active Formula, it should be excluded from Reference Formula search

**Actual**: You reported it's not being grayed out

**Fix**: The ID matching logic now correctly uses `formulaId` property from formula groups.

## Next Steps

1. Test the updated functionality using the steps above
2. Report console log output if the issue persists
3. Check if the formula is actually being added as a formula group vs individual ingredients
