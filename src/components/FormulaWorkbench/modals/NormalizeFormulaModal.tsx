import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Modal, SecondaryButton, PrimaryButton } from "../../common";
import { Formula, FormulaIngredient } from "../../../models/Formula";

interface NormalizeFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formula: Formula;
  onNormalize: (normalizedFormula: Formula) => void;
  selectedRows?: string[];
  batchValue?: number;
  batchUnit?: string;
}

type NormalizationTarget = "percentage" | "amount" | "batch";
type RoundingMode = "half_up" | "down" | "bankers";
type Scope = "all_unlocked" | "selected_rows";

interface NormalizationPreview {
  currentTotal: {
    amount: number;
    cost: number;
  };
  newTotal: {
    amount: number;
    cost: number;
  };
  rowChanges: Array<{
    ingredientId: string;
    ingredientName: string;
    oldAmount: number;
    newAmount: number;
    delta: number;
    newPercentage: number;
    isAnchor: boolean;
    complianceWarning?: string;
  }>;
  scaleFactor: number;
  warnings: string[];
}

// Extended FormulaIngredient with additional properties for anchoring
interface ExtendedFormulaIngredient extends FormulaIngredient {
  isLocked?: boolean;
  complianceOverride?: boolean;
  maxPercentage?: number;
}

