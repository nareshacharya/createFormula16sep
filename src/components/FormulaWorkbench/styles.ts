import styled from "styled-components";

// Typography scale for consistency
const FONT_SIZES = {
  xs: '10px',      // Small badges, micro text  
  sm: '12px',      // Labels, secondary text
  base: '14px',    // Body text, data values  
  md: '16px',      // Primary text, ingredient names
  lg: '18px',      // Section headers, panel titles
  xl: '20px',      // Main titles
} as const;

// Main container for the 2-panel layout
export const WorkbenchContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
  font-family: 'Inter', sans-serif;
`;

// Panel 1: Left sidebar with tabs (now collapsible)
export const LibraryContainer = styled.div<{ $collapsed?: boolean }>`
  width: ${props => props.$collapsed ? '48px' : '360px'};
  max-width: ${props => props.$collapsed ? '48px' : '360px'};
  min-width: ${props => props.$collapsed ? '48px' : '360px'};
  transition: all 0.3s ease;
  border-right: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;


export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  color: #333333;
  border-bottom: 1px solid #e5e7eb;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: ${FONT_SIZES.lg}; /* 16px - section headers */
  font-weight: 600;
  color: #222222;
`;

export const CollapseButton = styled.button<{ $collapsed?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #374151;
  }
`;

// Formula Canvas Panel
export const FormulaCanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto; /* Allow scrolling instead of hidden */
  min-height: 0; /* Allow flex item to shrink below content size */
`;

export const CanvasHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  height: 52px;
  padding: 4px 24px;
`;



export const CanvasTitle = styled.h2`
  margin: 0;
  font-size: ${FONT_SIZES.xl}; /* 18px - main titles */
  font-weight: 600;
  color: #222222;
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-width: 120px;
  position: relative;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
    border-radius: 8px 8px 0 0;
  }
`;



export const SummaryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${FONT_SIZES.xs}; /* 10px - compact labels */
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  line-height: 1.2;
`;

export const SummaryValue = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: ${FONT_SIZES.lg}; /* 18px - more prominent values */
  text-align: center;
  line-height: 1.2;
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Remove the old FormulaSummaryRow as it's now integrated
// Keep export for backward compatibility - maps to single row layout
export const FormulaSummaryRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e5e7eb;
  font-size: ${FONT_SIZES.base}; /* 14px - consistent with data */
  min-height: 80px;
`;

export const ComplianceStatus = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 14px;
  font-size: ${FONT_SIZES.xs}; /* 10px - compact status badges */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  min-width: 70px;
  justify-content: center;
  
  ${props => {
    switch (props.$status) {
      case 'compliant':
        return `
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          color: #166534;
          border-color: #bbf7d0;
          box-shadow: 0 1px 3px rgba(34, 197, 94, 0.12);
        `;
      case 'non-compliant':
        return `
          background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
          color: #991b1b;
          border-color: #fca5a5;
          box-shadow: 0 1px 3px rgba(239, 68, 68, 0.12);
        `;
      case 'pending':
        return `
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          color: #92400e;
          border-color: #fde68a;
          box-shadow: 0 1px 3px rgba(245, 158, 11, 0.12);
        `;
      default:
        return `
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #64748b;
          border-color: #e2e8f0;
          box-shadow: 0 1px 3px rgba(100, 116, 139, 0.08);
        `;
    }
  }}
    
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export const BatchSizeInput = styled.input`
  width: 70px;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: ${FONT_SIZES.base}; /* 14px - consistent with data */
  font-weight: 600;
  text-align: center;
  background: white;
  color: #1e293b;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #fefefe;
  }
  
  &:hover {
    border-color: #9ca3af;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

// Combined Canvas Header with Summary
export const CombinedCanvasHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  height: 52px; /* Match Library panel's header + tab container height */
  padding: 0px 48px 0 24px;
  gap: 24px;
`;

export const CanvasHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const CanvasHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SummaryItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const CompactSummaryItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  min-width: 80px;
  padding: 9px 12px;
`;

export const CompactSummaryLabel = styled.div`
  font-size: ${FONT_SIZES.xs}; /* 10px - compact labels */
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  line-height: 1.2;
`;

export const CompactSummaryValue = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: ${FONT_SIZES.lg}; /* 16px - readable values */
  text-align: center;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BatchSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
`;

