export interface Ingredient {
  id: string
  name: string
  casNumber: string
  category: 'Natural' | 'Synthetic' | 'Solvent' | 'Functional'
  defaultConcentration: number
  costPerKg: number
  tags: string[]
  attributes?: {
    intensity?: number
    family?: string
    note?: string
  }
}

export interface FormulaIngredient {
  id: string
  ingredient: Ingredient
  concentration: number
  quantity: number
  unit: 'ml' | 'g'
}

export interface Formula {
  id: string
  name: string
  author: string
  date: string
  ingredients: FormulaIngredient[]
  batchSize: number
  batchUnit: 'ml' | 'g'
}

export interface ReferenceFormula {
  id: string
  name: string
  author: string
  date: string
  ingredients: FormulaIngredient[]
  batchSize: number
  batchUnit: 'ml' | 'g'
}

export interface FormulaSummary {
  totalWeight: number
  totalCost: number
  ingredientCount: number
  totalConcentration: number
}

export type ReferenceView = 'formula' | 'attribute'

export interface DragItem {
  type: 'ingredient'
  ingredient: Ingredient
} 