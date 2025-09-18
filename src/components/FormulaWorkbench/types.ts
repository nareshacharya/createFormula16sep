export interface PanelProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export interface CollapsibleColumnProps {
    isCollapsed: boolean;
    onToggle: () => void;
    title: string;
    count?: number;
    onAdd?: () => void;
    showAddButton?: boolean;
}

export interface FormulaSummary {
    totalWeight: number;
    totalCost: number;
    ingredientCount: number;
    totalConcentration: number;
    complianceStatus: 'compliant' | 'non-compliant' | 'pending' | 'unknown';
    batchSize: number;
    batchUnit: 'ml' | 'g';
}

export interface FormulaAction {
    label: string;
    icon: string;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'danger';
}

export interface WorkbenchIngredient {
    id: string;
    name: string;
    concentration: number;
    quantity: number;
    cost: number;
    casNumber?: string;
    attributes?: Record<string, any>;
}

export interface WorkbenchFormula {
    id: string;
    name: string;
    description?: string;
    ingredients: WorkbenchIngredient[];
}

export type TabType = "ingredients" | "formulas" | "base" | "dilutions";

export interface DiffResult {
    type: "positive" | "negative" | "neutral" | "new";
    text: string;
}

export interface NotesState {
    [ingredientId: string]: string;
}

export interface AttributeColumn {
    id: string;
    name: string;
    type: 'text' | 'number' | 'boolean';
    unit?: string;
}