export const SimpleBatchInput = styled.input`
  width: 60px;
  padding: 2px 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: ${FONT_SIZES.sm}; /* 12px */
  font-weight: 600;
  text-align: center;
  background: white;
  color: #1e293b;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

// Panel 2: Formula Canvas and reference columns area

// Tab system
export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
  padding: 4px 4px 0 4px;
  gap: 2px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      : "transparent"
  };
  color: ${(props) => (props.$active ? "#ffffff" : "#6b7280")};
  font-weight: ${(props) => (props.$active ? 600 : 400)};
  font-size: 14px;
  cursor: pointer;

  position: relative;
  border-radius: ${(props) => (props.$active ? "6px 6px 0 0" : "0")};
  
  &:hover {
    background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #2563eb, #1e40af)"
      : "linear-gradient(135deg, #f8fafc, #f1f5f9)"
  };
    color: ${(props) => (props.$active ? "#ffffff" : "#1f2937")};
    transform: ${(props) => (props.$active ? "none" : "translateY(-1px)")};
  }
  
  &:focus {
    outline: none;
  }

  &:active {
    transform: ${(props) => (props.$active ? "scale(0.98)" : "translateY(0)")};
  }

  /* Add a subtle bottom border for inactive tabs */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${(props) => (props.$active ? "transparent" : "#e5e7eb")};
    transition: all 0.3s ease;
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0px;
  width: 100%;
`;

// Search input
export const SearchInput = styled.input`
  width: Calc(100% - 16px);
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: ${FONT_SIZES.md}; /* 14px - input text */
  margin: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// Ingredient list
export const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const IngredientItem = styled.div<{ $isAdded?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 1px;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: ${props => props.$isAdded ? '#B8EBC8' : '#3b82f6'};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: ${props => props.$isAdded ? '#f0fdf4' : '#f8faff'};
  }
  
  ${props => props.$isAdded && `
    border-color: #B8EBC8;
    background: #f0fdf4;
  `}
`;

export const IngredientInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const IngredientName = styled.div`
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 1px; /* Reduced margin */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${FONT_SIZES.base}; /* Reduced to 12px for compactness */
  line-height: 1.2;
`;

export const IngredientCAS = styled.div`
  font-size: 11px; /* Smaller font size */
  color: #6b7280;
  line-height: 1.2;
`;

export const AddedIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #B8EBC8;
  flex-shrink: 0;
`;

export const IconButton = styled.button`
  width: 26px;
  height: 24px;
  padding: 0;
  background: transparent;
  color: #6b7280;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
    color: #374151;
  }
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
`;

// Formula list
export const FormulaList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormulaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px; /* Further reduced for compactness */
  border-top: 1px solid #e5e7eb;
  background: white;
`;

export const FormulaActions = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Multi-selection components
export const SelectionModeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: ${FONT_SIZES.sm};
  color: #64748b;
`;

export const SelectionActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SelectionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: ${FONT_SIZES.xs};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${props => props.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: #64748b;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f1f5f9;
      color: #475569;
    }
  `}
`;

export const FormulaCheckbox = styled.input`
  width: 16px;
  height: 16px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #3b82f6;
`;

export const FormulaItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

export const FormulaDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  
  &:hover {
    background: rgba(107, 114, 128, 0.1);
    color: #374151;
  }
  
  &:active {
    background: rgba(107, 114, 128, 0.15);
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10000;
  min-width: 180px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-top: 4px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: ${FONT_SIZES.sm}; /* 12px - dropdown item text */
  color: #374151;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
  
  &:only-child {
    border-radius: 6px;
  }
  
  & + & {
    border-top: 1px solid #f3f4f6;
  }
`;

export const DropdownOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: transparent;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

// Grouped columns container
export const GroupedColumnsContainer = styled.div`
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: auto; /* Allow vertical scrolling instead of hidden */
  padding: 8px;
  gap: 8px;
  min-height: 0;
  height: 100%; /* Take full available height */
  align-items: stretch; /* Stretch children to full height */
  /* Remove fixed height to allow dynamic sizing */
`;

export const GroupedColumn = styled.div<{ $collapsed?: boolean }>`
  min-width: ${props => props.$collapsed ? '60px' : '420px'};
  max-width: ${props => props.$collapsed ? '60px' : 'none'}; /* Remove max-width constraint */
  width: ${props => props.$collapsed ? '60px' : 'auto'};
  flex-shrink: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: ${props => props.$collapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
  align-self: stretch;
  height: auto; /* Ensure full height */
  min-height: 100%; /* Minimum full height */
  
  ${props => props.$collapsed && `
    position: relative;
    justify-content: flex-start;
    padding: 8px 0;
    min-height: 100%; /* Full height even when collapsed */
  `}
`;

// Special variant for Active Formula Column - auto height based on content
export const ActiveGroupedColumn = styled.div`
  min-width: 400px;
  max-width: 530px;
  flex-shrink: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  transition: all 0.3s ease;
  height: auto; /* Auto height based on content */
  /* No min-height constraint - let content determine height */
`;

