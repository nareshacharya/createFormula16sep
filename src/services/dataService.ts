import { ReferenceFormula } from '../types/ReferenceFormula';
import { mockReferenceFormulas } from '../data/mockData';

// Available properties for comparison - this will be replaced by API data later
export const AVAILABLE_PROPERTIES = [
  { id: "intensity", name: "Intensity", type: "number" },
  {
    id: "volatility",
    name: "Volatility",
    type: "category",
    values: ["high", "medium", "low"],
  },
  {
    id: "solubility",
    name: "Solubility",
    type: "category",
    values: ["water", "oil", "both"],
  },
  { id: "family", name: "Fragrance Family", type: "text" },
  { id: "note", name: "Note Type", type: "text" },
  { id: "costPerKg", name: "Cost per kg", type: "number" },
  { id: "defaultConcentration", name: "Default Concentration", type: "number" },
  { id: "category", name: "Category", type: "text" },
  { id: "stability", name: "Stability", type: "text" },
  { id: "pH", name: "pH Level", type: "number" },
];

// Data service interface - this will make it easy to replace with API calls later
export interface DataService {
  getAvailableFormulas: () => Promise<ReferenceFormula[]>;
  getAvailableProperties: () => Promise<typeof AVAILABLE_PROPERTIES>;
  searchFormulas: (query: string) => Promise<ReferenceFormula[]>;
  searchProperties: (query: string) => Promise<typeof AVAILABLE_PROPERTIES>;
}

// Mock implementation - replace this with actual API service later
export class MockDataService {
  static async getAvailableFormulas(): Promise<ReferenceFormula[]> {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(mockReferenceFormulas), 100);
    });
  }

  static async getAvailableProperties(): Promise<typeof AVAILABLE_PROPERTIES> {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(AVAILABLE_PROPERTIES), 100);
    });
  }

  static async searchFormulas(query: string): Promise<ReferenceFormula[]> {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        if (!query) {
          resolve(mockReferenceFormulas);
          return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = mockReferenceFormulas.filter(
          (formula) =>
            formula.metadata.name.toLowerCase().includes(lowercaseQuery) ||
            formula.metadata.id.toLowerCase().includes(lowercaseQuery) ||
            formula.metadata.base.toLowerCase().includes(lowercaseQuery)
        );
        resolve(filtered);
      }, 150);
    });
  }

  static async searchProperties(query: string): Promise<typeof AVAILABLE_PROPERTIES> {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        if (!query) {
          resolve(AVAILABLE_PROPERTIES);
          return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = AVAILABLE_PROPERTIES.filter((property) =>
          property.name.toLowerCase().includes(lowercaseQuery) ||
          property.id.toLowerCase().includes(lowercaseQuery)
        );
        resolve(filtered);
      }, 150);
    });
  }
}

// Create singleton instance - replace with actual API service later
export const dataService = new MockDataService();

// Future API service implementation would look like this:
/*
export class ApiDataService implements DataService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAvailableFormulas(): Promise<ReferenceFormula[]> {
    const response = await fetch(`${this.baseUrl}/formulas`);
    return response.json();
  }

  async getAvailableProperties(): Promise<typeof AVAILABLE_PROPERTIES> {
    const response = await fetch(`${this.baseUrl}/properties`);
    return response.json();
  }

  async searchFormulas(query: string): Promise<ReferenceFormula[]> {
    const response = await fetch(`${this.baseUrl}/formulas/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }

  async searchProperties(query: string): Promise<typeof AVAILABLE_PROPERTIES> {
    const response = await fetch(`${this.baseUrl}/properties/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }
}

// To switch to API:
// export const dataService = new ApiDataService('https://your-api-url.com/api');
*/
