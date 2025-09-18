# Fix: Reference Formula Column Drag Handle Restoration

## Problem

The Reference Formula panel was missing the drag handle (grip lines) in its collapsed state that allows users to reorganize columns between Reference Formula, Reference Attributes, and Notes&Comments panels.

## Root Cause

The `ReferenceFormulaColumn` component was not receiving the drag props (`onDragStart` and `onDragEnd`) that enable the drag-and-drop functionality for column reordering.

## Solution

### 1. Updated ReferenceFormulaColumnProps Interface

**File**: `src/components/FormulaWorkbench/ReferenceFormulaColumn/ReferenceFormulaColumn.tsx`

Added drag props to the interface:

```typescript
interface ReferenceFormulaColumnProps extends CollapsibleColumnProps {
  // ... existing props
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}
```

### 2. Added Drag Props to Component Destructuring

```typescript
const ReferenceFormulaColumn: React.FC<ReferenceFormulaColumnProps> = ({
  // ... existing props
  onDragStart,
  onDragEnd,
}) => {
```

### 3. Updated Collapsed State with Drag Handle

Added the drag handle and drag functionality to match AttributesColumn and NotesColumn:

```typescript
// Collapsed state
if (isCollapsed) {
  return (
    <GroupedColumn $collapsed>
      <CollapsedColumnHeader $variant="reference">
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
        <span style={{/* ... existing styles */}}>
          Reference Formula
        </span>
      </CollapsedColumnHeader>
    </GroupedColumn>
  );
}
```

### 4. Added Drag Handle to Expanded State Header

Enhanced the expanded header to include drag handle for consistency:

```typescript
<CollapsibleColumnHeader $variant="reference">
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
    <h3 style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Reference Formula</h3>
    <Badge>{referenceFormulas.length} formulas</Badge>
  </div>
  // ... rest of header
</CollapsibleColumnHeader>
```

## Verification

### Expected Behavior

1. **Collapsed State**: Reference Formula panel now shows grip lines icon when collapsed, matching AttributesColumn behavior
2. **Drag Functionality**: Users can drag the collapsed Reference Formula column to reorder it between other columns
3. **Visual Feedback**: Hover effects and cursor changes provide clear visual feedback during drag operations
4. **Expanded State**: Drag handle also available in expanded state for consistency

### Testing Steps

1. Navigate to the Formula Workbench
2. Collapse the Reference Formula panel using the collapse button
3. Verify the grip lines icon appears at the top of the collapsed column
4. Test dragging the collapsed column to reorder it between other columns
5. Verify the drag functionality works in both collapsed and expanded states

## Technical Notes

- **Consistency**: Now all three draggable columns (Reference Formula, Attributes, Notes) have identical drag handle implementation
- **Conditional Rendering**: Drag handles only appear when `onDragStart` prop is provided, maintaining backward compatibility
- **Visual Polish**: Includes hover effects and proper cursor states for enhanced UX
- **No Breaking Changes**: All existing functionality preserved while adding the missing drag capability

## Files Modified

1. `/src/components/FormulaWorkbench/ReferenceFormulaColumn/ReferenceFormulaColumn.tsx`
   - Added drag props to interface
   - Updated component props destructuring
   - Enhanced collapsed state with drag handle
   - Added drag handle to expanded state header

## Status

✅ **Implementation Complete**
✅ **No Compilation Errors**
✅ **Development Server Running** (Port 3000)
🧪 **Ready for User Testing**

The Reference Formula column now has full drag-and-drop functionality for column reordering, restoring parity with the Attributes and Notes columns.
