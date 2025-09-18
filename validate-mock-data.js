// Data Validation Script for Mock Data
// Run this script to verify all ingredient and formula relationships are correctly mapped

import { mockIngredients, mockFormulas } from './src/data/mockData.js';

console.log('🔍 Validating Mock Data Structure...\n');

// Validate Ingredient IDs
console.log('📋 Ingredient Validation:');
console.log(`✅ Total Ingredients: ${mockIngredients.length}`);

const ingredientIdPattern = /^INGR-\d{4}$/;
const invalidIngredientIds = mockIngredients.filter(ing => !ingredientIdPattern.test(ing.id));

if (invalidIngredientIds.length === 0) {
  console.log('✅ All ingredient IDs follow INGR-XXXX format');
} else {
  console.log('❌ Invalid ingredient IDs found:');
  invalidIngredientIds.forEach(ing => console.log(`   - ${ing.id}: ${ing.name}`));
}

// Check for required fields
const incompleteIngredients = mockIngredients.filter(ing => 
  !ing.name || !ing.casNumber || !ing.category || !ing.compliance
);

if (incompleteIngredients.length === 0) {
  console.log('✅ All ingredients have required fields');
} else {
  console.log('❌ Incomplete ingredients found:');
  incompleteIngredients.forEach(ing => console.log(`   - ${ing.id}: Missing required fields`));
}

// Validate Formula IDs
console.log('\n📋 Formula Validation:');
console.log(`✅ Total Formulas: ${mockFormulas.length}`);

const formulaIdPattern = /^FORM-\d{4}$/;
const invalidFormulaIds = mockFormulas.filter(formula => !formulaIdPattern.test(formula.id));

if (invalidFormulaIds.length === 0) {
  console.log('✅ All formula IDs follow FORM-XXXX format');
} else {
  console.log('❌ Invalid formula IDs found:');
  invalidFormulaIds.forEach(formula => console.log(`   - ${formula.id}: ${formula.name}`));
}

// Validate Ingredient References in Formulas
console.log('\n🔗 Formula-Ingredient Relationship Validation:');

let totalIngredientReferences = 0;
let invalidReferences = 0;

mockFormulas.forEach(formula => {
  formula.ingredients.forEach(fi => {
    totalIngredientReferences++;
    const ingredientExists = mockIngredients.find(ing => ing.id === fi.ingredient.id);
    if (!ingredientExists) {
      invalidReferences++;
      console.log(`❌ Invalid ingredient reference in ${formula.name}: ${fi.ingredient.id}`);
    }
  });
});

if (invalidReferences === 0) {
  console.log(`✅ All ${totalIngredientReferences} ingredient references are valid`);
} else {
  console.log(`❌ Found ${invalidReferences} invalid ingredient references out of ${totalIngredientReferences}`);
}

// Validate Formula Ingredient IDs
const formulaIngredientIdPattern = /^FI-\d{3}-\d{3}$/;
let invalidFormulaIngredientIds = 0;

mockFormulas.forEach(formula => {
  formula.ingredients.forEach(fi => {
    if (!formulaIngredientIdPattern.test(fi.id)) {
      invalidFormulaIngredientIds++;
      console.log(`❌ Invalid formula ingredient ID: ${fi.id} in ${formula.name}`);
    }
  });
});

if (invalidFormulaIngredientIds === 0) {
  console.log('✅ All formula ingredient IDs follow FI-XXX-XXX format');
} else {
  console.log(`❌ Found ${invalidFormulaIngredientIds} invalid formula ingredient IDs`);
}

// Validate Compliance Data
console.log('\n🛡️ Compliance Data Validation:');

const ingredientsWithoutCompliance = mockIngredients.filter(ing => !ing.compliance);
if (ingredientsWithoutCompliance.length === 0) {
  console.log('✅ All ingredients have compliance data');
} else {
  console.log(`❌ ${ingredientsWithoutCompliance.length} ingredients missing compliance data`);
}

// Summary Report
console.log('\n📊 Summary Report:');
console.log(`• Ingredients: ${mockIngredients.length} total`);
console.log(`• Formulas: ${mockFormulas.length} total`);
console.log(`• Ingredient-Formula References: ${totalIngredientReferences} total`);

// Category Distribution
const categoryCount = mockIngredients.reduce((acc, ing) => {
  acc[ing.category] = (acc[ing.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📈 Ingredient Category Distribution:');
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`• ${category}: ${count} ingredients`);
});

// Allergen Analysis
const ingredientsWithAllergens = mockIngredients.filter(ing => 
  ing.compliance?.allergenImpact && ing.compliance.allergenImpact.length > 0
);

console.log(`\n⚠️ Allergen Information:`);
console.log(`• ${ingredientsWithAllergens.length} ingredients contain declared allergens`);

console.log('\n✅ Validation Complete!');

export default {
  validateIngredients: () => mockIngredients.every(ing => ingredientIdPattern.test(ing.id)),
  validateFormulas: () => mockFormulas.every(formula => formulaIdPattern.test(formula.id)),
  validateReferences: () => {
    return mockFormulas.every(formula => 
      formula.ingredients.every(fi => 
        mockIngredients.find(ing => ing.id === fi.ingredient.id)
      )
    );
  }
};
