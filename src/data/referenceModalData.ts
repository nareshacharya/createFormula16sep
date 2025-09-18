export interface ReferenceItem {
    id: string;
    name: string;
    description: string;
    type?: string;
    unit?: string;
    metadata?: any;
    [key: string]: any;
}

export interface ReferenceModalConfig {
    type: 'formulas' | 'attributes';
    title: string;
    placeholder: string;
    searchFields: string[];
    itemCountLabel: string;
    addButtonLabel: string;
    data: ReferenceItem[];
    renderItemContent: (item: ReferenceItem) => {
        title: string;
        subtitle: string;
        badge?: string;
    };
    getItemId: (item: ReferenceItem) => string;
    getExcludeIds: (selectedItems: any[]) => Set<string>;
}

// Formula data configuration
export const formulaModalConfig: ReferenceModalConfig = {
    type: 'formulas',
    title: 'Add Reference Formulas',
    placeholder: 'Search formulas by name, base, or ingredients...',
    searchFields: ['metadata.name', 'metadata.base', 'name'],
    itemCountLabel: 'formulas',
    addButtonLabel: 'Add Selected',
    data: [], // This will be passed as prop
    renderItemContent: (formula: ReferenceItem) => ({
        title: formula?.metadata?.name || formula?.name || 'Unnamed Formula',
        subtitle: `${formula.ingredients?.length || 0} ingredients • ${formula.metadata?.base || 'Unknown base'
            } • €${formula.metadata?.cost || '0'}/kg`,
    }),
    getItemId: (formula: ReferenceItem) => formula.metadata?.id || formula.id,
    getExcludeIds: (selectedFormulas: any[]) =>
        new Set(selectedFormulas.map((f) => f.metadata?.id || f.id)),
};

// Attribute data configuration
export const attributeModalConfig: ReferenceModalConfig = {
    type: 'attributes',
    title: 'Add Reference Attributes',
    placeholder: 'Search attributes...',
    searchFields: ['name', 'description'],
    itemCountLabel: 'attributes',
    addButtonLabel: 'Add Selected',
    data: [
        {
            id: 'intensity',
            name: 'intensity',
            type: 'number',
            description: 'Fragrance intensity level',
        },
        {
            id: 'family',
            name: 'family',
            type: 'text',
            description: 'Fragrance family category',
        },
        {
            id: 'note',
            name: 'note',
            type: 'text',
            description: 'Fragrance note (top, middle, base)',
        },
        {
            id: 'volatility',
            name: 'volatility',
            type: 'text',
            description: 'Volatility classification',
        },
        {
            id: 'solubility',
            name: 'solubility',
            type: 'text',
            description: 'Solubility properties',
        },
        {
            id: 'flashPoint',
            name: 'flashPoint',
            type: 'number',
            unit: '°C',
            description: 'Flash point temperature',
        },
        {
            id: 'toxicity',
            name: 'toxicity',
            type: 'text',
            description: 'Toxicity classification',
        },
        {
            id: 'vaporDensity',
            name: 'vaporDensity',
            type: 'number',
            unit: 'g/cm³',
            description: 'Vapor density measurement',
        },
    ],
    renderItemContent: (attribute: ReferenceItem) => ({
        title: `${attribute.name}${attribute.unit ? ` (${attribute.unit})` : ''}`,
        subtitle: `${attribute.description} • Type: ${attribute.type}`,
    }),
    getItemId: (attribute: ReferenceItem) => attribute.id,
    getExcludeIds: (selectedAttributes: any[]) =>
        new Set(selectedAttributes.map((attr) => attr.name)),
};
