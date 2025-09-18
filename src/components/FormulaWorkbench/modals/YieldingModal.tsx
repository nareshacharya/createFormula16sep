import React, { useState, useMemo } from "react";
import { Modal, SecondaryButton, PrimaryButton } from "../../common";
import styled from "styled-components";
import { FormulaIngredient } from "../../../models/Formula";

interface YieldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (options: YieldingOptions) => void;
  activeIngredients: any[];
  currentBatchSize: number;
  currentUnit: "ml" | "g";
  formulaSummary: any;
}

export interface YieldingOptions {
  targetYield: number;
  targetUnit: "g" | "kg" | "L";
  lossFactor: number; // percentage (0-100)
  rounding: "none" | "0.1g" | "0.01g";
  scope: "selected" | "all";
  selectedIngredients: string[]; // IDs of ingredients to apply yield to
  premixHandling: "preserve" | "flatten";
}

interface WeightDelta {
  ingredientId: string;
  ingredientName: string;
  currentWeight: number;
  newWeight: number;
  delta: number;
}

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  gap: 24px;
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
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px 0;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  align-items: end;
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
  }
`;

const RadioInput = styled.input`
  margin: 0;
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

const WeightChangesHeader = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "⚖️";
    font-size: 18px;
  }
`;

const DeltaList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const DeltaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const DeltaName = styled.span`
  font-size: 14px;
  color: #1e293b;
  flex: 1;
  font-weight: 600;
`;

const DeltaChange = styled.span<{ $positive?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 4px;
  color: ${(props) => (props.$positive ? "#059669" : "#dc2626")};
  background: ${(props) => (props.$positive ? "#ecfdf5" : "#fef2f2")};
  border: 1px solid ${(props) => (props.$positive ? "#d1fae5" : "#fecaca")};
`;

