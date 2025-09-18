// Integration Guide for External Database
// =====================================

/\*
This file demonstrates how to integrate the ingredient data service with external databases.

## Current Implementation (Mock Data)

The component currently uses mockIngredients from '../data/mockData'

## Integration Steps for External Database

1. **Replace the direct import:**
   Instead of: import { mockIngredients } from '../data/mockData'
   Use: import { IngredientAPI } from '../services/ingredientDataService'

2. **Convert to async data loading:**

   // Before (synchronous):
   const [ingredients] = useState(mockIngredients);

   // After (async with external database):
   const [ingredients, setIngredients] = useState<Ingredient[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
   const loadIngredients = async () => {
   setLoading(true);
   try {
   const data = await IngredientAPI.getAll();
   setIngredients(data);
   } catch (error) {
   console.error('Failed to load ingredients:', error);
   } finally {
   setLoading(false);
   }
   };

   loadIngredients();
   }, []);

3. **Update search functionality:**

   // Before (client-side filtering):
   const filteredIngredients = ingredients.filter(ing =>
   ing.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // After (server-side search):
   const handleSearch = useCallback(async (query: string) => {
   setLoading(true);
   try {
   const results = await IngredientAPI.search(query);
   setIngredients(results);
   } catch (error) {
   console.error('Search failed:', error);
   } finally {
   setLoading(false);
   }
   }, []);

4. **Add error handling and loading states:**

   if (loading) {
   return <LoadingSpinner />;
   }

   if (error) {
   return <ErrorMessage message="Failed to load ingredients" />;
   }

5. **Configure the data service for your database:**

   In services/ingredientDataService.ts, uncomment and configure the DatabaseIngredientDataService:

   export const ingredientDataService = new DatabaseIngredientDataService(
   'https://your-database-api.com/api',
   'your-api-key'
   );

## API Interface Expected by the Service

Your external database API should provide these endpoints:

- GET /ingredients - Get all ingredients
- GET /ingredients/:id - Get ingredient by ID
- GET /ingredients/search?q=query - Search ingredients
- GET /ingredients?category=category - Filter by category
- GET /ingredients/:id/details - Get detailed ingredient information

## Data Format Expected

The API should return ingredients in this format:

{
"id": "string",
"name": "string",
"casNumber": "string",
"category": "Natural" | "Synthetic" | "Solvent" | "Functional",
"defaultConcentration": number,
"costPerKg": number,
"tags": string[],
"attributes": {
"intensity": number,
"family": "string",
"note": "string",
"volatility": "high" | "medium" | "low",
"solubility": "water" | "oil" | "both"
},
"description": "string",
"safetyNotes": "string",
"regulatoryStatus": "string",
"composition": [...], // Optional ingredient components
"compliance": {...}, // Optional regulatory compliance data
"isCaptive": boolean,
"createdAt": "ISO date string",
"updatedAt": "ISO date string"
}

## Benefits of This Approach

1. **Easy Migration**: Just replace the data service implementation
2. **Type Safety**: Full TypeScript support maintained
3. **Error Handling**: Built-in error handling and loading states
4. **Performance**: Server-side search and filtering
5. **Scalability**: Supports pagination and caching
6. **Consistency**: Same interface for mock and real data

## Testing

You can test the integration by:

1. Implementing a simple test API endpoint
2. Updating the service configuration
3. The UI will work identically with real data

\*/
