import { Ingredient, IngredientComponent } from '../models/Ingredient';
import { mockIngredients } from '../data/mockData';

// Ingredient data service interface - this will make it easy to replace with external database API calls later
export interface IngredientDataService {
    getAllIngredients: () => Promise<Ingredient[]>;
    getIngredientById: (id: string) => Promise<Ingredient | null>;
    searchIngredients: (query: string) => Promise<Ingredient[]>;
    getIngredientsByCategory: (category: string) => Promise<Ingredient[]>;
    getIngredientDetails: (id: string) => Promise<IngredientDetails | null>;
}

// Extended ingredient details interface for database integration
export interface IngredientDetails {
    basicInfo: {
        id: string;
        name: string;
        casNumber: string;
        category: string;
        description?: string;
    };
    physicalProperties?: {
        molecularWeight?: number;
        boilingPoint?: number;
        meltingPoint?: number;
        density?: number;
        solubility?: string;
        volatility?: string;
    };
    regulatoryInfo?: {
        status: string;
        restrictions?: string[];
        certifications?: string[];
        ifraLimits?: Record<string, number>;
    };
    compositionData?: {
        components: Array<{
            name: string;
            casNumber: string;
            percentage: number;
            isAllergen: boolean;
        }>;
        totalPercentage: number;
    };
    sustainabilityData?: {
        biodegradable?: boolean;
        renewableSource?: boolean;
        carbonFootprint?: number;
        certifications?: string[];
    };
    supplierInfo?: {
        primarySupplier?: string;
        alternativeSuppliers?: string[];
        leadTime?: number;
        minimumOrderQuantity?: number;
    };
    costingData?: {
        costPerKg?: number;
        currency?: string;
        lastUpdated?: string;
        priceHistory?: Array<{
            date: string;
            price: number;
        }>;
    };
    qualitySpecs?: {
        purity?: number;
        appearance?: string;
        odor?: string;
        testMethods?: string[];
    };
}

// Mock implementation - replace this with actual database API service later
export class MockIngredientDataService implements IngredientDataService {
    async getAllIngredients(): Promise<Ingredient[]> {
        // Simulate API delay
        return new Promise(resolve => {
            setTimeout(() => resolve(mockIngredients), 100);
        });
    }

    async getIngredientById(id: string): Promise<Ingredient | null> {
        return new Promise(resolve => {
            setTimeout(() => {
                const ingredient = mockIngredients.find((ing: Ingredient) => ing.id === id);
                resolve(ingredient || null);
            }, 100);
        });
    }

