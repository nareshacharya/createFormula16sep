# Common Reusable Components

This directory contains reusable UI components that provide consistent behavior and styling across the application. These components eliminate code duplication and ensure a unified user experience.

## Available Components

- [Modal](#modal-component) - Popup dialogs and overlays
- [Dropdown](#dropdown-component) - Three-dots menu and action dropdowns
- [Tabs](#tabs-component) - Tab navigation interface
- [Search](#search-component) - Configurable search and filter interface
- [ListItem](#listitem-component) - Configurable list items with actions and attributes

---

## Modal Component

A reusable Modal component that standardizes modal popup behavior and styling across the application.

### Features

- **Flexible Sizing**: Support for small, medium, large, and xlarge sizes
- **Keyboard Navigation**: ESC key support to close modal
- **Overlay Interaction**: Configurable click-outside-to-close behavior
- **Accessibility**: Proper focus management and body scroll prevention
- **Customizable Header**: Support for title, subtitle, and custom header content
- **Flexible Footer**: Custom footer content support
- **TypeScript Support**: Full type safety with proper interfaces

### Usage

#### Basic Modal

```tsx
import { Modal } from "../../common";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="My Modal Title"
      size="medium"
    >
      <div>Modal content goes here</div>
    </Modal>
  );
}
```

#### Modal with Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  footer={
    <>
      <button onClick={onClose}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Props Interface

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  headerContent?: ReactNode;
  className?: string;
}
```

### Size Variants

- **small**: 400px max width
- **medium**: 500px max width (default)
- **large**: 600px max width
- **xlarge**: 900px max width

### Migrated Components

1. **IngredientSearchModal**: Uses `<Modal size="large">` with custom header and footer
2. **AttributeSearchModal**: Uses `<Modal size="medium">` with multi-select toggle
3. **FormulaSearchModal**: Uses `<Modal size="large">` with formula-specific styling

---

## Dropdown Component

A reusable dropdown component for three-dots menus and configurable action lists.

### Features

- **Configurable Menu Items**: Icons, labels, actions, and separators
- **Positioning Options**: Left or right alignment
- **Keyboard Navigation**: ESC key to close, keyboard accessibility
- **Click Outside to Close**: Automatic overlay handling
- **Type-Safe Icons**: Integration with existing icon system
- **Consistent Styling**: Matches application design system

### Usage

#### Basic Dropdown

```tsx
import { Dropdown } from "../../common";

const menuItems = [
  { icon: "copy", label: "Compare", action: () => handleCompare() },
  { icon: "merge", label: "Merge", action: () => handleMerge() },
  { type: "separator" },
  { icon: "trash", label: "Delete", action: () => handleDelete() },
];

<Dropdown
  triggerIcon="menu"
  triggerIconColor="secondary"
  triggerTitle="Actions"
  menuItems={menuItems}
/>;
```

#### Advanced Dropdown

```tsx
<Dropdown
  triggerIcon="menu"
  triggerIconColor="primary"
  triggerTitle="Formula Actions"
  position="right"
  menuItems={menuItems}
  className="custom-dropdown"
/>
```

### Props Interface

```tsx
interface DropdownProps {
  triggerIcon: IconName;
  triggerIconColor?: IconColor;
  triggerTitle?: string;
  menuItems: Array<DropdownMenuItem | DropdownSeparator>;
  position?: "left" | "right";
  className?: string;
}

interface DropdownMenuItem {
  icon: IconName;
  label: string;
  action: () => void;
}

interface DropdownSeparator {
  type: "separator";
}
```

### Migrated Components

1. **FormulaActionsDropdown**: Reduced from 87 to 45 lines, formula library actions
2. **ActiveFormulaColumn**: Replaced manual dropdown with reusable component

---

## Tabs Component

A reusable tabs component providing clean, accessible interface for switching between content panels.

### Features

- **Configurable Tabs**: Define any number of tabs with custom labels
- **Multiple Sizes**: Small, medium (default), and large variants
- **Multiple Variants**: Default (styled) and minimal variants
- **Accessibility**: Full keyboard navigation and ARIA support
- **Disabled Tabs**: Support for individual disabled tabs
- **Consistent Styling**: Matches existing design system

### Usage

#### Basic Tabs

```tsx
import { Tabs, TabItem } from "../common";

const MyComponent = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div>
      <Tabs items={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === "overview" && <div>Overview content</div>}
      {activeTab === "details" && <div>Details content</div>}
      {activeTab === "settings" && <div>Settings content</div>}
    </div>
  );
};
```

#### Advanced Tabs

```tsx
const tabItems: TabItem[] = [
  { id: "tab1", label: "Active Tab" },
  { id: "tab2", label: "Regular Tab" },
  { id: "tab3", label: "Disabled Tab", disabled: true },
];

<Tabs
  items={tabItems}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  size="large"
  variant="minimal"
  className="my-custom-tabs"
/>;
```

### Props Interface

```tsx
interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "minimal";
}

interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}
```

### Size Variants

- **small**: Compact tabs with smaller padding and font size
- **medium**: Standard size (default)
- **large**: Larger tabs with more padding and bigger font

### Style Variants

- **default**: Full styling with gradients, backgrounds, and borders
- **minimal**: Simplified styling with flat colors and minimal decoration

### Accessibility

- **ARIA roles**: Uses `tablist`, `tab`, and `tabpanel` roles
- **Keyboard navigation**: Arrow keys to navigate, Enter/Space to select
- **Focus management**: Proper focus indicators and tab order
- **Screen reader support**: Proper labeling and state announcements

#### Keyboard Navigation

- **Left/Right Arrow**: Navigate between tabs
- **Enter/Space**: Activate focused tab
- **Tab**: Move focus to/from tab list

### Migrated Components

1. **LibraryPanel**: Ingredients, Formulas, Base, and Dilutions tabs
2. **IngredientCompositionModal**: Overview, Composition, Attributes, and Compliance tabs

---

## Search Component

A powerful, configurable search component that provides filtering, selection, and search functionality for any type of data. Includes support for debounced search, multiple filter types, multi-select capabilities, and custom rendering.

### Features

- **Generic Type Support**: Works with any data type using TypeScript generics
- **Multiple Search Fields**: Search across multiple object properties simultaneously
- **Configurable Filters**: Text, select, multiSelect, range, and boolean filter types
- **Debounced Search**: 300ms configurable debounce for performance optimization
- **Multi-Select Support**: Checkbox-based multi-selection with selection controls
- **Custom Rendering**: Complete control over how items are displayed
- **Exclude Logic**: Exclude specific items from results (useful for "already added" scenarios)
- **Keyboard Navigation**: Arrow keys, Enter, and ESC support
- **Accessibility**: Proper ARIA labels and screen reader support

### Usage

#### Basic Search

```tsx
import { Search } from "../../common";
import { Ingredient } from "../models/Ingredient";

