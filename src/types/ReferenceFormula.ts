export interface ReferenceFormulaMetadata {
  id: string
  name: string
  active: number // percentage
  base: string
  ph: number
  cost: number
  density: string
  stability: string
}

export interface ReferenceFormulaIngredient {
  ingredientName: string
  concentration: number | null // null if missing
  delta?: number // percentage difference from active formula
}

export interface ReferenceFormula {
  metadata: ReferenceFormulaMetadata
  ingredients: ReferenceFormulaIngredient[]
}

export interface ComparisonMatrixData {
  activeIngredients: Array<{
    name: string
    concentration: number
  }>
  referenceFormulas: ReferenceFormula[]
}

export interface ComparisonRow {
  ingredientName: string
  activeConcentration: number
  referenceValues: Array<{
    formulaId: string
    concentration: number | null
    delta: number | null
  }>
}

export type ViewMode = 'matrix' | 'attribute'