    async searchIngredients(query: string): Promise<Ingredient[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                if (!query) {
                    resolve(mockIngredients);
                    return;
                }

                const lowercaseQuery = query.toLowerCase();
                const filtered = mockIngredients.filter((ingredient: Ingredient) =>
                    ingredient.name.toLowerCase().includes(lowercaseQuery) ||
                    ingredient.casNumber.toLowerCase().includes(lowercaseQuery) ||
                    ingredient.category.toLowerCase().includes(lowercaseQuery) ||
                    ingredient.id.toLowerCase().includes(lowercaseQuery) ||
                    ingredient.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
                    ingredient.description?.toLowerCase().includes(lowercaseQuery)
                );
                resolve(filtered);
            }, 150);
        });
    }

    async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                const filtered = mockIngredients.filter((ingredient: Ingredient) =>
                    ingredient.category.toLowerCase() === category.toLowerCase()
                );
                resolve(filtered);
            }, 100);
        });
    }

    async getIngredientDetails(id: string): Promise<IngredientDetails | null> {
        return new Promise(resolve => {
            setTimeout(() => {
                const ingredient = mockIngredients.find((ing: Ingredient) => ing.id === id);
                if (!ingredient) {
                    resolve(null);
                    return;
                }

                // Convert ingredient to detailed format with enhanced data
                const details: IngredientDetails = {
                    basicInfo: {
                        id: ingredient.id,
                        name: ingredient.name,
                        casNumber: ingredient.casNumber,
                        category: ingredient.category,
                        description: ingredient.description || `Detailed description for ${ingredient.name}. This ingredient is commonly used in fragrance formulation.`
                    },
                    physicalProperties: {
                        molecularWeight: this.generateMolecularWeight(ingredient.category),
                        boilingPoint: this.generateBoilingPoint(ingredient.category),
                        meltingPoint: this.generateMeltingPoint(ingredient.category),
                        density: this.generateDensity(ingredient.category),
                        volatility: ingredient.attributes?.volatility || 'medium',
                        solubility: ingredient.attributes?.solubility || 'oil'
                    },
                    regulatoryInfo: {
                        status: ingredient.regulatoryStatus || 'approved',
                        restrictions: ingredient.compliance?.ifraRestrictions?.map(r => r.category) || [],
                        certifications: this.generateCertifications(ingredient.category),
                        ifraLimits: ingredient.compliance?.ifraRestrictions?.reduce((acc, r) => ({
                            ...acc,
                            [r.category]: r.maxConcentration
                        }), {}) || {}
                    },
                    compositionData: ingredient.composition ? {
                        components: ingredient.composition.map(comp => ({
                            name: comp.name,
                            casNumber: comp.casNumber,
                            percentage: comp.concentration,
                            isAllergen: comp.allergenRisk === 'high' || comp.allergenRisk === 'medium'
                        })),
                        totalPercentage: ingredient.composition.reduce((sum: number, comp: IngredientComponent) => sum + comp.concentration, 0)
                    } : undefined,
                    sustainabilityData: {
                        biodegradable: ingredient.category === 'Natural',
                        renewableSource: ingredient.category === 'Natural',
                        carbonFootprint: this.generateCarbonFootprint(ingredient.category),
                        certifications: ingredient.category === 'Natural' ? ['Organic', 'Fair Trade'] : ['Sustainable Sourcing']
                    },
                    supplierInfo: {
                        primarySupplier: this.generateSupplierName(ingredient.category),
                        alternativeSuppliers: this.generateAlternativeSuppliers(),
                        leadTime: Math.floor(Math.random() * 30) + 5,
                        minimumOrderQuantity: Math.floor(Math.random() * 100) + 10
                    },
                    costingData: {
                        costPerKg: ingredient.costPerKg,
                        currency: 'USD',
                        lastUpdated: new Date().toISOString(),
                        priceHistory: this.generatePriceHistory(ingredient.costPerKg)
                    },
                    qualitySpecs: {
                        purity: 95 + Math.random() * 5,
                        appearance: this.generateAppearance(ingredient.category),
                        odor: this.generateOdorDescription(ingredient),
                        testMethods: this.generateTestMethods()
                    }
                };

                resolve(details);
            }, 200);
        });
    }

    // Helper methods for generating realistic mock data
    private generateMolecularWeight(category: string): number {
        const ranges = {
            'Natural': [120, 300],
            'Synthetic': [100, 250],
            'Solvent': [46, 150],
            'Functional': [80, 200]
        };
        const range = ranges[category as keyof typeof ranges] || [100, 200];
        return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    }

    private generateBoilingPoint(category: string): number {
        const ranges = {
            'Natural': [150, 280],
            'Synthetic': [120, 260],
            'Solvent': [78, 200],
            'Functional': [100, 250]
        };
        const range = ranges[category as keyof typeof ranges] || [100, 200];
        return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    }

    private generateMeltingPoint(_category: string): number {
        return Math.floor(Math.random() * 50 - 20); // -20 to 30°C
    }

    private generateDensity(category: string): number {
        const ranges = {
            'Natural': [0.85, 0.95],
            'Synthetic': [0.80, 0.92],
            'Solvent': [0.79, 0.89],
            'Functional': [0.82, 0.98]
        };
        const range = ranges[category as keyof typeof ranges] || [0.80, 0.95];
        return Math.round((Math.random() * (range[1] - range[0]) + range[0]) * 1000) / 1000;
    }

    private generateCarbonFootprint(category: string): number {
        const multipliers = {
            'Natural': 1.5,
            'Synthetic': 3.2,
            'Solvent': 2.1,
            'Functional': 2.8
        };
        const multiplier = multipliers[category as keyof typeof multipliers] || 2.0;
        return Math.round(Math.random() * 10 * multiplier * 100) / 100;
    }

    private generateCertifications(category: string): string[] {
        const certsByCategory = {
            'Natural': ['ECOCERT', 'COSMOS', 'NATRUE', 'USDA Organic'],
            'Synthetic': ['ISO 9001', 'ISO 14001', 'REACH Compliant'],
            'Solvent': ['USP Grade', 'Ph. Eur.', 'FCC Grade'],
            'Functional': ['IFRA Approved', 'FDA GRAS', 'EU Approved']
        };
        const certs = certsByCategory[category as keyof typeof certsByCategory] || ['Standard Grade'];
        return certs.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    private generateSupplierName(category: string): string {
        const suppliers = {
            'Natural': ['Natural Extracts Co.', 'Essential Oils International', 'Botanical Sources Ltd.'],
            'Synthetic': ['Aromachemicals Inc.', 'Synthetic Aromatics Corp.', 'Chemical Innovations Ltd.'],
            'Solvent': ['Industrial Solvents Co.', 'Pure Chemicals Inc.', 'Solvent Solutions Ltd.'],
            'Functional': ['Specialty Chemicals Co.', 'Functional Additives Inc.', 'Performance Materials Ltd.']
        };
        const supplierList = suppliers[category as keyof typeof suppliers] || ['Global Suppliers Inc.'];
        return supplierList[Math.floor(Math.random() * supplierList.length)];
    }

    private generateAlternativeSuppliers(): string[] {
        const suppliers = ['Alpha Chemicals', 'Beta Aromatics', 'Gamma Extracts', 'Delta Materials', 'Epsilon Specialties'];
        return suppliers.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    private generatePriceHistory(currentPrice: number): Array<{ date: string; price: number }> {
        const history = [];
        const baseDate = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(baseDate);
            date.setMonth(date.getMonth() - i);
            const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
            const price = Math.round(currentPrice * (1 + variance) * 100) / 100;
            history.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(0.01, price) // Ensure positive price
            });
        }
        return history;
    }

    private generateAppearance(category: string): string {
        const appearances = {
            'Natural': ['Clear to pale yellow liquid', 'Amber liquid', 'Viscous brown liquid'],
            'Synthetic': ['Colorless liquid', 'Clear liquid', 'Pale yellow liquid'],
            'Solvent': ['Clear colorless liquid', 'Transparent liquid'],
            'Functional': ['White crystalline powder', 'Clear viscous liquid', 'Pale yellow liquid']
        };
        const appearanceList = appearances[category as keyof typeof appearances] || ['Clear liquid'];
        return appearanceList[Math.floor(Math.random() * appearanceList.length)];
    }

    private generateOdorDescription(ingredient: Ingredient): string {
        if (ingredient.attributes?.family) {
            const family = ingredient.attributes.family.toLowerCase();
            const odorMap = {
                'floral': 'Sweet, floral, fresh',
                'citrus': 'Fresh, zesty, bright',
                'woody': 'Warm, woody, dry',
                'amber': 'Warm, sweet, ambery',
                'oriental': 'Rich, exotic, complex',
                'solvent': 'Characteristic solvent odor'
            };
            return odorMap[family as keyof typeof odorMap] || 'Characteristic odor';
        }
        return 'Characteristic odor';
    }

    private generateTestMethods(): string[] {
        return ['GC-MS Analysis', 'Specific Gravity', 'Refractive Index', 'Optical Rotation', 'Assay by GC'];
    }
}

