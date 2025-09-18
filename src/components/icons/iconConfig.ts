import {
    faPlus,
    faMinus,
    faTrash,
    faEdit,
    faCopy,
    faSave,
    faSearch,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faArrowLeft,
    faArrowRight,
    faTimes,
    faEye,
    faEyeSlash,
    faUpload,
    faDownload,
    faFlask,
    faVial,
    faStickyNote,
    faClipboardList,
    faCalculator,
    faCog,
    faExclamationTriangle,
    faCheckCircle,
    faInfoCircle,
    faCaretRight,
    faCaretDown,
    faEllipsisVertical,
    faChartBar,
    faCodeMerge,
    faRotateRight,
    faBalanceScale,
    faDollarSign,
    faEuroSign,
    faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';

// Centralized icon configuration
export const ICONS = {
    // Action icons
    add: faPlus,
    remove: faMinus,
    delete: faTrash,
    edit: faEdit,
    copy: faCopy,
    save: faSave,
    search: faSearch,

    // Navigation icons
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
    chevronDown: faChevronDown,
    chevronUp: faChevronUp,
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,
    caretRight: faCaretRight,
    caretDown: faCaretDown,

    // UI state icons
    close: faTimes,
    expand: faChevronRight,
    collapse: faChevronLeft,
    show: faEye,
    hide: faEyeSlash,
    menu: faEllipsisVertical,
    gripLinesVertical: faGripLinesVertical,

    // File operations
    upload: faUpload,
    download: faDownload,

    // Application specific
    formula: faFlask,
    ingredient: faVial,
    notes: faStickyNote,
    attributes: faClipboardList,
    calculator: faCalculator,
    settings: faCog,
    balanceScale: faBalanceScale,
    dollarSign: faDollarSign,
    euroSign: faEuroSign,

    // Formula actions
    compare: faChartBar,
    merge: faCodeMerge,
    replace: faRotateRight,

    // Status icons
    warning: faExclamationTriangle,
    success: faCheckCircle,
    info: faInfoCircle,
} as const;

// Icon size configurations
export const ICON_SIZES = {
    xs: '0.75rem',  // 12px
    sm: '0.875rem', // 14px
    base: '1rem',   // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',  // 20px
} as const;

// Icon color themes
export const ICON_COLORS = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#3bc989',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: '#9ca3af',
    white: '#ffffff',
} as const;

// Helper type for icon names
export type IconName = keyof typeof ICONS;
export type IconSize = keyof typeof ICON_SIZES;
export type IconColor = keyof typeof ICON_COLORS;
