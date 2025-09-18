export const colors = {
  // Primary colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  success: {
    50: '#ECFDF5',
    500: '#B8EBC8',
    600: '#059669',
  },

  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },

  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },

  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
  },
} as const

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Semantic typography styles
  semantic: {
    // Panel and section headers
    panelTitle: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.25,
      color: '#1F2937', // neutral.800
    },

    // Subsection headers
    sectionTitle: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.25,
      color: '#374151', // neutral.700
    },

    // Table headers
    tableHeader: {
      fontSize: '0.75rem', // 12px
      fontWeight: 600,
      lineHeight: 1.25,
      color: '#374151', // neutral.700
    },

    // Body text
    body: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#374151', // neutral.700
    },

    // Small text (labels, captions)
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#6B7280', // neutral.500
    },

    // Form labels
    label: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.25,
      color: '#374151', // neutral.700
    },

    // Button text
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.25,
    },

    // Tab text
    tab: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.25,
    },

    // Badge text
    badge: {
      fontSize: '0.625rem', // 10px
      fontWeight: 500,
      lineHeight: 1.25,
    },
  },
} as const

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  base: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const

// Component-specific theme tokens
export const components = {
  panel: {
    background: '#FFFFFF',
    border: '#E5E7EB', // neutral.200
    headerBackground: {
      left: '#7c3aed', // Purple
      middle: '#0ea5e9', // Sky blue
      right: '#059669', // Emerald green
    },
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  button: {
    primary: {
      background: '#3B82F6', // primary.500
      backgroundHover: '#2563EB', // primary.600
      color: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      background: '#F3F4F6', // neutral.100
      backgroundHover: '#E5E7EB', // neutral.200
      color: '#374151', // neutral.700
      border: '#E5E7EB', // neutral.200
    },
    danger: {
      background: '#EF4444', // error.500
      backgroundHover: '#DC2626', // error.600
      color: '#FFFFFF',
      border: 'transparent',
    },
    ghost: {
      background: 'transparent',
      backgroundHover: '#F3F4F6', // neutral.100
      color: '#6B7280', // neutral.500
      border: 'transparent',
    },
  },

  badge: {
    success: {
      background: '#DCFCE7', // success.50 equivalent
      color: '#16A34A', // success.600 equivalent
    },
    error: {
      background: '#FEE2E2', // error.50
      color: '#DC2626', // error.600
    },
    warning: {
      background: '#FEF3C7', // warning.50 equivalent
      color: '#D97706', // warning.600
    },
    info: {
      background: '#DBEAFE', // info.100
      color: '#2563EB', // info.600
    },
    neutral: {
      background: '#F3F4F6', // neutral.100
      color: '#374151', // neutral.700
    },
    active: {
      background: '#B8EBC8', // success.500
      color: '#FFFFFF',
    },
  },

  table: {
    headerBackground: '#F9FAFB', // neutral.50
    rowHover: '#F9FAFB', // neutral.50
    border: '#E5E7EB', // neutral.200
    cell: {
      padding: '10px 8px',
    },
  },

  tab: {
    active: {
      background: '#3B82F6', // primary.500
      color: '#FFFFFF',
    },
    inactive: {
      background: '#F3F4F6', // neutral.100
      color: '#6B7280', // neutral.500
    },
    hover: {
      background: '#E5E7EB', // neutral.200
    },
  },

  input: {
    background: '#FFFFFF',
    border: '#D1D5DB', // neutral.300
    borderFocus: '#3B82F6', // primary.500
    placeholder: '#9CA3AF', // neutral.400
  },

  matrix: {
    scroll: {
      track: '#F3F4F6', // neutral.100
      thumb: '#D1D5DB', // neutral.300
      thumbHover: '#9CA3AF', // neutral.400
    },
  },
} as const

export type ColorScheme = typeof colors
export type Typography = typeof typography
export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Breakpoints = typeof breakpoints
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Components = typeof components

// Combined theme object for easy access
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  components,
} as const

export type Theme = typeof theme 