const NormalizeFormulaModal: React.FC<NormalizeFormulaModalProps> = ({
  isOpen,
  onClose,
  formula,
  onNormalize,
  selectedRows = [],
  batchValue,
  batchUnit = "g",
}) => {
  // Validate formula ingredients after all hooks are called
  // Split validation to handle both regular ingredients and formula groups
  const regularIngredients = formula.ingredients.filter(
    (item) => !("type" in item) || item.type !== "formulaGroup"
  );

  const hasInvalidIngredients = regularIngredients.some(
    (ing) => !ing.ingredient || typeof ing.ingredient.costPerKg !== "number"
  );

  // If there are invalid regular ingredients, show error and return early
  if (hasInvalidIngredients) {
    console.error(
      "Invalid ingredients detected in formula:",
      formula.ingredients.filter(
        (item) =>
          (!("type" in item) || item.type !== "formulaGroup") &&
          (!item.ingredient || typeof item.ingredient.costPerKg !== "number")
      )
    );
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Formula Error"
        footer={<SecondaryButton onClick={onClose}>Close</SecondaryButton>}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ color: "#dc2626", marginBottom: "16px" }}>
            Cannot normalize formula
          </h3>
          <p style={{ marginBottom: "16px" }}>
            This formula contains invalid or incomplete ingredient data. Please
            ensure all ingredients are properly loaded.
          </p>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Try refreshing the page or reloading the formula.
          </p>
        </div>
      </Modal>
    );
  }
  // State for normalization parameters
  const [target, setTarget] = useState<NormalizationTarget>("percentage");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [targetUnit, setTargetUnit] = useState<"g" | "kg" | "L">("g");
  const [scope, setScope] = useState<Scope>("all_unlocked");
  const [treatLockedAsAnchors, setTreatLockedAsAnchors] = useState(true);
  const [anchorComplianceOverrides, setAnchorComplianceOverrides] =
    useState(true);
  const [balancingMode, setBalancingMode] = useState<"auto" | "manual">("auto");
  const [balancingRowId, setBalancingRowId] = useState<string>("");
  const [roundingStep, setRoundingStep] = useState<number>(0.01);
  const [roundingMode, setRoundingMode] = useState<RoundingMode>("half_up");

  // Calculate current formula totals (only from regular ingredients, not formula groups)
  const currentTotals = useMemo(() => {
    const regularIngredients = formula.ingredients.filter(
      (item) => !("type" in item) || item.type !== "formulaGroup"
    );

    const totalAmount = regularIngredients.reduce(
      (sum, ing) => sum + ing.quantity,
      0
    );
    const totalCost = regularIngredients.reduce((sum, ing) => {
      // Safety check for ingredient object
      const costPerKg = ing.ingredient?.costPerKg || 0;
      return sum + ing.quantity * costPerKg;
    }, 0);
    return { amount: totalAmount, cost: totalCost };
  }, [formula.ingredients]);

  // Initialize target amount with current total
  useEffect(() => {
    if (targetAmount === 0) {
      setTargetAmount(currentTotals.amount);
    }
  }, [currentTotals.amount, targetAmount]);

  // Determine which rows are anchors (only regular ingredients, not formula groups)
  const getAnchorRows = useMemo(() => {
    const regularIngredients = formula.ingredients.filter(
      (item) => !("type" in item) || item.type !== "formulaGroup"
    );

    return regularIngredients.filter((ingredient) => {
      // For now, we'll use a simple approach - ingredients can be marked as locked
      // This would typically be extended based on your formula structure
      const extIngredient = ingredient as ExtendedFormulaIngredient;
      if (treatLockedAsAnchors && extIngredient.isLocked) return true;
      if (anchorComplianceOverrides && extIngredient.complianceOverride)
        return true;
      return false;
    });
  }, [formula.ingredients, treatLockedAsAnchors, anchorComplianceOverrides]);

  // Determine which rows can be normalized (only regular ingredients, not formula groups)
  const getNormalizableRows = useMemo(() => {
    const anchorIds = new Set(getAnchorRows.map((r) => r.id));
    const regularIngredients = formula.ingredients.filter(
      (item) => !("type" in item) || item.type !== "formulaGroup"
    );

    if (scope === "selected_rows") {
      return regularIngredients.filter(
        (ingredient) =>
          ingredient.ingredient && // Add null safety check
          selectedRows.includes(ingredient.id) &&
          !anchorIds.has(ingredient.id)
      );
    }

    return regularIngredients.filter(
      (ingredient) => ingredient.ingredient && !anchorIds.has(ingredient.id) // Add null safety check
    );
  }, [formula.ingredients, getAnchorRows, scope, selectedRows]);

  // Auto-select largest unlocked row for balancing
  const getDefaultBalancingRow = useMemo(() => {
    if (getNormalizableRows.length === 0) return null;
    return getNormalizableRows.reduce((largest, current) =>
      current.quantity > largest.quantity ? current : largest
    );
  }, [getNormalizableRows]);

  // Set default balancing row
  useEffect(() => {
    if (balancingMode === "auto" && getDefaultBalancingRow) {
      setBalancingRowId(getDefaultBalancingRow.id);
    }
  }, [balancingMode, getDefaultBalancingRow]);

  // Rounding function
  const applyRounding = (
    value: number,
    step: number,
    mode: RoundingMode
  ): number => {
    const factor = 1 / step;

    switch (mode) {
      case "half_up":
        return Math.round(value * factor) / factor;
      case "down":
        return Math.floor(value * factor) / factor;
      case "bankers":
        const scaled = value * factor;
        const floored = Math.floor(scaled);
        const remainder = scaled - floored;

        if (remainder < 0.5) return floored / factor;
        if (remainder > 0.5) return (floored + 1) / factor;

        // Exactly 0.5 - round to even
        return (floored % 2 === 0 ? floored : floored + 1) / factor;
      default:
        return value;
    }
  };

  // Calculate normalization preview
  const preview: NormalizationPreview = useMemo(() => {
    const warnings: string[] = [];
    const anchorRows = getAnchorRows;
    const normalizableRows = getNormalizableRows;

    if (normalizableRows.length === 0) {
      warnings.push(
        "No rows available for normalization. All rows are anchored."
      );
      return {
        currentTotal: currentTotals,
        newTotal: currentTotals,
        rowChanges: [],
        scaleFactor: 1,
        warnings,
      };
    }

    // Calculate target total amount
    let targetTotalAmount: number;

    switch (target) {
      case "percentage":
        // For 100% normalization, keep current mass but ensure percentages sum to 100%
        targetTotalAmount = currentTotals.amount;
        break;
      case "amount":
        targetTotalAmount = targetAmount;
        break;
      case "batch":
        targetTotalAmount = batchValue || currentTotals.amount;
        break;
      default:
        targetTotalAmount = currentTotals.amount;
    }

    // Calculate scale factor
    const anchorSum = anchorRows.reduce((sum, ing) => sum + ing.quantity, 0);
    const normalizableSum = normalizableRows.reduce(
      (sum, ing) => sum + ing.quantity,
      0
    );

    if (normalizableSum === 0) {
      warnings.push("Cannot normalize: sum of normalizable rows is zero.");
      return {
        currentTotal: currentTotals,
        newTotal: currentTotals,
        rowChanges: [],
        scaleFactor: 1,
        warnings,
      };
    }

    const scaleFactor = (targetTotalAmount - anchorSum) / normalizableSum;

    if (scaleFactor <= 0) {
      warnings.push(
        "Scale factor is zero or negative. Target amount may be too small."
      );
    }

    // Calculate new amounts for normalizable rows (only regular ingredients)
    const regularIngredients = formula.ingredients.filter(
      (item) => !("type" in item) || item.type !== "formulaGroup"
    );

    const rowChanges = regularIngredients
      .filter((ingredient) => ingredient.ingredient) // Filter out ingredients without valid ingredient property
      .map((ingredient) => {
        const isAnchor = anchorRows.some(
          (anchor) => anchor.id === ingredient.id
        );

        if (isAnchor) {
          return {
            ingredientId: ingredient.id,
            ingredientName: ingredient.ingredient.name,
            oldAmount: ingredient.quantity,
            newAmount: ingredient.quantity,
            delta: 0,
            newPercentage: (ingredient.quantity / targetTotalAmount) * 100,
            isAnchor: true,
          };
        }

        const rawNewAmount = ingredient.quantity * scaleFactor;
        const roundedAmount = Math.max(
          0,
          applyRounding(rawNewAmount, roundingStep, roundingMode)
        );

        return {
          ingredientId: ingredient.id,
          ingredientName: ingredient.ingredient.name,
          oldAmount: ingredient.quantity,
          newAmount: roundedAmount,
          delta: roundedAmount - ingredient.quantity,
          newPercentage: (roundedAmount / targetTotalAmount) * 100,
          isAnchor: false,
        };
      });

    // Calculate residual and apply to balancing row
    const newSum = rowChanges.reduce(
      (sum, change) => sum + change.newAmount,
      0
    );
    const residual = targetTotalAmount - newSum;

    if (Math.abs(residual) > 0.001 && balancingRowId) {
      const balancingIndex = rowChanges.findIndex(
        (change) => change.ingredientId === balancingRowId
      );
      if (balancingIndex >= 0) {
        const newBalancingAmount = Math.max(
          0,
          rowChanges[balancingIndex].newAmount + residual
        );
        rowChanges[balancingIndex] = {
          ...rowChanges[balancingIndex],
          newAmount: newBalancingAmount,
          delta: newBalancingAmount - rowChanges[balancingIndex].oldAmount,
          newPercentage: (newBalancingAmount / targetTotalAmount) * 100,
        };

        if (newBalancingAmount === 0 && residual > 0) {
          warnings.push(
            "Balancing row would become zero. Consider different parameters."
          );
        }
      }
    }

    // Recalculate final totals
    const finalAmount = rowChanges.reduce(
      (sum, change) => sum + change.newAmount,
      0
    );
    const finalCost = rowChanges.reduce((sum, change) => {
      const ingredient = formula.ingredients.find(
        (ing) => ing.id === change.ingredientId
      );
      return sum + change.newAmount * (ingredient?.ingredient.costPerKg || 0);
    }, 0);

    // Check for compliance warnings (simplified - would need extended ingredient data)
    rowChanges.forEach((change) => {
      const ingredient = formula.ingredients.find(
        (ing) => ing.id === change.ingredientId
      );
      const extIngredient = ingredient as ExtendedFormulaIngredient;
      if (
        extIngredient?.maxPercentage &&
        change.newPercentage > extIngredient.maxPercentage
      ) {
        (change as any).complianceWarning =
          `Exceeds max ${extIngredient.maxPercentage}%`;
        warnings.push(
          `${ingredient?.ingredient.name} exceeds maximum percentage limit`
        );
      }
    });

    return {
      currentTotal: currentTotals,
      newTotal: { amount: finalAmount, cost: finalCost },
      rowChanges,
      scaleFactor,
      warnings,
    };
  }, [
    target,
    targetAmount,
    batchValue,
    getAnchorRows,
    getNormalizableRows,
    balancingRowId,
    roundingStep,
    roundingMode,
    currentTotals,
    formula.ingredients,
  ]);

  const handleNormalize = () => {
    if (
      preview.warnings.length > 0 &&
      !confirm("There are warnings. Do you want to proceed?")
    ) {
      return;
    }

    // Create normalized formula
    const normalizedIngredients = formula.ingredients.map((ingredient) => {
      const change = preview.rowChanges.find(
        (c) => c.ingredientId === ingredient.id
      );
      if (change) {
        return {
          ...ingredient,
          quantity: change.newAmount,
          concentration: change.newPercentage,
        };
      }
      return ingredient;
    });

    const normalizedFormula: Formula = {
      ...formula,
      ingredients: normalizedIngredients,
    };

    onNormalize(normalizedFormula);
    onClose();
  };

  const canNormalize =
    preview.rowChanges.length > 0 &&
    getNormalizableRows.length > 0 &&
    preview.scaleFactor > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Normalize Formula"
      size="xlarge"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleNormalize} disabled={!canNormalize}>
            Normalize
          </PrimaryButton>
        </>
      }
    >
      <ModalBody>
        <TwoColumnLayout>
          <LeftColumn>
            <Section>
              <SectionTitle>Target</SectionTitle>
              <RadioGroup>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="percentage"
                    checked={target === "percentage"}
                    onChange={(e) =>
                      setTarget(e.target.value as NormalizationTarget)
                    }
                  />
                  Normalize to 100% composition
                </RadioOption>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="amount"
                    checked={target === "amount"}
                    onChange={(e) =>
                      setTarget(e.target.value as NormalizationTarget)
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Normalize total amount to:
                    <Input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      disabled={target !== "amount"}
                      style={{ width: "80px" }}
                      min="0.1"
                      step="0.1"
                    />
                    <Select
                      value={targetUnit}
                      onChange={(e) =>
                        setTargetUnit(e.target.value as "g" | "kg" | "L")
                      }
                      disabled={target !== "amount"}
                      style={{ width: "60px" }}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                    </Select>
                  </div>
                </RadioOption>
                {batchValue && (
                  <RadioOption>
                    <RadioInput
                      type="radio"
                      value="batch"
                      checked={target === "batch"}
                      onChange={(e) =>
                        setTarget(e.target.value as NormalizationTarget)
                      }
                    />
                    Normalize total to Batch value ({batchValue}
                    {batchUnit})
                  </RadioOption>
                )}
              </RadioGroup>
            </Section>

            <Section>
              <SectionTitle>Scope</SectionTitle>
              <RadioGroup>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="all_unlocked"
                    checked={scope === "all_unlocked"}
                    onChange={(e) => setScope(e.target.value as Scope)}
                  />
                  All unlocked rows
                </RadioOption>
                {selectedRows.length > 0 && (
                  <RadioOption>
                    <RadioInput
                      type="radio"
                      value="selected_rows"
                      checked={scope === "selected_rows"}
                      onChange={(e) => setScope(e.target.value as Scope)}
                    />
                    Only selected rows ({selectedRows.length} selected)
                  </RadioOption>
                )}
              </RadioGroup>
            </Section>

            <Section>
              <SectionTitle>Anchors (don't change)</SectionTitle>
              <CheckboxGroup>
                <CheckboxOption>
                  <CheckboxInput
                    type="checkbox"
                    checked={treatLockedAsAnchors}
                    onChange={(e) => setTreatLockedAsAnchors(e.target.checked)}
                  />
                  Treat locked/pinned rows as anchors
                </CheckboxOption>
                <CheckboxOption>
                  <CheckboxInput
                    type="checkbox"
                    checked={anchorComplianceOverrides}
                    onChange={(e) =>
                      setAnchorComplianceOverrides(e.target.checked)
                    }
                  />
                  Also anchor rows with compliance overrides
                </CheckboxOption>
              </CheckboxGroup>
            </Section>

            <Section>
              <SectionTitle>
                Balancing row (handles rounding residuals)
              </SectionTitle>
              <RadioGroup>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="auto"
                    checked={balancingMode === "auto"}
                    onChange={() => setBalancingMode("auto")}
                  />
                  Auto-select largest unlocked
                  {getDefaultBalancingRow && (
                    <span style={{ marginLeft: "8px", color: "#64748b" }}>
                      ({getDefaultBalancingRow.ingredient.name})
                    </span>
                  )}
                </RadioOption>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="manual"
                    checked={balancingMode === "manual"}
                    onChange={() => setBalancingMode("manual")}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Pick from dropdown:
                    <Select
                      value={balancingRowId}
                      onChange={(e) => setBalancingRowId(e.target.value)}
                      disabled={balancingMode !== "manual"}
                      style={{ minWidth: "150px" }}
                    >
                      <option value="">Select row...</option>
                      {getNormalizableRows.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.ingredient.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </RadioOption>
              </RadioGroup>
            </Section>

            <Section>
              <SectionTitle>Rounding</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Step:</Label>
                  <Select
                    value={roundingStep}
                    onChange={(e) => setRoundingStep(Number(e.target.value))}
                  >
                    <option value={0.01}>0.01g</option>
                    <option value={0.1}>0.1g</option>
                    <option value={1.0}>1.0g</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Mode:</Label>
                  <Select
                    value={roundingMode}
                    onChange={(e) =>
                      setRoundingMode(e.target.value as RoundingMode)
                    }
                  >
                    <option value="half_up">Half up</option>
                    <option value="down">Down</option>
                    <option value="bankers">Banker's</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>
          </LeftColumn>

          <RightColumn>
            <Section>
              <PreviewPanel>
                <PreviewTitle>Preview</PreviewTitle>

                <PreviewGrid>
                  <CurrentValuesContainer>
                    <PreviewItem>
                      <PreviewLabel>Current Amount:</PreviewLabel>
                      <PreviewValue>
                        {preview.currentTotal.amount.toFixed(2)}g
                      </PreviewValue>
                    </PreviewItem>
                    <PreviewItem>
                      <PreviewLabel>Current Cost:</PreviewLabel>
                      <PreviewValue>
                        €{preview.currentTotal.cost.toFixed(2)}
                      </PreviewValue>
                    </PreviewItem>
                  </CurrentValuesContainer>
                  <NewValuesContainer>
                    <WhitePreviewItem>
                      <WhitePreviewLabel>New Amount:</WhitePreviewLabel>
                      <WhitePreviewValue>
                        {preview.newTotal.amount.toFixed(2)}g
                      </WhitePreviewValue>
                    </WhitePreviewItem>
                    <WhitePreviewItem>
                      <WhitePreviewLabel>New Cost:</WhitePreviewLabel>
                      <WhitePreviewValue>
                        €{preview.newTotal.cost.toFixed(2)}
                      </WhitePreviewValue>
                    </WhitePreviewItem>
                  </NewValuesContainer>
                </PreviewGrid>

                <ScaleFactorInfo>
                  Scale Factor:{" "}
                  <strong>{preview.scaleFactor.toFixed(4)}</strong>
                </ScaleFactorInfo>

                {preview.warnings.length > 0 && (
                  <WarningsSection>
                    <WarningsTitle>⚠️ Warnings</WarningsTitle>
                    {preview.warnings.map((warning, index) => (
                      <Warning key={index}>{warning}</Warning>
                    ))}
                  </WarningsSection>
                )}

                <ChangesTable>
                  <ChangesHeader>Ingredient Changes</ChangesHeader>
                  <TableHeader>
                    <HeaderCell>Ingredient</HeaderCell>
                    <HeaderCell>Old</HeaderCell>
                    <HeaderCell>New</HeaderCell>
                    <HeaderCell>Δ</HeaderCell>
                    <HeaderCell>%</HeaderCell>
                  </TableHeader>
                  <TableBody>
                    {preview.rowChanges.map((change) => (
                      <TableRow
                        key={change.ingredientId}
                        $isAnchor={change.isAnchor}
                      >
                        <NameCell>
                          {change.ingredientName}
                          {change.isAnchor && <AnchorBadge>ANCHOR</AnchorBadge>}
                          {change.complianceWarning && (
                            <ComplianceWarning>
                              ⚠️ {change.complianceWarning}
                            </ComplianceWarning>
                          )}
                        </NameCell>
                        <DataCell>{change.oldAmount.toFixed(2)}g</DataCell>
                        <DataCell>{change.newAmount.toFixed(2)}g</DataCell>
                        <DeltaCell $positive={change.delta >= 0}>
                          {change.delta >= 0 ? "+" : ""}
                          {change.delta.toFixed(2)}g
                        </DeltaCell>
                        <DataCell>{change.newPercentage.toFixed(3)}%</DataCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ChangesTable>
              </PreviewPanel>
            </Section>
          </RightColumn>
        </TwoColumnLayout>
      </ModalBody>
    </Modal>
  );
};

// Styled Components
const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  gap: 28px;
  height: 100%;
  min-height: 0;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  gap: 28px;
  height: 100%;
  align-items: flex-start;
  width: 100%;
`;

const LeftColumn = styled.div`
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  max-width: 40%;
`;

const RightColumn = styled.div`
  flex: 0 0 55%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 55%;
  position: sticky;
  top: 0;
  max-height: 70vh;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 18px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
`;

const RadioInput = styled.input`
  margin: 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
`;

const CheckboxInput = styled.input`
  margin: 0;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }
`;

const PreviewPanel = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  min-height: fit-content;
`;

const PreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "📊";
    font-size: 18px;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const CurrentValuesContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const NewValuesContainer = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #2563eb;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  color: white;
`;

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
  min-width: 0;
  white-space: nowrap;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const WhitePreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 0;
  white-space: nowrap;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const PreviewLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  min-width: 0;
  white-space: nowrap;
`;

const WhitePreviewLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  min-width: 0;
  white-space: nowrap;
`;

const PreviewValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  min-width: 0;
  white-space: nowrap;
`;

const WhitePreviewValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  min-width: 0;
  white-space: nowrap;
`;

const ScaleFactorInfo = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #92400e;
`;

const WarningsSection = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
`;

const WarningsTitle = styled.div`
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 8px;
`;

const Warning = styled.div`
  font-size: 14px;
  color: #dc2626;
  margin-bottom: 4px;
`;

const ChangesTable = styled.div`
  margin-top: 16px;
`;

const ChangesHeader = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px 6px 0 0;
  border: 1px solid #e2e8f0;
  border-bottom: none;
`;

const HeaderCell = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
`;

const TableBody = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
`;

const TableRow = styled.div<{ $isAnchor: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 12px;
  background: ${(props) => (props.$isAnchor ? "#fef3c7" : "white")};

  &:last-child {
    border-bottom: none;
  }
`;

const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DataCell = styled.div`
  text-align: right;
`;

const DeltaCell = styled.div<{ $positive: boolean }>`
  text-align: right;
  color: ${(props) => (props.$positive ? "#059669" : "#dc2626")};
  font-weight: 600;
`;

const AnchorBadge = styled.span`
  font-size: 10px;
  background: #f59e0b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
`;

const ComplianceWarning = styled.span`
  font-size: 10px;
  color: #dc2626;
  font-weight: 600;
`;

export default NormalizeFormulaModal;