export const ColumnHeader = styled.div<{ $variant?: 'active' | 'reference' | 'attributes' | 'notes' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11.5px 16px;
  background: white;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  
  h3 {
    margin: 0;
    font-size: ${FONT_SIZES.lg}; /* 16px - column headers */
    font-weight: 600;
    color: #1f2937;
  }
`;

export const CollapsibleColumnHeader = styled.div<{ $variant?: 'active' | 'reference' | 'attributes' | 'notes' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11.5px 16px;
  background: white;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  min-height: 52px;
  flex-shrink: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  h3 {
    margin: 0;
    font-size: ${FONT_SIZES.lg}; /* 16px - column headers */
    font-weight: 600;
    color: #1f2937;
  }
`;

export const CollapsedColumnHeader = styled.div<{ $variant?: 'active' | 'reference' | 'attributes' | 'notes' }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 8px;
  background: white;
  color: #1f2937;
  border-bottom: none;
  min-height: 60px;
  flex-shrink: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: relative;
  flex-direction: column;
  height: 100%;

  h3 {
    margin: 0;
    font-size: ${FONT_SIZES.lg}; /* 16px - column headers */
    font-weight: 600;
    color: #1f2937;
  }
`;

export const Badge = styled.span<{ $variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: ${FONT_SIZES.sm}; /* 11px - badges */
  font-weight: 500;
  letter-spacing: 0.025em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #334155;
          border-color: #cbd5e1;
          box-shadow: 0 1px 2px rgba(148, 163, 184, 0.1);
        `;
      case 'secondary':
        return `
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          color: #92400e;
          border-color: #fde68a;
          box-shadow: 0 1px 2px rgba(217, 119, 6, 0.1);
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          color: #166534;
          border-color: #bbf7d0;
          box-shadow: 0 1px 2px rgba(34, 197, 94, 0.1);
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          color: #a16207;
          border-color: #fde68a;
          box-shadow: 0 1px 2px rgba(245, 158, 11, 0.1);
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1e40af;
          border-color: #bfdbfe;
          box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
        `;
      default:
        return `
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #475569;
          border-color: #e2e8f0;
          box-shadow: 0 1px 2px rgba(100, 116, 139, 0.08);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
  }
`;

// Table components
export const TableContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow shrinking */
  /* Take full height and allow scrolling when needed */
`;

// Special table container for Active Formula - auto height, no scrolling
export const ActiveTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: visible;
  /* Auto-adjust height based on content without scrolling */
`;

export const TableHeader = styled.div<{ variant?: 'active' | 'reference' | 'attributes' | 'notes' }>`
  display: grid;
  grid-template-columns: 2fr 1.1fr 1.1fr 1.1fr 0.4fr;
  gap: 8px;
  padding: 2px 16px;
  background: white;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: ${FONT_SIZES.base}; /* 14px - table headers */
  letter-spacing: 0.05em;
  height: 48px;
  align-items: center;
  flex-shrink: 0;
`;

export const TableHeaderCell = styled.div`
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.1fr 1.1fr 1.1fr 0.4fr;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  height: 48px;
  
  &:hover {
    background: #f9fafb;
  }
`;

export const TableCell = styled.div`
  font-size: ${FONT_SIZES.base}; /* 14px - table data */
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EditableInput = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  font-size: ${FONT_SIZES.base}; /* 13px - input consistency */
  height:28px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

export const ActionButton = styled.button`
  padding: 4px;
  background: transparent;
  color: #ef4444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
`;

// Diff indicators
export const DiffIndicator = styled.span<{ type: "positive" | "negative" | "new" | "neutral" }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: ${FONT_SIZES.xs}; /* 10px - micro indicators */
  font-weight: 600;
  min-width: 58px;
  text-align: center;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.type) {
      case "positive":
        return `
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          color: #166534;
          border-color: #bbf7d0;
          box-shadow: 0 1px 2px rgba(34, 197, 94, 0.1);
        `;
      case "negative":
        return `
          background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
          color: #991b1b;
          border-color: #fca5a5;
          box-shadow: 0 1px 2px rgba(239, 68, 68, 0.1);
        `;
      case "new":
        return `
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1e40af;
          border-color: #bfdbfe;
          box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
        `;
      default:
        return `
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #64748b;
          border-color: #e2e8f0;
          box-shadow: 0 1px 2px rgba(100, 116, 139, 0.08);
        `;
    }
  }}
    
  &:hover {
    transform: translateY(-1px);
  }
`;

// Attributes
export const AttributeGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const AttributeRow = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 16px;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

export const AttributeLabel = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: ${FONT_SIZES.base}; /* 13px - attribute labels */
`;

export const AttributeValue = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: ${FONT_SIZES.sm}; /* 12px - attribute values */
  
  span:first-child {
    color: #6b7280;
  }
  
  span:last-child {
    font-weight: 500;
    color: #1f2937;
  }
`;

// Notes
export const NotesInput = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: ${FONT_SIZES.base}; /* 13px - notes input */
  font-family: inherit;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

// Empty state
export const EmptyState = styled.div`
  padding: 32px 16px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  font-size: ${FONT_SIZES.md}; /* 14px - empty state text */
`;

// Column sub-header for reference formulas/attributes
export const ColumnSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  height: 48px;
  
  strong {
    font-size: ${FONT_SIZES.md}; /* 14px - sub-header text */
    font-weight: 600;
  }
`;

// Table row container for consistent styling
export const TableRowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  height: 48px;
  font-size: ${FONT_SIZES.base}; /* 14px - row data */
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
`;
