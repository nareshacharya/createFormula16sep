/**
 * React Hook for Pega Integration
 * Provides easy-to-use interface for capturing and submitting formula data to Pega
 */

import { useCallback, useState } from 'react';
import { useFormula } from '../context/FormulaContext';
import PegaIntegrationService, { PegaFormulaData, PegaApiResponse } from '../services/PegaIntegrationService';

export interface PegaIntegrationState {
    isSubmitting: boolean;
    isValidating: boolean;
    lastSubmissionResult: PegaApiResponse | null;
    validationErrors: string[];
    currentCaseId: string | null;
}

export interface UsePegaIntegrationReturn {
    // State
    integrationState: PegaIntegrationState;

    // Actions
    initializePegaContext: (caseId: string) => void;
    validateFormula: () => { isValid: boolean; errors: string[] };
    captureFormulaData: () => PegaFormulaData;
    saveFormulaLocally: () => void;
    submitToPega: (formulaMetadata: {
        name: string;
        author: string;
        version?: string;
    }) => Promise<PegaApiResponse>;
    resetIntegration: () => void;

    // Utilities
    exportFormulaJson: () => string;
    getFormulaSummaryForPega: () => any;
}

export const usePegaIntegration = (): UsePegaIntegrationReturn => {
    const {
        activeIngredients,
        formulaSummary,
        batchSize,
        batchUnit,
    } = useFormula();

    const [integrationState, setIntegrationState] = useState<PegaIntegrationState>({
        isSubmitting: false,
        isValidating: false,
        lastSubmissionResult: null,
        validationErrors: [],
        currentCaseId: null,
    });

    const pegaService = PegaIntegrationService.getInstance();

    // Initialize Pega context with case ID
    const initializePegaContext = useCallback((caseId: string) => {
        pegaService.initializePegaContext(caseId);
        setIntegrationState(prev => ({
            ...prev,
            currentCaseId: caseId,
            lastSubmissionResult: null,
            validationErrors: [],
        }));
    }, [pegaService]);

    // Validate formula data before submission
    const validateFormula = useCallback(() => {
        setIntegrationState(prev => ({ ...prev, isValidating: true }));

        try {
            // Create temporary formula data for validation
            const tempFormulaData = pegaService.formatFormulaDataForPega(
                activeIngredients,
                formulaSummary,
                {
                    name: 'Validation Formula',
                    author: 'System',
                    version: '1.0',
                    batchSize,
                    batchUnit,
                    complianceStatus: 'pending',
                }
            );

            const validation = PegaIntegrationService.validateFormulaData(tempFormulaData);

            setIntegrationState(prev => ({
                ...prev,
                isValidating: false,
                validationErrors: validation.errors,
            }));

            return validation;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Validation failed';
            setIntegrationState(prev => ({
                ...prev,
                isValidating: false,
                validationErrors: [errorMessage],
            }));

            return { isValid: false, errors: [errorMessage] };
        }
    }, [activeIngredients, formulaSummary, batchSize, batchUnit, pegaService]);

    // Capture current formula data in Pega format
    const captureFormulaData = useCallback((formulaMetadata?: {
        name: string;
        author: string;
        version?: string;
    }) => {
        const metadata = formulaMetadata || {
            name: `Formula_${new Date().toISOString().split('T')[0]}`,
            author: 'Anonymous',
            version: '1.0',
        };

        return pegaService.formatFormulaDataForPega(
            activeIngredients,
            formulaSummary,
            {
                ...metadata,
                batchSize,
                batchUnit,
                complianceStatus: 'pending',
            }
        );
    }, [activeIngredients, formulaSummary, batchSize, batchUnit, pegaService]);

    // Save formula data locally (for backup/debugging)
    const saveFormulaLocally = useCallback(() => {
        try {
            const formulaData = captureFormulaData();
            PegaIntegrationService.saveFormulaDataLocally(formulaData);

            console.log('[Pega Integration Hook] Formula data saved locally');
        } catch (error) {
            console.error('[Pega Integration Hook] Failed to save locally:', error);
        }
    }, [captureFormulaData]);

    // Submit formula to Pega API
    const submitToPega = useCallback(async (formulaMetadata: {
        name: string;
        author: string;
        version?: string;
    }): Promise<PegaApiResponse> => {
        setIntegrationState(prev => ({ ...prev, isSubmitting: true }));

        try {
            // First validate the data
            const validation = validateFormula();
            if (!validation.isValid) {
                const response: PegaApiResponse = {
                    success: false,
                    message: 'Formula validation failed',
                    timestamp: new Date().toISOString(),
                    validationErrors: validation.errors,
                };

                setIntegrationState(prev => ({
                    ...prev,
                    isSubmitting: false,
                    lastSubmissionResult: response,
                }));

                return response;
            }

            // Capture and format data
            const formulaData = pegaService.formatFormulaDataForPega(
                activeIngredients,
                formulaSummary,
                {
                    ...formulaMetadata,
                    batchSize,
                    batchUnit,
                    complianceStatus: 'pending',
                }
            );

            // Submit to Pega
            const result = await pegaService.submitFormulaToPega(formulaData);

            setIntegrationState(prev => ({
                ...prev,
                isSubmitting: false,
                lastSubmissionResult: result,
                validationErrors: result.validationErrors || [],
            }));

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Submission failed';
            const response: PegaApiResponse = {
                success: false,
                message: errorMessage,
                timestamp: new Date().toISOString(),
            };

            setIntegrationState(prev => ({
                ...prev,
                isSubmitting: false,
                lastSubmissionResult: response,
            }));

            return response;
        }
    }, [activeIngredients, formulaSummary, batchSize, batchUnit, pegaService, validateFormula]);

    // Reset integration state
    const resetIntegration = useCallback(() => {
        pegaService.reset();
        setIntegrationState({
            isSubmitting: false,
            isValidating: false,
            lastSubmissionResult: null,
            validationErrors: [],
            currentCaseId: null,
        });
    }, [pegaService]);

    // Export formula as JSON string
    const exportFormulaJson = useCallback(() => {
        const formulaData = captureFormulaData();
        return JSON.stringify(formulaData, null, 2);
    }, [captureFormulaData]);

    // Get formula summary formatted for Pega
    const getFormulaSummaryForPega = useCallback(() => {
        return {
            ingredientCount: activeIngredients.length,
            totalCost: formulaSummary.totalCost,
            totalWeight: formulaSummary.totalWeight,
            totalConcentration: formulaSummary.totalConcentration,
            batchSize,
            batchUnit,
            averageCostPerKg: formulaSummary.averageCostPerKg,
            lastUpdated: new Date().toISOString(),
        };
    }, [activeIngredients.length, formulaSummary, batchSize, batchUnit]);

    return {
        integrationState,
        initializePegaContext,
        validateFormula,
        captureFormulaData,
        saveFormulaLocally,
        submitToPega,
        resetIntegration,
        exportFormulaJson,
        getFormulaSummaryForPega,
    };
};

export default usePegaIntegration;