const BasicSearchExample = () => {
  return (
    <Search<Ingredient>
      items={ingredients}
      searchFields={["name", "casNumber"]}
      placeholder="Search ingredients..."
      itemCountLabel="ingredients"
    />
  );
};
```

#### Advanced Search with Filters

```tsx
const filters: SearchFilter[] = [
  {
    id: "category",
    label: "Category",
    type: "select",
    field: "category",
    options: [
      { value: "Natural", label: "Natural" },
      { value: "Synthetic", label: "Synthetic" },
      { value: "Solvent", label: "Solvent" },
    ],
  },
  {
    id: "priceRange",
    label: "Price Range",
    type: "range",
    field: "costPerKg",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "tags",
    label: "Tags",
    type: "multiSelect",
    field: "tags",
    options: [
      { value: "organic", label: "Organic" },
      { value: "premium", label: "Premium" },
    ],
  },
];

<Search<Ingredient>
  items={ingredients}
  searchFields={["name", "casNumber", "description"]}
  filters={filters}
  placeholder="Search ingredients..."
  allowMultiSelect={true}
  isMultiSelectMode={true}
  excludeIds={alreadyAddedIds}
  onSelectionChange={handleSelectionChange}
  itemCountLabel="ingredients"
  debounceMs={500}
  maxHeight="400px"