// Create singleton instance - replace with actual database API service later
export const ingredientDataService = new MockIngredientDataService();

// Future database API service implementation would look like this:
/*
export class DatabaseIngredientDataService implements IngredientDataService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return this.makeRequest('/ingredients');
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    try {
      return await this.makeRequest(`/ingredients/${id}`);
    } catch {
      return null;
    }
  }

  async searchIngredients(query: string): Promise<Ingredient[]> {
    return this.makeRequest(`/ingredients/search?q=${encodeURIComponent(query)}`);
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return this.makeRequest(`/ingredients?category=${encodeURIComponent(category)}`);
  }

  async getIngredientDetails(id: string): Promise<IngredientDetails | null> {
    try {
      return await this.makeRequest(`/ingredients/${id}/details`);
    } catch {
      return null;
    }
  }
}

// To switch to database API:
// export const ingredientDataService = new DatabaseIngredientDataService(
//   'https://your-database-api.com/api',
//   'your-api-key'
// );
*/

// Utility functions for easy integration
export const IngredientAPI = {
    // Get all ingredients
    getAll: () => ingredientDataService.getAllIngredients(),

    // Get ingredient by ID
    getById: (id: string) => ingredientDataService.getIngredientById(id),

    // Search ingredients
    search: (query: string) => ingredientDataService.searchIngredients(query),

    // Filter by category
    filterByCategory: (category: string) => ingredientDataService.getIngredientsByCategory(category),

    // Get detailed information
    getDetails: (id: string) => ingredientDataService.getIngredientDetails(id)
};
