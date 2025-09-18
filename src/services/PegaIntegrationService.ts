/**
 * Pega Integration Service
 * Handles data capture and formatting for Pega Constellation integration
 * Formats active formula data for API submission back to Pega case
 */

import { FormulaIngredient, FormulaSummary } from '../models/Formula';

// Environment variable access for client-side
declare const process: {
    env: {
        REACT_APP_PEGA_API_ENDPOINT?: string;
    };
};

// Pega-specific data structures
export interface PegaFormulaData {
    caseId?: string;
    formulaName: string;
    formulaVersion: string;
    author: string;
    createdDate: string;
    lastModified: string;
    batchConfiguration: {
        batchSize: number;
        batchUnit: 'ml' | 'g';
    };
    ingredients: PegaIngredientData[];
    formulaSummary: PegaFormulaSummary;
    complianceStatus: {
        status: 'compliant' | 'non-compliant' | 'pending-review';
        lastChecked: string;
        notes?: string;
    };
    metadata: {
        totalIngredients: number;
        formulaComplexity: 'simple' | 'moderate' | 'complex';
        estimatedProductionCost: number;
        sustainabilityScore?: number;
    };
}

export interface PegaIngredientData {
    ingredientId: string;
    ingredientName: string;
    casNumber?: string;
    concentration: number;
    quantity: number;
    unit: 'ml' | 'g';
    cost: number;
    category: string;
    supplier?: string;
    regulatoryStatus?: string;
    allergenRisk?: string;
    notes?: string;
    addedDate: string;
    lastModified: string;
}

export interface PegaFormulaSummary {
    totalWeight: number;
    totalCost: number;
    totalConcentration: number;
    averageCostPerKg: number;
    ingredientCount: number;
    costBreakdown: {
        naturalIngredients: number;
        syntheticIngredients: number;
        solvents: number;
        functional: number;
    };
}

export interface PegaApiResponse {
    success: boolean;
    caseId?: string;
    formulaId?: string;
    message: string;
    timestamp: string;
    validationErrors?: string[];
}

class PegaIntegrationService {
    private static instance: PegaIntegrationService;
    private apiEndpoint: string;
    private currentCaseId: string | null = null;

    constructor() {
        // Configure based on Pega environment
        this.apiEndpoint = process.env.REACT_APP_PEGA_API_ENDPOINT || '/api/pega/formula';
    }

    public static getInstance(): PegaIntegrationService {
        if (!PegaIntegrationService.instance) {
            PegaIntegrationService.instance = new PegaIntegrationService();
        }
        return PegaIntegrationService.instance;
    }

    /**
     * Initialize with Pega case context
     */
    public initializePegaContext(caseId: string): void {
        this.currentCaseId = caseId;
        console.log('[Pega Integration] Initialized with case ID:', caseId);
    }

    /**
     * Transform active formula data to Pega format
     */
    public formatFormulaDataForPega(
        activeIngredients: FormulaIngredient[],
        formulaSummary: FormulaSummary,
        formulaMetadata: {
            name: string;
            author: string;
            version?: string;
            batchSize: number;
            batchUnit: 'ml' | 'g';
            complianceStatus?: 'compliant' | 'non-compliant' | 'pending';
        }
    ): PegaFormulaData {
        const now = new Date().toISOString();

        const pegaIngredients: PegaIngredientData[] = activeIngredients.map(ingredient => ({
            ingredientId: ingredient.ingredient.id,
            ingredientName: ingredient.ingredient.name,
            casNumber: ingredient.ingredient.casNumber,
            concentration: ingredient.concentration,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            cost: ingredient.quantity * ingredient.ingredient.costPerKg,
            category: ingredient.ingredient.category || 'Unknown',
            supplier: (ingredient.ingredient as any).supplier || 'Unknown',
            regulatoryStatus: ingredient.ingredient.regulatoryStatus || 'Unknown',
            allergenRisk: (ingredient.ingredient as any).allergenRisk || 'low',
            notes: ingredient.notes || '',
            addedDate: now,
            lastModified: now,
        }));

        // Calculate cost breakdown by category
        const costBreakdown = PegaIntegrationService.calculateCostBreakdown(activeIngredients);

        const pegaFormulaSummary: PegaFormulaSummary = {
            totalWeight: formulaSummary.totalWeight,
            totalCost: formulaSummary.totalCost,
            totalConcentration: formulaSummary.totalConcentration,
            averageCostPerKg: formulaSummary.averageCostPerKg,
            ingredientCount: formulaSummary.ingredientCount,
            costBreakdown,
        };

        const pegaFormulaData: PegaFormulaData = {
            caseId: this.currentCaseId || undefined,
            formulaName: formulaMetadata.name,
            formulaVersion: formulaMetadata.version || '1.0',
            author: formulaMetadata.author,
            createdDate: now,
            lastModified: now,
            batchConfiguration: {
                batchSize: formulaMetadata.batchSize,
                batchUnit: formulaMetadata.batchUnit,
            },
            ingredients: pegaIngredients,
            formulaSummary: pegaFormulaSummary,
            complianceStatus: {
                status: formulaMetadata.complianceStatus === 'compliant' ? 'compliant' : 'pending-review',
                lastChecked: now,
            },
            metadata: {
                totalIngredients: activeIngredients.length,
                formulaComplexity: PegaIntegrationService.calculateComplexity(activeIngredients),
                estimatedProductionCost: formulaSummary.totalCost,
                sustainabilityScore: PegaIntegrationService.calculateSustainabilityScore(activeIngredients),
            },
        };

        return pegaFormulaData;
    }

