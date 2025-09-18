# Modal Design Standards

## Consistent Button Placement and Styling

This document outlines the standardized modal design patterns implemented across all dialog components in the FormulaWorkbench application.

## Button Components

All modals now use standardized button components from the common module:

### Available Button Types

- **`SecondaryButton`**: Default style for secondary actions (Cancel, Close)
  - White background, gray border
  - Used for: Cancel, Close, secondary actions

- **`PrimaryButton`**: Blue style for primary actions (Submit, Apply, Add)
  - Blue background (#3b82f6), white text
  - Used for: Save, Submit, Apply, Add, Confirm

- **`DangerButton`**: Red style for destructive actions (Delete, Replace)
  - Red background (#dc2626), white text
  - Used for: Delete, Replace, destructive confirmations

### Footer Layout

All modal footers follow a consistent pattern:

```tsx
// Standard two-button footer
footer={
  <>
    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
    <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
  </>
}

// Destructive action footer
footer={
  <>
    <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
    <DangerButton onClick={onConfirm}>Replace Formula</DangerButton>
  </>
}
```

## Layout Standards

- **Button Alignment**: All buttons are right-aligned using `justify-content: flex-end`
- **Button Spacing**: Consistent 12px gap between buttons
- **Button Order**: Secondary action (Cancel) on the left, primary action on the right
- **Footer Background**: Light gray background (#f9fafb) to distinguish from body
- **Footer Padding**: Consistent 16px vertical, 24px horizontal padding

## Implementation

### Base Modal Component

The `Modal` component from `../../common` provides:

- Consistent styling for overlay, content, header, and footer
- Standardized button components exported alongside Modal
- Right-aligned footer layout by default
- Consistent spacing and typography

### Usage in Modals

```tsx
import {
  Modal,
  SecondaryButton,
  PrimaryButton,
  DangerButton,
} from "../../common";

// Use the footer prop to pass button content
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  footer={
    <>
      <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
    </>
  }
>
  {/* Modal content */}
</Modal>;
```

## Updated Components

The following modals have been standardized:

1. **AddReferenceModal**: Multi-select functionality with consistent buttons
2. **NormalizeFormulaModal**: Complex formula normalization with standardized footer
3. **YieldingModal**: Yield calculation with consistent button placement
4. **ReplaceFormulaModal**: Destructive confirmation with DangerButton
5. **IngredientSearchModal**: Ingredient selection with multi-select support

## Benefits

- **Consistency**: Uniform button placement and styling across all modals
- **Maintainability**: Centralized button styles, easy to update globally
- **Accessibility**: Consistent interaction patterns for users
- **Developer Experience**: Simple import pattern, no custom styling needed

## Guidelines for New Modals

1. Always use the standardized button components
2. Place secondary actions (Cancel) on the left
3. Place primary actions (Submit, Save) on the right
4. Use DangerButton for destructive actions
5. Pass buttons as children to the `footer` prop
6. Avoid custom button styling - use the provided components

This standardization ensures a cohesive user experience across all modal dialogs in the application.