/>;
```

#### Multi-Select with Custom Rendering

```tsx
const renderIngredient = (
  ingredient: Ingredient,
  isSelected: boolean,
  isExcluded: boolean
) => {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: isSelected ? "#fef3c7" : "white",
        opacity: isExcluded ? 0.5 : 1,
      }}
    >
      <div style={{ fontWeight: "bold" }}>{ingredient.name}</div>
      <div style={{ fontSize: "12px", color: "#666" }}>
        CAS: {ingredient.casNumber} | ${ingredient.costPerKg}/ml
      </div>
    </div>
  );
};

<Search<Ingredient>
  items={ingredients}
  searchFields={["name", "casNumber"]}
  allowMultiSelect={true}
  renderItem={renderIngredient}
  onSelectionChange={(selectedItems, selectedIds) => {
    console.log("Selected:", selectedItems.length, "items");
  }}
  excludeIds={new Set(["already-added-1", "already-added-2"])}
  placeholder="Search and select ingredients..."
  itemCountLabel="ingredients"
/>;
```

### Props Interface

```tsx
interface SearchProps<T> {
  items: T[];
  searchFields: (keyof T)[];
  placeholder?: string;
  filters?: SearchFilter[];
  allowMultiSelect?: boolean;
  isMultiSelectMode?: boolean;
  excludeIds?: Set<string>;
  onSelectionChange?: (selectedItems: T[], selectedIds: Set<string>) => void;
  renderItem?: (
    item: T,
    isSelected: boolean,
    isExcluded: boolean
  ) => React.ReactNode;
  itemCountLabel?: string;
  autoFocus?: boolean;
  debounceMs?: number;
  maxHeight?: string;
  className?: string;
}

