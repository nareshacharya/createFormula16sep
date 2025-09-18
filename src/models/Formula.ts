import { Ingredient } from './Ingredient'

export interface FormulaIngredient {
  id: string
  ingredient: Ingredient
  concentration: number
  quantity: number
  unit: 'ml' | 'g'
  notes?: string
}

export interface FormulaGroup {
  id: string
  type: 'formulaGroup'
  formulaName: string
  formulaId: string
  isExpanded: boolean
  ingredients: FormulaIngredient[]
  metadata?: {
    totalIngredients: number
    totalConcentration: number
  }
}

export type ActiveFormulaItem = FormulaIngredient | FormulaGroup

export interface Formula {
  id: string
  name: string
  description?: string
  author: string
  version: string
  batchSize: number
  batchUnit: 'ml' | 'g'
  ingredients: FormulaIngredient[]
  tags: string[]
  category?: string
  isPublic: boolean
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FormulaSummary {
  totalWeight: number
  totalCost: number
  ingredientCount: number
  totalConcentration: number
  averageCostPerKg: number
  complianceStatus?: string
}

export interface FormulaFilters {
  search?: string
  author?: string
  tags?: string[]
  category?: string
  isPublic?: boolean
  isTemplate?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface FormulaSortOptions {
  field: 'name' | 'author' | 'createdAt' | 'updatedAt' | 'batchSize'
  direction: 'asc' | 'desc'
}

export class FormulaModel {
  private formulas: Formula[] = []

  constructor(initialData?: Formula[]) {
    if (initialData) {
      this.formulas = initialData
    }
  }

  getAll(): Formula[] {
    return [...this.formulas]
  }

  getById(id: string): Formula | undefined {
    return this.formulas.find(formula => formula.id === id)
  }

  getByAuthor(author: string): Formula[] {
    return this.formulas.filter(formula => formula.author === author)
  }

  getPublicFormulas(): Formula[] {
    return this.formulas.filter(formula => formula.isPublic)
  }

  getTemplates(): Formula[] {
    return this.formulas.filter(formula => formula.isTemplate)
  }

  search(query: string): Formula[] {
    const searchTerm = query.toLowerCase()
    return this.formulas.filter(formula =>
      formula.name.toLowerCase().includes(searchTerm) ||
      formula.author.toLowerCase().includes(searchTerm) ||
      formula.description?.toLowerCase().includes(searchTerm) ||
      formula.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  filter(filters: FormulaFilters): Formula[] {
    let filtered = this.formulas

    if (filters.search) {
      filtered = this.search(filters.search)
    }

    if (filters.author) {
      filtered = filtered.filter(formula => formula.author === filters.author)
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(formula =>
        formula.tags.some(tag => filters.tags!.includes(tag))
      )
    }

    if (filters.category) {
      filtered = filtered.filter(formula => formula.category === filters.category)
    }

    if (filters.isPublic !== undefined) {
      filtered = filtered.filter(formula => formula.isPublic === filters.isPublic)
    }

    if (filters.isTemplate !== undefined) {
      filtered = filtered.filter(formula => formula.isTemplate === filters.isTemplate)
    }

    if (filters.dateRange) {
      filtered = filtered.filter(formula =>
        formula.createdAt >= filters.dateRange!.start &&
        formula.createdAt <= filters.dateRange!.end
      )
    }

    return filtered
  }

  static sort(formulas: Formula[], options: FormulaSortOptions): Formula[] {
    return [...formulas].sort((a, b) => {
      const aValue = a[options.field]
      const bValue = b[options.field]

      let ascSort: number;
      if (aValue < bValue) {
        ascSort = -1;
      } else if (aValue > bValue) {
        ascSort = 1;
      } else {
        ascSort = 0;
      }

      return options.direction === 'asc' ? ascSort : -ascSort;
    })
  }

  static calculateSummary(formula: Formula): FormulaSummary {
    const totalWeight = formula.ingredients.reduce((sum, item) => sum + item.quantity, 0)
    const totalCost = formula.ingredients.reduce((sum, item) =>
      sum + (item.quantity * item.ingredient.costPerKg), 0
    )
    const totalConcentration = formula.ingredients.reduce((sum, item) => sum + item.concentration, 0)
    const averageCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0

    return {
      totalWeight,
      totalCost,
      ingredientCount: formula.ingredients.length,
      totalConcentration,
      averageCostPerKg
    }
  }

  add(formula: Omit<Formula, 'id' | 'createdAt' | 'updatedAt'>): Formula {
    const newFormula: Formula = {
      ...formula,
      id: FormulaModel.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.formulas.push(newFormula)
    return newFormula
  }

  update(id: string, updates: Partial<Formula>): Formula | null {
    const index = this.formulas.findIndex(formula => formula.id === id)
    if (index === -1) return null

    this.formulas[index] = {
      ...this.formulas[index],
      ...updates,
      updatedAt: new Date()
    }

    return this.formulas[index]
  }

  delete(id: string): boolean {
    const index = this.formulas.findIndex(formula => formula.id === id)
    if (index === -1) return false

    this.formulas.splice(index, 1)
    return true
  }

  clone(formulaId: string, newName: string, newAuthor: string): Formula | null {
    const original = this.getById(formulaId)
    if (!original) return null

    const clonedFormula: Formula = {
      ...original,
      id: FormulaModel.generateId(),
      name: newName,
      author: newAuthor,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.formulas.push(clonedFormula)
    return clonedFormula
  }

  private static generateId(): string {
    return `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
} 