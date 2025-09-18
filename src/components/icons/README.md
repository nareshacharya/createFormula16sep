# FontAwesome Icons Usage Guide

This project uses FontAwesome icons through a centralized configuration system for consistency and easy maintenance.

## Quick Start

Import the Icon component and use it with predefined icon names:

```tsx
import { Icon } from '../icons';

// Basic usage
<Icon name="add" />

// With size and color
<Icon name="delete" size="lg" color="error" />

// With click handler
<Icon name="search" onClick={handleSearch} />
```

## Available Icons

### Action Icons

- `add` - Plus icon for adding items
- `remove` - Minus icon for removing items
- `delete` - Trash icon for deleting items
- `edit` - Edit icon for editing content
- `copy` - Copy icon for duplicating content
- `save` - Save icon for saving data
- `search` - Search/magnifying glass icon

### Navigation Icons

- `chevronLeft` - Left chevron for navigation
- `chevronRight` - Right chevron for navigation
- `chevronDown` - Down chevron for dropdowns
- `chevronUp` - Up chevron for collapse
- `arrowLeft` - Left arrow for back actions
- `arrowRight` - Right arrow for forward actions
- `caretRight` - Right caret for expansion
- `caretDown` - Down caret for collapse

### UI State Icons

- `close` - X icon for closing modals/panels
- `expand` - Icon for expanding panels
- `collapse` - Icon for collapsing panels
- `show` - Eye icon for showing content
- `hide` - Eye-slash icon for hiding content

### File Operations

- `upload` - Upload icon for file uploads
- `download` - Download icon for file downloads

### Application Specific

- `formula` - Flask icon for formulas
- `ingredient` - Vial icon for ingredients
- `notes` - Sticky note icon for notes
- `attributes` - Clipboard icon for attributes
- `calculator` - Calculator icon for calculations
- `settings` - Cog icon for settings

### Status Icons

- `warning` - Warning triangle for alerts
- `success` - Check circle for success states
- `info` - Info circle for information

## Icon Sizes

```tsx
// Available sizes
<Icon name="add" size="xs" />    // 12px
<Icon name="add" size="sm" />    // 14px
<Icon name="add" size="base" />  // 16px (default)
<Icon name="add" size="lg" />    // 18px
<Icon name="add" size="xl" />    // 20px
```

## Icon Colors

```tsx
// Predefined colors
<Icon name="success" color="success" />  // Green
<Icon name="warning" color="warning" />  // Yellow
<Icon name="delete" color="error" />     // Red
<Icon name="info" color="primary" />     // Blue
<Icon name="text" color="secondary" />   // Gray

// Custom colors
<Icon name="add" color="#ff0000" />      // Custom hex color
```

## Button Integration

Icons work seamlessly with styled buttons:

```tsx
// Action buttons
<ActionButton onClick={handleDelete}>
  <Icon name="delete" size="sm" color="white" />
  Delete
</ActionButton>

// Icon-only buttons
<IconButton onClick={handleAdd} title="Add item">
  <Icon name="add" size="sm" />
</IconButton>

// Collapse buttons
<CollapseButton onClick={togglePanel}>
  <Icon name={isCollapsed ? "expand" : "collapse"} size="sm" />
</CollapseButton>
```

## Customization

### Adding New Icons

1. Add the icon to `src/components/icons/iconConfig.ts`:

```tsx
import { faNewIcon } from "@fortawesome/free-solid-svg-icons";

export const ICONS = {
  // ... existing icons
  newIcon: faNewIcon,
} as const;
```

2. Use the new icon:

```tsx
<Icon name="newIcon" />
```

### Updating Icon Mappings

To change which FontAwesome icon is used for a specific name, simply update the mapping in `iconConfig.ts`:

```tsx
export const ICONS = {
  // Change delete icon from trash to times
  delete: faTimes, // was faTrash
} as const;
```

### Custom Styling

You can apply custom styles while maintaining the icon system:

```tsx
<Icon
  name="add"
  style={{
    transform: "rotate(45deg)",
    marginRight: "8px",
  }}
/>
```

## Best Practices

1. **Use semantic names**: Choose icon names that describe the action, not the visual appearance
2. **Consistent sizing**: Use predefined sizes for visual consistency
3. **Color consistency**: Use predefined colors that match your design system
4. **Accessibility**: Always provide `title` props for icon-only buttons
5. **Performance**: Icons are tree-shaken, only imported icons are bundled

## Migration from Emoji/Text Icons

Replace emoji and text-based icons with FontAwesome icons:

```tsx
// Before
<button>🗑️</button>
<button>×</button>
<button>▶</button>
<button>✓</button>

// After
<IconButton><Icon name="delete" /></IconButton>
<IconButton><Icon name="close" /></IconButton>
<IconButton><Icon name="expand" /></IconButton>
<IconButton><Icon name="success" /></IconButton>
```

This provides:

- Better accessibility
- Consistent visual appearance
- Easy theme integration
- Scalable vector graphics
- Better browser compatibility