interface SearchFilter {
  id: string;
  label: string;
  type: "text" | "select" | "multiSelect" | "range" | "boolean";
  field: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

interface SearchResult<T> {
  items: T[];
  totalCount: number;
  selectedItems: T[];
  selectedIds: Set<string>;
  searchTerm: string;
  activeFilters: Record<string, any>;
}
```

### Filter Types

#### Text Filter

```tsx
{
  id: 'description',
  label: 'Description',
  type: 'text',
  field: 'description',
  placeholder: 'Filter by description...'
}
```

#### Select Filter

```tsx
{
  id: 'category',
  label: 'Category',
  type: 'select',
  field: 'category',
  options: [
    { value: 'natural', label: 'Natural' },
    { value: 'synthetic', label: 'Synthetic' }
  ]
}
```

#### Multi-Select Filter

```tsx
{
  id: 'tags',
  label: 'Tags',
  type: 'multiSelect',
  field: 'tags',
  options: [
    { value: 'organic', label: 'Organic' },
    { value: 'premium', label: 'Premium' },
    { value: 'sustainable', label: 'Sustainable' }
  ]
}
```

#### Range Filter

```tsx
{
  id: 'price',
  label: 'Price Range',
  type: 'range',
  field: 'costPerKg',
  min: 0,
  max: 100,
  step: 0.1
}
```

#### Boolean Filter

```tsx
{
  id: 'inStock',
  label: 'In Stock',
  type: 'boolean',
  field: 'inStock'
}
```

### Multi-Select Features

- **Selection Controls**: "Select All" and "Clear" buttons
- **Selection Counter**: Shows "X of Y selected"
- **Checkbox Interface**: Visual selection indicators
- **Bulk Operations**: Handle multiple selected items efficiently
- **Exclude Logic**: Hide already selected/added items

### Accessibility

- **Keyboard Navigation**:
  - Tab: Navigate between search, filters, and items
  - Enter: Select item or toggle selection
  - Escape: Clear search or close component
  - Arrow Keys: Navigate through filtered results
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Focus Management**: Logical tab order and focus indicators
- **Selection Announcements**: Screen reader feedback for selections

### Performance Optimizations

- **Debounced Search**: Prevents excessive filtering during typing
- **Memoized Filtering**: Cached filter results for better performance
- **Virtual Scrolling Ready**: Designed to work with virtual scrolling for large datasets
- **Efficient Selection**: Set-based selection tracking for O(1) lookups

### Migrated Components

1. **IngredientSearchModal**: Reduced from 180+ to 80 lines using Search component
2. **FormulaSearchModal**: Simplified search and selection logic
3. **AttributeSearchModal**: Unified search behavior across modals
4. **LibraryPanel**: Each tab can now use consistent search interface

---

## ListItem Component

A highly configurable component for displaying list items with customizable attributes, actions, and visual variants. Supports selection, drag-and-drop preparation, and extensive customization options.

### Features

- **Configurable Attributes**: Define main and sub-attributes with custom formatting
- **Flexible Actions**: Add action buttons with icons and variants
- **Multiple Variants**: Default, compact, and detailed display modes
- **Selection Support**: Single and multi-select capabilities
- **Avatar/Badge Support**: Optional avatar images and status badges
- **Custom Rendering**: Full control over attribute display
- **TypeScript Generic**: Works with any data type
- **Accessibility**: Keyboard navigation and screen reader support
- **Consistent Styling**: Matches application design system

### Usage

#### Basic List Item

```tsx
import { ListItem } from "../../common";
import { Ingredient } from "../models/Ingredient";

const basicConfig: ListItemConfig<Ingredient> = {
  mainAttribute: {
    key: "name",
    type: "text",
  },
  subAttributes: [
    { key: "casNumber", label: "CAS", type: "text" },
    { key: "category", type: "badge" },
  ],
};

<ListItem item={ingredient} config={basicConfig} variant="default" />;
```

#### Advanced List Item with Actions

```tsx
const advancedConfig: ListItemConfig<Ingredient> = {
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
      key: "defaultConcentration",
      type: "percentage",
      format: (value) => `${value}%`,
    },
    {
      key: "costPerKg",
      label: "Cost",
      type: "custom",
      render: (value) => `$${value.toFixed(2)}/ml`,
    },
  ],
  actions: [
    {
      id: "add",
      label: "Add",
      icon: "add",
      variant: "primary",
      onClick: (ingredient) => handleAdd(ingredient),
    },
    {
      id: "info",
      label: "Info",
      icon: "info",
      variant: "ghost",
      onClick: (ingredient) => showInfo(ingredient),
    },
    {
      id: "delete",
      label: "Delete",
      icon: "delete",
      variant: "danger",
      onClick: (ingredient) => handleDelete(ingredient),
      disabled: !canDelete,
    },
  ],
  avatar: {
    key: "name",
    fallback: "?",
    render: (ingredient) => ingredient.name.charAt(0).toUpperCase(),
  },
  badge: {
    key: "category",
    variant: "info",
  },
  selectable: true,
  onClick: (ingredient) => selectIngredient(ingredient),
};

<ListItem
  item={ingredient}
  config={advancedConfig}
  selected={selectedIds.has(ingredient.id)}
  onSelectionChange={handleSelectionChange}
  variant="detailed"
/>;
```

#### Multi-Select List

```tsx
const ingredients = [
  /* ingredient data */
];
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleSelectionChange = (ingredient: Ingredient, selected: boolean) => {
  const newSelection = new Set(selectedIds);
  if (selected) {
    newSelection.add(ingredient.id);
  } else {
    newSelection.delete(ingredient.id);
  }
  setSelectedIds(newSelection);
};

{
  ingredients.map((ingredient) => (
    <ListItem
      key={ingredient.id}
      item={ingredient}
      config={selectableConfig}
      selected={selectedIds.has(ingredient.id)}
      onSelectionChange={handleSelectionChange}
      variant="compact"
    />
  ));
}
```

### Props Interface

```tsx
interface ListItemProps<T = any> {
  item: T;
  config: ListItemConfig<T>;
  selected?: boolean;
  onSelectionChange?: (item: T, selected: boolean) => void;
  index?: number;
  isLast?: boolean;
  variant?: "default" | "compact" | "detailed";
}