const YieldingModal: React.FC<YieldingModalProps> = ({
  isOpen,
  onClose,
  onApply,
  activeIngredients,
  currentBatchSize,
  formulaSummary,
}) => {
  const [targetYield, setTargetYield] = useState(currentBatchSize);
  const [targetUnit, setTargetUnit] = useState<"g" | "kg" | "L">("g");
  const [lossFactor, setLossFactor] = useState(0);
  const [rounding, setRounding] = useState<"none" | "0.1g" | "0.01g">("0.1g");
  const [scope, setScope] = useState<"selected" | "all">("selected");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [premixHandling, setPremixHandling] = useState<"preserve" | "flatten">(
    "preserve"
  );

  // Convert target yield to grams for calculations
  const targetYieldInGrams = useMemo(() => {
    switch (targetUnit) {
      case "kg":
        return targetYield * 1000;
      case "L":
        return targetYield * 1000; // Assuming 1L = 1000g for perfume
      default:
        return targetYield;
    }
  }, [targetYield, targetUnit]);

  // Calculate scaling factor
  const scalingFactor = useMemo(() => {
    const currentTotal = formulaSummary.totalWeight;
    if (currentTotal === 0) return 1;

    // Apply loss factor
    const adjustedTarget = targetYieldInGrams * (1 + lossFactor / 100);
    return adjustedTarget / currentTotal;
  }, [targetYieldInGrams, lossFactor, formulaSummary.totalWeight]);

  // Calculate weight deltas
  const weightDeltas = useMemo(() => {
    const deltas: WeightDelta[] = [];

    // Filter out formula groups and only include actual ingredients
    const actualIngredients = activeIngredients.filter(
      (item): item is FormulaIngredient =>
        !("type" in item) || item.type !== "formulaGroup"
    );

    // Determine which ingredients to apply yield to
    const ingredientsToScale = scope === "all" 
      ? actualIngredients 
      : actualIngredients.filter(ing => selectedIngredients.includes(ing.id));

    ingredientsToScale.forEach((ingredient) => {
      const currentWeight = ingredient.quantity || 0;
      const newWeight = currentWeight * scalingFactor;

      // Apply rounding
      let roundedWeight = newWeight;
      if (rounding === "0.1g") {
        roundedWeight = Math.round(newWeight * 10) / 10;
      } else if (rounding === "0.01g") {
        roundedWeight = Math.round(newWeight * 100) / 100;
      }

      deltas.push({
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredient?.name || "Unknown",
        currentWeight,
        newWeight: roundedWeight,
        delta: roundedWeight - currentWeight,
      });
    });

    return deltas;
  }, [activeIngredients, scalingFactor, rounding, scope, selectedIngredients]);

  // Calculate new totals
  const newTotals = useMemo(() => {
    const newTotalWeight = weightDeltas.reduce(
      (sum, delta) => sum + delta.newWeight,
      0
    );
    const newTotalCost = weightDeltas.reduce((sum, delta) => {
      const ingredient = activeIngredients.find(
        (ing) => ing.id === delta.ingredientId
      );
      const costPerKg = ingredient?.ingredient?.costPerKg || 0;
      return sum + delta.newWeight * costPerKg / 1000;
    }, 0);

    return {
      totalWeight: newTotalWeight,
      totalCost: newTotalCost,
    };
  }, [weightDeltas, activeIngredients]);

  const handleApply = () => {
    const options: YieldingOptions = {
      targetYield: targetYieldInGrams,
      targetUnit,
      lossFactor,
      rounding,
      scope,
      selectedIngredients,
      premixHandling,
    };

    onApply(options);
    onClose();
  };

  const modalFooter = (
    <>
      <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      <PrimaryButton onClick={handleApply}>Apply Yield</PrimaryButton>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xlarge"
      title="Advanced Yielding"
      subtitle="Scale your formula to a target yield with optional loss compensation and rounding."
      footer={modalFooter}
    >
      <ModalBody>
        <TwoColumnLayout>
          <LeftColumn>
            <Section>
              <SectionTitle>Target Yield</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={targetYield}
                    onChange={(e) => setTargetYield(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                  />
                </FormGroup>
                <FormGroup style={{ flex: "0 0 120px" }}>
                  <Label>Unit</Label>
                  <Select
                    value={targetUnit}
                    onChange={(e) =>
                      setTargetUnit(e.target.value as "g" | "kg" | "L")
                    }
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            {scope === "selected" && (
              <Section>
                <SectionTitle>Select Ingredients</SectionTitle>
                <IngredientList>
                  {activeIngredients
                    .filter((item): item is FormulaIngredient =>
                      !("type" in item) || item.type !== "formulaGroup"
                    )
                    .map((ingredient) => (
                      <IngredientItem key={ingredient.id}>
                        <IngredientCheckbox
                          type="checkbox"
                          checked={selectedIngredients.includes(ingredient.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIngredients(prev => [...prev, ingredient.id]);
                            } else {
                              setSelectedIngredients(prev => prev.filter(id => id !== ingredient.id));
                            }
                          }}
                        />
                        <IngredientLabel>
                          {ingredient.ingredient?.name || "Unknown"} 
                          <IngredientAmount>
                            ({ingredient.quantity?.toFixed(1) || 0}g)
                          </IngredientAmount>
                        </IngredientLabel>
                      </IngredientItem>
                    ))}
                </IngredientList>
              </Section>
            )}

            <Section>
              <SectionTitle>Adjustments</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Loss Factor (%)</Label>
                  <Input
                    type="number"
                    value={lossFactor}
                    onChange={(e) => setLossFactor(Number(e.target.value))}
                    min="0"
                    max="50"
                    step="0.1"
                    placeholder="0.0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Rounding</Label>
                  <Select
                    value={rounding}
                    onChange={(e) =>
                      setRounding(e.target.value as "none" | "0.1g" | "0.01g")
                    }
                  >
                    <option value="none">None</option>
                    <option value="0.1g">0.1g</option>
                    <option value="0.01g">0.01g</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>Scope</SectionTitle>
              <RadioGroup>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="selected"
                    checked={scope === "selected"}
                    onChange={(e) => setScope(e.target.value as "selected")}
                  />
                  Apply to selected ingredients only
                </RadioOption>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    value="all"
                    checked={scope === "all"}
                    onChange={(e) => setScope(e.target.value as "all")}
                  />
                  Apply to all ingredients
                </RadioOption>
              </RadioGroup>
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
                        {formulaSummary.totalWeight.toFixed(1)}g
                      </PreviewValue>
                    </PreviewItem>
                    <PreviewItem>
                      <PreviewLabel>Current Cost:</PreviewLabel>
                      <PreviewValue>
                        €{formulaSummary.totalCost.toFixed(2)}
                      </PreviewValue>
                    </PreviewItem>
                  </CurrentValuesContainer>
                  <NewValuesContainer>
                    <WhitePreviewItem>
                      <WhitePreviewLabel>New Amount:</WhitePreviewLabel>
                      <WhitePreviewValue>
                        {newTotals.totalWeight.toFixed(1)}g
                      </WhitePreviewValue>
                    </WhitePreviewItem>
                    <WhitePreviewItem>
                      <WhitePreviewLabel>New Cost:</WhitePreviewLabel>
                      <WhitePreviewValue>
                        €{newTotals.totalCost.toFixed(2)}
                      </WhitePreviewValue>
                    </WhitePreviewItem>
                  </NewValuesContainer>
                </PreviewGrid>

                <WeightChangesHeader>Weight Changes</WeightChangesHeader>
                <DeltaList>
                  {weightDeltas.map((delta) => (
                    <DeltaItem key={delta.ingredientId}>
                      <DeltaName>{delta.ingredientName}</DeltaName>
                      <DeltaChange $positive={delta.delta >= 0}>
                        {delta.delta >= 0 ? "+" : ""}
                        {delta.delta.toFixed(2)}g
                      </DeltaChange>
                    </DeltaItem>
                  ))}
                </DeltaList>
              </PreviewPanel>
            </Section>
          </RightColumn>
        </TwoColumnLayout>
      </ModalBody>
    </Modal>
  );
};

const IngredientList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
`;

const IngredientItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8fafc;
  }
`;

const IngredientCheckbox = styled.input`
  margin: 0;
`;

const IngredientLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  flex: 1;
`;

const IngredientAmount = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
`;

export default YieldingModal;
