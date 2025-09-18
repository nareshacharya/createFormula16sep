import { Ingredient } from '../models/Ingredient'
import { Formula } from '../models/Formula'
import { ReferenceFormula } from '../types/ReferenceFormula'

export const mockIngredients: Ingredient[] = [
  {
    id: 'INGR-0001',
    name: 'Lavender Essential Oil',
    casNumber: '470-82-6',
    category: 'Natural',
    defaultConcentration: 10.0,
    costPerKg: 0.15,
    tags: ['floral', 'herbal', 'calming'],
    attributes: {
      intensity: 8,
      family: 'Floral',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Pure lavender essential oil with calming properties and therapeutic benefits',
    safetyNotes: 'Generally recognized as safe. Avoid during pregnancy. Potential skin sensitizer.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0002',
    name: 'Rose Base 101',
    casNumber: 'RB-101-2024',
    category: 'Synthetic',
    defaultConcentration: 5.0,
    costPerKg: 0.25,
    tags: ['rose', 'floral', 'complex'],
    attributes: {
      intensity: 9,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Complex rose base with natural-like character. Sophisticated blend of rose materials.',
    safetyNotes: 'Contains allergens. Check individual components. Potential skin sensitizer.',
    regulatoryStatus: 'Approved',
    composition: [
      {
        id: 'COMP-001',
        name: 'Phenylethyl Alcohol',
        casNumber: '60-12-8',
        type: 'Pure',
        concentration: 60.0,
        costContribution: 1.5,
        allergenRisk: 'low',
        regulatoryNotes: 'IFRA approved. No restrictions.',
        olfactiveProfile: 'Rose, honey, floral'
      },
      {
        id: 'COMP-002',
        name: 'Citronellol',
        casNumber: '106-22-9',
        type: 'Pure',
        concentration: 20.0,
        costContribution: 0.5,
        allergenRisk: 'medium',
        regulatoryNotes: 'EU Allergen - Must be declared on label above 0.001%',
        olfactiveProfile: 'Rose, citrus, fresh'
      },
      {
        id: 'COMP-003',
        name: 'DPG (Dipropylene Glycol)',
        casNumber: '25265-71-8',
        type: 'Solvent',
        concentration: 18.0,
        costContribution: 0.18,
        allergenRisk: 'low',
        regulatoryNotes: 'Generally safe solvent. No restrictions.',
        olfactiveProfile: 'Odorless carrier'
      },
      {
        id: 'COMP-004',
        name: 'BHT (Butylated Hydroxytoluene)',
        casNumber: '128-37-0',
        type: 'Stabilizer',
        concentration: 2.0,
        costContribution: 0.32,
        allergenRisk: 'low',
        regulatoryNotes: 'Antioxidant, max 0.1% in final product',
        olfactiveProfile: 'Slight phenolic note'
      }
    ],
    compliance: {
      allergenImpact: [
        {
          component: 'Citronellol',
          allergenType: 'EU Allergen',
          concentration: 20.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      ifraRestrictions: [
        {
          category: 'Category 1 (Toys)',
          maxConcentration: 0.5,
          currentConcentration: 5.0
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0003',
    name: 'Bergamot Essential Oil',
    casNumber: '8007-75-8',
    category: 'Natural',
    defaultConcentration: 1.5,
    costPerKg: 0.12,
    tags: ['citrus', 'fresh', 'energizing'],
    attributes: {
      intensity: 7,
      family: 'Citrus',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Fresh citrus essential oil with uplifting properties. Cold-pressed from bergamot rinds.',
    safetyNotes: 'Phototoxic. Avoid sun exposure after application. Contains bergapten.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Limonene',
          allergenType: 'EU Allergen',
          concentration: 45.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        },
        {
          component: 'Linalool',
          allergenType: 'EU Allergen',
          concentration: 8.5,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0004',
    name: 'Vanilla Absolute',
    casNumber: '8024-06-4',
    category: 'Natural',
    defaultConcentration: 0.5,
    costPerKg: 2.50,
    tags: ['sweet', 'warm', 'comforting'],
    attributes: {
      intensity: 6,
      family: 'Oriental',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Rich vanilla absolute with warm, sweet aroma. Extracted from premium vanilla beans.',
    safetyNotes: 'Generally safe. May cause skin sensitivity in some individuals. Contains vanillin.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0005',
    name: 'Mystic Woods Captive',
    casNumber: 'CAPT-MW-2024',
    category: 'Synthetic',
    defaultConcentration: 3.0,
    costPerKg: 8.75,
    tags: ['woody', 'captive', 'exclusive'],
    attributes: {
      intensity: 10,
      family: 'Woody',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Proprietary woody captive molecule with exceptional performance and longevity.',
    safetyNotes: 'Internal safety assessment completed. Handle according to SDS. Professional use only.',
    regulatoryStatus: 'Company Approved',
    isCaptive: true,
    captiveNotes: 'Black-box ingredient. Composition confidential. Internal controls apply for regulatory compliance and allergen assessment.',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0006',
    name: 'Sandalwood Essential Oil',
    casNumber: '8006-87-9',
    category: 'Natural',
    defaultConcentration: 1.0,
    costPerKg: 3.20,
    tags: ['woody', 'earthy', 'grounding'],
    attributes: {
      intensity: 5,
      family: 'Woody',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Precious sandalwood essential oil with deep woody notes. Steam distilled from heartwood.',
    safetyNotes: 'Generally safe. Endangered species - use sustainably sourced material only.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0007',
    name: 'Iso E Super',
    casNumber: '54464-57-2',
    category: 'Synthetic',
    defaultConcentration: 3.0,
    costPerKg: 0.08,
    tags: ['woody', 'amber', 'fixative'],
    attributes: {
      intensity: 4,
      family: 'Amber',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Synthetic amber molecule with excellent fixative properties. Cedarwood-like character.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Well-established safety profile.',
    regulatoryStatus: 'IFRA Compliant',
    compliance: {
      allergenImpact: [],
      ifraRestrictions: [
        {
          category: 'Category 1 (Lip Products)',
          maxConcentration: 21.4,
          currentConcentration: 3.0
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0008',
    name: 'Hedione',
    casNumber: '24851-98-7',
    category: 'Synthetic',
    defaultConcentration: 2.5,
    costPerKg: 0.22,
    tags: ['floral', 'jasmine', 'fresh'],
    attributes: {
      intensity: 6,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Synthetic jasmine molecule with fresh floral character. Methyl dihydrojasmonate.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Excellent safety profile.',
    regulatoryStatus: 'IFRA Compliant',
    compliance: {
      allergenImpact: [],
      ifraRestrictions: [
        {
          category: 'Category 1 (Lip Products)',
          maxConcentration: 50.0,
          currentConcentration: 2.5
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0009',
    name: 'Ethanol 96%',
    casNumber: '64-17-5',
    category: 'Solvent',
    defaultConcentration: 0,
    costPerKg: 0.02,
    tags: ['solvent', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Solvent',
      note: 'Carrier',
      volatility: 'high',
      solubility: 'both'
    },
    description: 'Food-grade ethanol for fragrance dilution and formulation. 96% purity.',
    safetyNotes: 'Flammable. Keep away from open flames. Store in cool, dry place.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0010',
    name: 'Rose Absolute',
    casNumber: '8007-01-0',
    category: 'Natural',
    defaultConcentration: 0.3,
    costPerKg: 8.50,
    tags: ['floral', 'romantic', 'luxurious'],
    attributes: {
      intensity: 9,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Precious rose absolute with rich floral character. Solvent extracted from rose petals.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Contains natural allergens.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Citronellol',
          allergenType: 'EU Allergen',
          concentration: 25.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        },
        {
          component: 'Geraniol',
          allergenType: 'EU Allergen',
          concentration: 15.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0011',
    name: 'Patchouli Essential Oil',
    casNumber: '8014-09-3',
    category: 'Natural',
    defaultConcentration: 0.8,
    costPerKg: 0.18,
    tags: ['earthy', 'woody', 'mysterious'],
    attributes: {
      intensity: 7,
      family: 'Woody',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Deep earthy patchouli essential oil with complex woody-earthy profile.',
    safetyNotes: 'Generally safe. Strong aroma - use sparingly. May stain fabrics.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0012',
    name: 'Limonene',
    casNumber: '138-86-3',
    category: 'Synthetic',
    defaultConcentration: 1.0,
    costPerKg: 0.05,
    tags: ['citrus', 'fresh', 'clean'],
    attributes: {
      intensity: 6,
      family: 'Citrus',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Synthetic citrus molecule with fresh, clean character. D-Limonene isomer.',
    safetyNotes: 'EU Allergen. May cause skin sensitivity. Avoid oxidized material.',
    regulatoryStatus: 'IFRA Compliant',
    compliance: {
      allergenImpact: [
        {
          component: 'Limonene',
          allergenType: 'EU Allergen',
          concentration: 100.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0013',
    name: 'Lavender Absolute',
    casNumber: '8022-15-9',
    category: 'Natural',
    defaultConcentration: 15.0,
    costPerKg: 2.5,
    tags: ['floral', 'herbal', 'intense'],
    attributes: {
      intensity: 9,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Concentrated lavender absolute with intense floral character. Solvent extracted.',
    safetyNotes: 'Generally safe. Use sparingly due to high concentration. Contains linalool.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Linalool',
          allergenType: 'EU Allergen',
          concentration: 35.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0014',
    name: 'Rose Otto',
    casNumber: '8007-01-0',
    category: 'Natural',
    defaultConcentration: 5.0,
    costPerKg: 8.0,
    tags: ['floral', 'romantic', 'luxurious'],
    attributes: {
      intensity: 9,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Precious rose otto essential oil. Steam distilled from Bulgarian roses.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Premium quality oil.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Citronellol',
          allergenType: 'EU Allergen',
          concentration: 30.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        },
        {
          component: 'Geraniol',
          allergenType: 'EU Allergen',
          concentration: 20.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0015',
    name: 'Jasmine Absolute',
    casNumber: '8022-96-6',
    category: 'Natural',
    defaultConcentration: 3.0,
    costPerKg: 12.0,
    tags: ['floral', 'exotic', 'intense'],
    attributes: {
      intensity: 10,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Exotic jasmine absolute with intense floral character. Premium Jasmine grandiflorum.',
    safetyNotes: 'Generally safe. Use sparingly due to high intensity. May cause sensitivity.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Benzyl Acetate',
          allergenType: 'Potential Allergen',
          concentration: 15.0,
          regulatoryLimit: 0.01,
          status: 'compliant'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0016',
    name: 'Ylang Ylang Essential Oil',
    casNumber: '8006-81-3',
    category: 'Natural',
    defaultConcentration: 8.0,
    costPerKg: 3.5,
    tags: ['floral', 'exotic', 'sweet'],
    attributes: {
      intensity: 7,
      family: 'Floral',
      note: 'Middle',
      volatility: 'medium',
      solubility: 'oil'
    },
    description: 'Exotic ylang ylang essential oil with sweet, tropical floral notes.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Use grade Extra or I.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Benzyl Benzoate',
          allergenType: 'EU Allergen',
          concentration: 8.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0017',
    name: 'Neroli Essential Oil',
    casNumber: '8016-38-4',
    category: 'Natural',
    defaultConcentration: 5.0,
    costPerKg: 15.0,
    tags: ['floral', 'citrus', 'fresh'],
    attributes: {
      intensity: 8,
      family: 'Floral',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Precious neroli essential oil from bitter orange blossoms. Steam distilled.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Premium quality oil.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Limonene',
          allergenType: 'EU Allergen',
          concentration: 12.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        },
        {
          component: 'Linalool',
          allergenType: 'EU Allergen',
          concentration: 25.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0018',
    name: 'Sandalwood Oil (Australian)',
    casNumber: '8006-87-9',
    category: 'Natural',
    defaultConcentration: 2.0,
    costPerKg: 2.50,
    tags: ['woody', 'earthy', 'grounding'],
    attributes: {
      intensity: 6,
      family: 'Woody',
      note: 'Base',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Precious Australian sandalwood essential oil. Sustainably sourced.',
    safetyNotes: 'Generally safe. Sustainably sourced - CITES compliant. Premium grade.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0019',
    name: 'Ethanol 95%',
    casNumber: '64-17-5',
    category: 'Solvent',
    defaultConcentration: 0,
    costPerKg: 0.02,
    tags: ['solvent', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Solvent',
      note: 'Carrier',
      volatility: 'high',
      solubility: 'both'
    },
    description: '95% ethanol for fragrance formulation. Food-grade quality.',
    safetyNotes: 'Flammable. Keep away from open flames. Store in cool, dry place.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0020',
    name: 'Lemon Essential Oil',
    casNumber: '8008-56-8',
    category: 'Natural',
    defaultConcentration: 2.0,
    costPerKg: 0.08,
    tags: ['citrus', 'fresh', 'bright'],
    attributes: {
      intensity: 7,
      family: 'Citrus',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Fresh lemon essential oil with bright citrus character. Cold-pressed from peels.',
    safetyNotes: 'Phototoxic. Avoid sun exposure after application. Contains limonene.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Limonene',
          allergenType: 'EU Allergen',
          concentration: 65.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0021',
    name: 'Orange Sweet Essential Oil',
    casNumber: '8008-57-9',
    category: 'Natural',
    defaultConcentration: 3.0,
    costPerKg: 0.06,
    tags: ['citrus', 'sweet', 'cheerful'],
    attributes: {
      intensity: 6,
      family: 'Citrus',
      note: 'Top',
      volatility: 'high',
      solubility: 'oil'
    },
    description: 'Sweet orange essential oil with cheerful citrus aroma. Cold-pressed from peels.',
    safetyNotes: 'Generally safe. May cause skin sensitivity. Contains natural allergens.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Limonene',
          allergenType: 'EU Allergen',
          concentration: 90.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0022',
    name: 'IPM Carrier',
    casNumber: '110-27-0',
    category: 'Solvent',
    defaultConcentration: 0,
    costPerKg: 0.15,
    tags: ['solvent', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Solvent',
      note: 'Carrier',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Isopropyl myristate carrier oil for fragrance formulation. Excellent skin feel.',
    safetyNotes: 'Generally safe. Non-comedogenic carrier oil.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0023',
    name: 'Jojoba Oil Base',
    casNumber: '61789-91-1',
    category: 'Natural',
    defaultConcentration: 0,
    costPerKg: 0.25,
    tags: ['natural', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Natural',
      note: 'Carrier',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Pure jojoba oil carrier base. Excellent stability and skin compatibility.',
    safetyNotes: 'Generally safe. Non-comedogenic natural carrier.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0024',
    name: 'Grape Seed Oil Base',
    casNumber: '8001-62-1',
    category: 'Natural',
    defaultConcentration: 0,
    costPerKg: 0.18,
    tags: ['natural', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Natural',
      note: 'Carrier',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Cold-pressed grape seed oil carrier base. Light texture and excellent absorption.',
    safetyNotes: 'Generally safe. Natural carrier oil with antioxidant properties.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0025',
    name: 'Fractionated Coconut Oil',
    casNumber: '8001-31-8',
    category: 'Natural',
    defaultConcentration: 0,
    costPerKg: 0.22,
    tags: ['natural', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Natural',
      note: 'Carrier',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Fractionated coconut oil carrier base. Stable, odorless, and long-lasting.',
    safetyNotes: 'Generally safe. Non-comedogenic natural carrier.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'INGR-0026',
    name: 'Sweet Almond Oil Base',
    casNumber: '8007-69-0',
    category: 'Natural',
    defaultConcentration: 0,
    costPerKg: 0.20,
    tags: ['natural', 'carrier', 'base'],
    attributes: {
      intensity: 1,
      family: 'Natural',
      note: 'Carrier',
      volatility: 'low',
      solubility: 'oil'
    },
    description: 'Pure sweet almond oil carrier base. Rich in vitamins and emollient properties.',
    safetyNotes: 'Generally safe. Nut allergen warning - check for allergies.',
    regulatoryStatus: 'GRAS',
    compliance: {
      allergenImpact: [
        {
          component: 'Almond Extract',
          allergenType: 'Nut Allergen',
          concentration: 100.0,
          regulatoryLimit: 0.001,
          status: 'warning'
        }
      ],
      regulatoryStatus: 'approved'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

export const mockFormulas: Formula[] = [
  {
    id: 'FORM-0001',
    name: 'Summer Breeze',
    description: 'A fresh, light fragrance perfect for warm days',
    author: 'Marie Dubois',
    version: '1.0',
    batchSize: 100,
    batchUnit: 'ml',
    ingredients: [
      {
        id: 'FI-001-001',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0003')!, // Bergamot
        concentration: 2.0,
        quantity: 2.0,
        unit: 'ml'
      },
      {
        id: 'FI-001-002',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0001')!, // Lavender
        concentration: 1.5,
        quantity: 1.5,
        unit: 'ml'
      },
      {
        id: 'FI-001-003',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0008')!, // Hedione
        concentration: 2.0,
        quantity: 2.0,
        unit: 'ml'
      }
    ],
    tags: ['fresh', 'summer', 'light'],
    category: 'Floral',
    isPublic: true,
    isTemplate: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'FORM-0002',
    name: 'Mystic Woods',
    description: 'A deep, mysterious woody fragrance',
    author: 'Jean-Pierre Laurent',
    version: '1.0',
    batchSize: 100,
    batchUnit: 'ml',
    ingredients: [
      {
        id: 'FI-002-001',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0006')!, // Sandalwood
        concentration: 1.5,
        quantity: 1.5,
        unit: 'ml'
      },
      {
        id: 'FI-002-002',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0011')!, // Patchouli
        concentration: 1.0,
        quantity: 1.0,
        unit: 'ml'
      },
      {
        id: 'FI-002-003',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0007')!, // Iso E Super
        concentration: 2.5,
        quantity: 2.5,
        unit: 'ml'
      }
    ],
    tags: ['woody', 'mysterious', 'deep'],
    category: 'Woody',
    isPublic: true,
    isTemplate: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'FORM-0003',
    name: 'Floral Elegance',
    description: 'A sophisticated floral composition',
    author: 'Sophie Chen',
    version: '1.0',
    batchSize: 100,
    batchUnit: 'ml',
    ingredients: [
      {
        id: 'FI-003-001',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0010')!, // Rose Absolute
        concentration: 0.5,
        quantity: 0.5,
        unit: 'ml'
      },
      {
        id: 'FI-003-002',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0008')!, // Hedione
        concentration: 3.0,
        quantity: 3.0,
        unit: 'ml'
      },
      {
        id: 'FI-003-003',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0004')!, // Vanilla
        concentration: 0.3,
        quantity: 0.3,
        unit: 'ml'
      }
    ],
    tags: ['floral', 'elegant', 'sophisticated'],
    category: 'Floral',
    isPublic: true,
    isTemplate: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'FORM-0004',
    name: 'Citrus Burst',
    description: 'An energizing citrus blend with herbal notes',
    author: 'Alexander Martinez',
    version: '1.0',
    batchSize: 100,
    batchUnit: 'ml',
    ingredients: [
      {
        id: 'FI-004-001',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0020')!, // Lemon
        concentration: 3.5,
        quantity: 3.5,
        unit: 'ml'
      },
      {
        id: 'FI-004-002',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0021')!, // Orange Sweet
        concentration: 2.8,
        quantity: 2.8,
        unit: 'ml'
      },
      {
        id: 'FI-004-003',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0003')!, // Bergamot
        concentration: 2.2,
        quantity: 2.2,
        unit: 'ml'
      },
      {
        id: 'FI-004-004',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0001')!, // Lavender
        concentration: 1.5,
        quantity: 1.5,
        unit: 'ml'
      }
    ],
    tags: ['citrus', 'energizing', 'fresh'],
    category: 'Citrus',
    isPublic: true,
    isTemplate: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'FORM-0005',
    name: 'Oriental Nights',
    description: 'A rich, exotic oriental fragrance',
    author: 'Yasmin Al-Rashid',
    version: '1.0',
    batchSize: 100,
    batchUnit: 'ml',
    ingredients: [
      {
        id: 'FI-005-001',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0015')!, // Jasmine Absolute
        concentration: 1.2,
        quantity: 1.2,
        unit: 'ml'
      },
      {
        id: 'FI-005-002',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0016')!, // Ylang Ylang
        concentration: 2.0,
        quantity: 2.0,
        unit: 'ml'
      },
      {
        id: 'FI-005-003',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0018')!, // Sandalwood Australian
        concentration: 1.8,
        quantity: 1.8,
        unit: 'ml'
      },
      {
        id: 'FI-005-004',
        ingredient: mockIngredients.find(i => i.id === 'INGR-0004')!, // Vanilla Absolute
        concentration: 1.0,
        quantity: 1.0,
        unit: 'ml'
      }
    ],
    tags: ['oriental', 'exotic', 'rich'],
    category: 'Oriental',
    isPublic: true,
    isTemplate: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
]

export const mockReferenceFormulas: ReferenceFormula[] = [
  {
    metadata: {
      id: 'REF-001',
      name: 'Classic Lavender',
      active: 100.0,
      base: 'Ethanol 96%',
      ph: 6.8,
      cost: 42.30,
      density: '0.87 g/ml',
      stability: 'Excellent'
    },
    ingredients: [
      { ingredientName: 'Lavender Essential Oil', concentration: 12.5 },
      { ingredientName: 'Bergamot Essential Oil', concentration: 8.2 },
      { ingredientName: 'Vanilla Absolute', concentration: 3.1 },
      { ingredientName: 'Ethanol 96%', concentration: 76.2 }
    ]
  },
  {
    metadata: {
      id: 'REF-002',
      name: 'Citrus Fresh',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 7.1,
      cost: 38.75,
      density: '0.85 g/ml',
      stability: 'Good'
    },
    ingredients: [
      { ingredientName: 'Bergamot Essential Oil', concentration: 15.8 },
      { ingredientName: 'Lemon Essential Oil', concentration: 12.3 },
      { ingredientName: 'Orange Sweet Essential Oil', concentration: 8.7 },
      { ingredientName: 'Lavender Essential Oil', concentration: 4.2 },
      { ingredientName: 'Ethanol 95%', concentration: 59.0 }
    ]
  },
  {
    metadata: {
      id: 'REF-003',
      name: 'Vanilla Dreams',
      active: 100.0,
      base: 'IPM Base',
      ph: 6.5,
      cost: 51.20,
      density: '0.92 g/ml',
      stability: 'Very Good'
    },
    ingredients: [
      { ingredientName: 'Vanilla Absolute', concentration: 18.5 },
      { ingredientName: 'Sandalwood Oil (Australian)', concentration: 8.9 },
      { ingredientName: 'Rose Absolute', concentration: 6.2 },
      { ingredientName: 'Lavender Essential Oil', concentration: 3.8 },
      { ingredientName: 'IPM Carrier', concentration: 62.6 }
    ]
  },
  {
    metadata: {
      id: 'REF-004',
      name: 'Ocean Breeze',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 7.2,
      cost: 35.90,
      density: '0.84 g/ml',
      stability: 'Excellent'
    },
    ingredients: [
      { ingredientName: 'Bergamot Essential Oil', concentration: 18.2 },
      { ingredientName: 'Lemon Essential Oil', concentration: 14.5 },
      { ingredientName: 'Neroli Essential Oil', concentration: 6.8 },
      { ingredientName: 'Hedione', concentration: 2.3 },
      { ingredientName: 'Ethanol 95%', concentration: 58.2 }
    ]
  },
  {
    metadata: {
      id: 'REF-005',
      name: 'Woody Amber',
      active: 100.0,
      base: 'Jojoba Oil',
      ph: 6.3,
      cost: 67.80,
      density: '0.95 g/ml',
      stability: 'Very Good'
    },
    ingredients: [
      { ingredientName: 'Sandalwood Essential Oil', concentration: 22.1 },
      { ingredientName: 'Patchouli Essential Oil', concentration: 15.3 },
      { ingredientName: 'Iso E Super', concentration: 8.7 },
      { ingredientName: 'Vanilla Absolute', concentration: 5.2 },
      { ingredientName: 'Jojoba Oil Base', concentration: 48.7 }
    ]
  },
  {
    metadata: {
      id: 'REF-006',
      name: 'Rose Garden',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 6.9,
      cost: 89.45,
      density: '0.88 g/ml',
      stability: 'Good'
    },
    ingredients: [
      { ingredientName: 'Rose Otto', concentration: 8.5 },
      { ingredientName: 'Rose Absolute', concentration: 12.3 },
      { ingredientName: 'Hedione', concentration: 4.7 },
      { ingredientName: 'Ylang Ylang Essential Oil', concentration: 6.1 },
      { ingredientName: 'Ethanol 95%', concentration: 68.4 }
    ]
  },
  {
    metadata: {
      id: 'REF-007',
      name: 'Spiced Citrus',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 7.0,
      cost: 41.25,
      density: '0.86 g/ml',
      stability: 'Excellent'
    },
    ingredients: [
      { ingredientName: 'Orange Sweet Essential Oil', concentration: 16.8 },
      { ingredientName: 'Bergamot Essential Oil', concentration: 11.2 },
      { ingredientName: 'Limonene', concentration: 3.4 },
      { ingredientName: 'Lavender Essential Oil', concentration: 2.1 },
      { ingredientName: 'Ethanol 95%', concentration: 66.5 }
    ]
  },
  {
    metadata: {
      id: 'REF-008',
      name: 'Green Tea Zen',
      active: 100.0,
      base: 'Grape Seed Oil',
      ph: 6.7,
      cost: 52.30,
      density: '0.91 g/ml',
      stability: 'Good'
    },
    ingredients: [
      { ingredientName: 'Lavender Essential Oil', concentration: 14.2 },
      { ingredientName: 'Bergamot Essential Oil', concentration: 9.8 },
      { ingredientName: 'Jasmine Absolute', concentration: 4.5 },
      { ingredientName: 'Neroli Essential Oil', concentration: 3.2 },
      { ingredientName: 'Grape Seed Oil Base', concentration: 68.3 }
    ]
  },
  {
    metadata: {
      id: 'REF-009',
      name: 'Midnight Oud',
      active: 100.0,
      base: 'Fractionated Coconut Oil',
      ph: 6.1,
      cost: 124.75,
      density: '0.97 g/ml',
      stability: 'Very Good'
    },
    ingredients: [
      { ingredientName: 'Mystic Woods Captive', concentration: 12.8 },
      { ingredientName: 'Rose Otto', concentration: 6.3 },
      { ingredientName: 'Sandalwood Essential Oil', concentration: 8.9 },
      { ingredientName: 'Patchouli Essential Oil', concentration: 2.7 },
      { ingredientName: 'Fractionated Coconut Oil', concentration: 69.3 }
    ]
  },
  {
    metadata: {
      id: 'REF-010',
      name: 'Summer Meadow',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 7.1,
      cost: 36.85,
      density: '0.85 g/ml',
      stability: 'Excellent'
    },
    ingredients: [
      { ingredientName: 'Lavender Essential Oil', concentration: 14.7 },
      { ingredientName: 'Lavender Absolute', concentration: 8.3 },
      { ingredientName: 'Hedione', concentration: 5.1 },
      { ingredientName: 'Bergamot Essential Oil', concentration: 3.2 },
      { ingredientName: 'Ethanol 95%', concentration: 68.7 }
    ]
  },
  {
    metadata: {
      id: 'REF-011',
      name: 'Tropical Paradise',
      active: 100.0,
      base: 'Ethanol 95%',
      ph: 7.3,
      cost: 44.60,
      density: '0.83 g/ml',
      stability: 'Good'
    },
    ingredients: [
      { ingredientName: 'Orange Sweet Essential Oil', concentration: 19.2 },
      { ingredientName: 'Lemon Essential Oil', concentration: 12.8 },
      { ingredientName: 'Ylang Ylang Essential Oil', concentration: 7.4 },
      { ingredientName: 'Bergamot Essential Oil', concentration: 6.1 },
      { ingredientName: 'Ethanol 95%', concentration: 54.5 }
    ]
  },
  {
    metadata: {
      id: 'REF-012',
      name: 'Winter Spice',
      active: 100.0,
      base: 'Sweet Almond Oil',
      ph: 6.4,
      cost: 58.90,
      density: '0.93 g/ml',
      stability: 'Very Good'
    },
    ingredients: [
      { ingredientName: 'Vanilla Absolute', concentration: 8.9 },
      { ingredientName: 'Sandalwood Oil (Australian)', concentration: 5.2 },
      { ingredientName: 'Orange Sweet Essential Oil', concentration: 11.6 },
      { ingredientName: 'Patchouli Essential Oil', concentration: 7.8 },
      { ingredientName: 'Sweet Almond Oil Base', concentration: 66.5 }
    ]
  }
] 