interface ListItemConfig<T = any> {
  mainAttribute: ListItemAttribute;
  subAttributes?: ListItemAttribute[];
  actions?: ListItemAction[];
  selectable?: boolean;
  draggable?: boolean;
  avatar?: {
    key: string;
    fallback?: string;
    render?: (item: T) => React.ReactNode;
  };
  badge?: {
    key: string;
    variant?: "success" | "warning" | "error" | "info" | "neutral";
    render?: (value: any, item: T) => React.ReactNode;
  };
  onClick?: (item: T) => void;
  onDoubleClick?: (item: T) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ListItemAttribute {
  key: string;
  label?: string;
  type?: "text" | "number" | "badge" | "date" | "percentage" | "custom";
  format?: (value: any) => string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface ListItemAction {
  id: string;
  label: string;
  icon?: IconName;
  onClick: (item: any) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  tooltip?: string;
}
```

### Attribute Types

#### Text Attribute

```tsx
{ key: 'name', type: 'text' }
{ key: 'description', label: 'Description', type: 'text' }
```

#### Number Attribute

```tsx
{ key: 'quantity', label: 'Qty', type: 'number' }
{ key: 'price', type: 'number', format: (value) => `$${value}` }
```

#### Badge Attribute

```tsx
{ key: 'status', type: 'badge' }
{ key: 'category', type: 'badge' }
```

#### Date Attribute

```tsx
{ key: 'createdAt', label: 'Created', type: 'date' }
{ key: 'lastModified', type: 'date' }
```

#### Percentage Attribute

```tsx
{ key: 'completion', type: 'percentage' }
{ key: 'concentration', type: 'percentage' }
```

#### Custom Attribute

```tsx
{
  key: 'complexity',
  type: 'custom',
  render: (value, item) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: value }, (_, i) => (
        <span key={i}>⭐</span>
      ))}
    </div>
  )
}
```

### Action Variants

#### Primary Action

```tsx
{
  id: 'save',
  label: 'Save',
  icon: 'save',
  variant: 'primary',
  onClick: handleSave
}
```

#### Secondary Action

```tsx
{
  id: 'edit',
  label: 'Edit',
  icon: 'edit',
  variant: 'secondary',
  onClick: handleEdit
}
```

#### Danger Action

```tsx
{
  id: 'delete',
  label: 'Delete',
  icon: 'delete',
  variant: 'danger',
  onClick: handleDelete,
  tooltip: 'Delete this item permanently'
}
```

#### Ghost Action

```tsx
{
  id: 'info',
  label: 'Info',
  icon: 'info',
  variant: 'ghost',
  onClick: showInfo
}
```

### Visual Variants

#### Default Variant

- Standard padding and font sizes
- Good balance of information and whitespace
- Most common use case

#### Compact Variant

- Reduced padding and smaller fonts
- Suitable for sidebars and dense lists
- 32px avatar, smaller action buttons

#### Detailed Variant

- Increased padding and larger fonts
- More breathing room between elements
- 48px avatar, emphasis on readability

### Badge Variants

- **success**: Green background, for positive states
- **warning**: Yellow background, for caution states
- **error**: Red background, for error states
- **info**: Blue background, for informational states
- **neutral**: Gray background, for neutral states

### Avatar Support

#### Text Avatar

```tsx
avatar: {
  key: 'name',
  fallback: '?',
  render: (item) => item.name.charAt(0).toUpperCase()
}
```

#### Image Avatar

```tsx
avatar: {
  key: 'profileImage',
  fallback: 'U',
  render: (item) => (
    <img
      src={item.profileImage}
      alt={item.name}
      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
    />
  )
}
```

#### Icon Avatar

```tsx
avatar: {
  key: 'type',
  render: (item) => <Icon name={getIconForType(item.type)} />
}
```

### Accessibility

- **Keyboard Navigation**: Tab through selectable items and actions
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Indicators**: Clear visual focus states
- **Selection Announcements**: Screen reader feedback for selections
- **Action Tooltips**: Optional tooltips for action buttons

### Usage Patterns

#### Ingredients List

```tsx
const ingredientConfig: ListItemConfig<Ingredient> = {
  mainAttribute: { key: "name" },
  subAttributes: [
    { key: "casNumber", label: "CAS" },
    { key: "defaultConcentration", type: "percentage" },
  ],
  actions: [
    { id: "add", icon: "add", variant: "primary", onClick: addIngredient },
  ],
  avatar: { key: "name", fallback: "I" },
  selectable: true,
};
```

#### Formulas List

```tsx
const formulaConfig: ListItemConfig<Formula> = {
  mainAttribute: { key: "name" },
  subAttributes: [
    { key: "description" },
    { key: "ingredientCount", label: "Ingredients", type: "number" },
    { key: "lastModified", type: "date" },
  ],
  actions: [
    {
      id: "replace",
      icon: "replace",
      variant: "primary",
      onClick: replaceFormula,
    },
    { id: "merge", icon: "merge", variant: "secondary", onClick: mergeFormula },
    {
      id: "compare",
      icon: "compare",
      variant: "ghost",
      onClick: compareFormula,
    },
  ],
  badge: { key: "status", variant: "info" },
};
```

#### Users List

```tsx
const userConfig: ListItemConfig<User> = {
  mainAttribute: { key: "fullName" },
  subAttributes: [
    { key: "email" },
    { key: "role", type: "badge" },
    { key: "lastLogin", type: "date" },
  ],
  avatar: { key: "profileImage", fallback: "U" },
  badge: { key: "status", variant: "success" },
};
```

### Migrated Components

1. **LibraryPanel Ingredients**: Simplified ingredient display logic
2. **LibraryPanel Formulas**: Unified formula list presentation
3. **ActiveFormulaColumn**: Consistent ingredient item display
4. **ReferenceFormulaColumn**: Standardized formula reference items

---

## Import Reference

```tsx
// Import all components
import { Modal, Dropdown, Tabs, Search, ListItem } from "../../common";