    /**
     * Save formula data locally for debugging/backup
     */
    public static saveFormulaDataLocally(pegaData: PegaFormulaData): void {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `formula-${pegaData.formulaName}-${timestamp}.json`;

        // Create downloadable JSON file
        const dataStr = JSON.stringify(pegaData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('[Pega Integration] Formula data saved locally:', filename);
    }

    /**
     * Submit formula data to Pega API
     */
    public async submitFormulaToPega(pegaData: PegaFormulaData): Promise<PegaApiResponse> {
        try {
            console.log('[Pega Integration] Submitting formula data:', pegaData);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Case-ID': this.currentCaseId || '',
                    // Add Pega-specific headers as needed
                    'X-Pega-Authorization': `Bearer ${localStorage.getItem('pega_token') || ''}`,
                },
                body: JSON.stringify(pegaData),
            });

            const result: PegaApiResponse = await response.json();

            if (response.ok) {
                console.log('[Pega Integration] Successfully submitted to Pega:', result);
                return result;
            } else {
                console.error('[Pega Integration] API Error:', result);
                return {
                    success: false,
                    message: result.message || 'Failed to submit formula to Pega',
                    timestamp: new Date().toISOString(),
                    validationErrors: result.validationErrors,
                };
            }
        } catch (error) {
            console.error('[Pega Integration] Network Error:', error);
            return {
                success: false,
                message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                timestamp: new Date().toISOString(),
            };
        }
    }

    /**
     * Validate formula data before submission
     */
    public static validateFormulaData(pegaData: PegaFormulaData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Basic validation rules
        if (!pegaData.formulaName.trim()) {
            errors.push('Formula name is required');
        }

        if (!pegaData.author.trim()) {
            errors.push('Formula author is required');
        }

        if (pegaData.ingredients.length === 0) {
            errors.push('Formula must contain at least one ingredient');
        }

        if (pegaData.formulaSummary.totalConcentration > 100) {
            errors.push('Total concentration cannot exceed 100%');
        }

        if (pegaData.formulaSummary.totalConcentration < 50) {
            errors.push('Formula appears incomplete (total concentration < 50%)');
        }

        // Ingredient-level validation
        pegaData.ingredients.forEach((ingredient, index) => {
            if (!ingredient.ingredientName.trim()) {
                errors.push(`Ingredient ${index + 1}: Name is required`);
            }
            if (ingredient.concentration <= 0) {
                errors.push(`Ingredient ${index + 1}: Concentration must be greater than 0`);
            }
            if (ingredient.concentration > 100) {
                errors.push(`Ingredient ${index + 1}: Concentration cannot exceed 100%`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Calculate cost breakdown by ingredient category
     */
    private static calculateCostBreakdown(ingredients: FormulaIngredient[]): PegaFormulaSummary['costBreakdown'] {
        const breakdown = {
            naturalIngredients: 0,
            syntheticIngredients: 0,
            solvents: 0,
            functional: 0,
        };

        ingredients.forEach(ingredient => {
            const cost = ingredient.quantity * ingredient.ingredient.costPerKg;
            const category = ingredient.ingredient.category?.toLowerCase();

            switch (category) {
                case 'natural':
                    breakdown.naturalIngredients += cost;
                    break;
                case 'synthetic':
                    breakdown.syntheticIngredients += cost;
                    break;
                case 'solvent':
                    breakdown.solvents += cost;
                    break;
                case 'functional':
                    breakdown.functional += cost;
                    break;
                default:
                    breakdown.syntheticIngredients += cost; // Default to synthetic
            }
        });

        return breakdown;
    }

    /**
     * Calculate formula complexity based on ingredient count and diversity
     */
    private static calculateComplexity(ingredients: FormulaIngredient[]): 'simple' | 'moderate' | 'complex' {
        const ingredientCount = ingredients.length;
        const categorySet = new Set(ingredients.map(ing => ing.ingredient.category));
        const categoryDiversity = categorySet.size;

        if (ingredientCount <= 5 && categoryDiversity <= 2) {
            return 'simple';
        } else if (ingredientCount <= 15 && categoryDiversity <= 3) {
            return 'moderate';
        } else {
            return 'complex';
        }
    }

    /**
     * Calculate sustainability score (placeholder - implement based on ingredient data)
     */
    private static calculateSustainabilityScore(ingredients: FormulaIngredient[]): number {
        // This would be implemented based on ingredient sustainability ratings
        const totalScore = ingredients.reduce((sum, ingredient) => {
            return sum + ((ingredient.ingredient as any).sustainabilityRating || 3); // Default to moderate
        }, 0);

        return Math.round((totalScore / ingredients.length) * 10) / 10;
    }

    /**
     * Get current case ID
     */
    public getCurrentCaseId(): string | null {
        return this.currentCaseId;
    }

    /**
     * Reset integration state
     */
    public reset(): void {
        this.currentCaseId = null;
        console.log('[Pega Integration] Service reset');
    }
}

export default PegaIntegrationService;