// Import with types
import { Modal, ModalSize } from "../../common";
import { Dropdown, DropdownMenuItem } from "../../common";
import { Tabs, TabItem, TabsProps } from "../../common";
import { Search, SearchFilter, SearchProps } from "../../common";
import { ListItem, ListItemConfig, ListItemAction } from "../../common";
```

## Component Architecture Benefits

- **🔄 Code Reusability**: Single implementation for common UI patterns
- **🎨 Consistency**: Standardized behavior and styling across the application
- **🛠️ Maintainability**: Changes to UI patterns happen in one place
- **♿ Accessibility**: Built-in keyboard navigation and ARIA support
- **📏 Type Safety**: Complete TypeScript support with proper interfaces
- **🚀 Performance**: Optimized implementations with proper cleanup
- **🔧 Configurability**: Extensive customization options without code duplication

## Migration Pattern

When migrating custom implementations to reusable components:

1. **Identify common patterns** in existing components
2. **Extract shared functionality** into reusable component
3. **Define clear prop interfaces** with TypeScript
4. **Add accessibility features** (keyboard navigation, ARIA)
5. **Refactor existing components** to use new reusable component
6. **Remove duplicate code** and styled components
7. **Update documentation** and usage examples

## Future Components

Planned additions to the common components library:

- **Button**: Standardized button variants and sizes
- **Input**: Form input components with validation
- **Select**: Dropdown select components
- **Tooltip**: Hover information displays
- **Badge**: Status and count indicators
- **Card**: Content container layouts
- **Table**: Data table with sorting and filtering
- **Pagination**: Page navigation controls

## Documentation Standards

When adding new components to this library:

### Component Structure

```
common/
├── ComponentName.tsx       # Component implementation
├── index.ts               # Export declarations
└── README.md             # All documentation (this file)
```

### Documentation Format

Each new component should be documented in this README.md file with:

1. **Component Section Header** - Use `## ComponentName Component`
2. **Features List** - Bullet points of key features
3. **Usage Examples** - Basic and advanced usage patterns
4. **Props Interface** - Complete TypeScript interface
5. **Variants/Options** - All available customization options
6. **Accessibility** - Keyboard navigation and ARIA support details
7. **Migrated Components** - List of components that now use this reusable component

### File Naming Conventions

- Component files: `PascalCase.tsx`
- Type exports: Match the component name + `Props`
- Keep individual component documentation in this single README.md
- No separate `.md` files per component

### Import Structure

```tsx
// Component exports
export { default as ComponentName } from "./ComponentName";
export type { ComponentNameProps, ComponentNameOption } from "./ComponentName";
```

This ensures consistent documentation structure as the component library grows.
