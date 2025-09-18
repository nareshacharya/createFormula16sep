import React, { useState } from "react";
import { Icon } from "../../icons";
import { Ingredient } from "../../../models/Ingredient";
import { Tabs, TabItem } from "../../common";
import styled from "styled-components";

interface IngredientCompositionModalProps {
  ingredient: Ingredient | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: flex-start;
  padding-top: 8vh;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 90%;
  height: 80vh;
  min-height: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 8vh;
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IngredientName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const IngredientMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;

  &:hover {
    color: #374151;
  }
`;

const CaptiveBadge = styled.span`
  background: #8b5cf6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ComplianceIndicator = styled.div<{
  $status: "approved" | "restricted" | "banned" | "under-review";
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;

  ${(props) => {
    switch (props.$status) {
      case "approved":
        return "background: #dcfce7; color: #166534;";
      case "restricted":
      case "under-review":
        return "background: #fef3c7; color: #92400e;";
      case "banned":
        return "background: #fee2e2; color: #991b1b;";
      default:
        return "background: #f3f4f6; color: #6b7280;";
    }
  }}
`;

const ModalBody = styled.div`
  overflow-y: auto;
  flex: 1;
  position: relative;
`;

const TabContent = styled.div`
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DataTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  margin-bottom: 24px;
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background: #f9fafb;
  }
`;

const DataCell = styled.div`
  padding: 12px 16px;
  font-size: 14px;

  &:first-child {
    font-weight: 500;
    color: #374151;
    border-right: 1px solid #e5e7eb;
  }

  &:last-child {
    color: #1f2937;
  }
`;

const CompositionTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: white;
`;

const CompositionHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  background: #f3f4f6;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const CompositionRow = styled.div<{ $type: string }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background: #f9fafb;
  }
`;

const ComponentName = styled.div<{ $type: string }>`
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ComponentType = styled.span<{ $type: string }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
`;

const AllergenCell = styled.div<{ $risk: string }>`
  font-weight: 500;
  color: ${(props) => {
    switch (props.$risk) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }};
`;

const CaptiveSection = styled.div`
  padding: 20px;
  background: #f3e8ff;
  border-radius: 6px;
  border: 1px solid #e9d5ff;
  margin-bottom: 24px;
`;

const CaptiveNote = styled.div`
  font-size: 14px;
  color: #7c3aed;
  line-height: 1.5;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-style: italic;
`;

const AttributeSection = styled.div`
  margin-bottom: 32px;
`;

const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const IngredientCompositionModal: React.FC<IngredientCompositionModalProps> = ({
  ingredient,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "composition" | "attributes" | "compliance"
  >("overview");

  // Helper functions to avoid nested ternaries
  const getComplianceIcon = (status: string) => {
    if (status === "approved") return "success";
    if (status === "banned") return "close";
    return "warning";
  };

  const getRiskLevel = (status: string) => {
    if (status === "compliant") return "low";
    if (status === "warning") return "medium";
    return "high";
  };

  // Define tab items for the Tabs component
  const tabItems: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "composition", label: "Composition" },
    { id: "attributes", label: "Detailed Attributes" },
    { id: "compliance", label: "Compliance & Safety" },
  ];

  if (!ingredient) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const complianceStatus =
    ingredient.compliance?.regulatoryStatus || "approved";
  const hasComposition =
    ingredient.composition && ingredient.composition.length > 0;

  // Mock additional attributes for demonstration
  const basicInfo = [
    { label: "CAS Number", value: ingredient.casNumber },
    { label: "Category", value: ingredient.category },
    {
      label: "Default Concentration",
      value: `${ingredient.defaultConcentration}%`,
    },
    { label: "Cost per kg", value: `$${ingredient.costPerKg.toFixed(2)}` },
    { label: "Created", value: ingredient.createdAt.toLocaleDateString() },
    { label: "Last Updated", value: ingredient.updatedAt.toLocaleDateString() },
  ];

  const physicalProperties = [
    { label: "Molecular Weight", value: "178.23 g/mol" },
    { label: "Density", value: "1.056 g/cm³" },
    { label: "Boiling Point", value: "232°C" },
    { label: "Melting Point", value: "-15°C" },
    { label: "Flash Point", value: "102°C" },
    { label: "Vapor Pressure", value: "0.09 mmHg at 25°C" },
    { label: "Solubility in Water", value: "1.6 g/L at 20°C" },
    { label: "Refractive Index", value: "1.532" },
    { label: "pH", value: "6.5-7.5" },
    { label: "Viscosity", value: "12.5 cP at 20°C" },
  ];

  const olfactiveProperties = [
    { label: "Intensity", value: ingredient.attributes?.intensity || "N/A" },
    { label: "Family", value: ingredient.attributes?.family || "N/A" },
    { label: "Note", value: ingredient.attributes?.note || "N/A" },
    { label: "Volatility", value: ingredient.attributes?.volatility || "N/A" },
    { label: "Tenacity", value: "Medium-High" },
    { label: "Diffusion", value: "Good" },
    { label: "Radiance", value: "High" },
    { label: "Character", value: "Floral, Sweet" },
    { label: "Impact", value: "8.5/10" },
    { label: "Substantivity", value: "Good" },
  ];

  const regulatoryInfo = [
    { label: "IFRA Restriction", value: "Category 1-11: 0.78%" },
    { label: "EU Regulation", value: "Approved" },
    { label: "FDA Status", value: "GRAS" },
    { label: "REACH Registration", value: "Registered" },
    { label: "CLP Classification", value: "Skin Sens. 1" },
    { label: "UN Number", value: "UN1993" },
    { label: "Transport Class", value: "3" },
    { label: "Packaging Group", value: "III" },
    { label: "ADR/RID", value: "Yes" },
    { label: "IMDG", value: "Yes" },
  ];

  const sustainabilityInfo = [
    { label: "Carbon Footprint", value: "2.1 kg CO₂/kg" },
    { label: "Water Footprint", value: "15.2 L/kg" },
    { label: "Biodegradability", value: "Readily biodegradable" },
    { label: "Bioaccumulation", value: "Low potential" },
    { label: "Renewable Content", value: "65%" },
    { label: "Cradle-to-Gate LCA", value: "Available" },
    { label: "Certification", value: "ISO 14001" },
    { label: "Supplier Rating", value: "EcoVadis Gold" },
    { label: "Origin", value: "Europe" },
    { label: "Transport Distance", value: "450 km" },
  ];

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <TitleRow>
              <IngredientName>{ingredient.name}</IngredientName>
              {ingredient.isCaptive && <CaptiveBadge>Captive</CaptiveBadge>}
            </TitleRow>
            <IngredientMeta>
              <span>CAS: {ingredient.casNumber}</span>
              <span>•</span>
              <span>{ingredient.category}</span>
              <span>•</span>
              <span>{ingredient.defaultConcentration}%</span>
              {ingredient.compliance && (
                <>
                  <span>•</span>
                  <ComplianceIndicator $status={complianceStatus}>
                    <Icon
                      name={getComplianceIcon(complianceStatus)}
                      size="xs"
                    />
                    {complianceStatus.replace("-", " ").toUpperCase()}
                  </ComplianceIndicator>
                </>
              )}
            </IngredientMeta>
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <Icon name="close" size="lg" />
          </CloseButton>
        </ModalHeader>

        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={(tabId) =>
            setActiveTab(
              tabId as "overview" | "composition" | "attributes" | "compliance"
            )
          }
        />

        <ModalBody>
          <TabContent>
            {activeTab === "overview" && (
              <AttributeGrid>
                <AttributeSection>
                  <SectionTitle>
                    <Icon name="info" size="sm" />
                    Basic Information
                  </SectionTitle>
                  <DataTable>
                    {basicInfo.map((item) => (
                      <DataRow key={item.label}>
                        <DataCell>{item.label}</DataCell>
                        <DataCell>{item.value}</DataCell>
                      </DataRow>
                    ))}
                  </DataTable>
                </AttributeSection>

                <AttributeSection>
                  <SectionTitle>
                    <Icon name="attributes" size="sm" />
                    Olfactive Properties
                  </SectionTitle>
                  <DataTable>
                    {olfactiveProperties.map((item) => (
                      <DataRow key={item.label}>
                        <DataCell>{item.label}</DataCell>
                        <DataCell>{item.value}</DataCell>
                      </DataRow>
                    ))}
                  </DataTable>
                </AttributeSection>
              </AttributeGrid>
            )}

            {activeTab === "composition" && (
              <>
                {ingredient.isCaptive ? (
                  <CaptiveSection>
                    <SectionTitle>
                      <Icon name="settings" size="sm" />
                      Captive Ingredient Information
                    </SectionTitle>
                    <CaptiveNote>
                      {ingredient.captiveNotes ||
                        "This is a proprietary captive molecule. Composition details are confidential and subject to internal controls for regulatory compliance and safety assessment."}
                    </CaptiveNote>
                  </CaptiveSection>
                ) : hasComposition ? (
                  <>
                    <SectionTitle>
                      <Icon name="attributes" size="sm" />
                      Composition Breakdown
                    </SectionTitle>
                    <CompositionTable>
                      <CompositionHeader>
                        <div>Component Name</div>
                        <div>Type</div>
                        <div>Concentration</div>
                        <div>Allergen Risk</div>
                      </CompositionHeader>
                      {ingredient.composition?.map((component) => (
                        <CompositionRow
                          key={component.id}
                          $type={component.type}
                        >
                          <ComponentName $type={component.type}>
                            {component.name}
                          </ComponentName>
                          <ComponentType $type={component.type}>
                            {component.type}
                          </ComponentType>
                          <div>{component.concentration.toFixed(1)}%</div>
                          <AllergenCell $risk={component.allergenRisk || "low"}>
                            {component.allergenRisk || "Low"}
                          </AllergenCell>
                        </CompositionRow>
                      ))}
                    </CompositionTable>
                  </>
                ) : (
                  <EmptyState>
                    <Icon
                      name="info"
                      size="lg"
                      style={{ marginBottom: "12px", opacity: 0.5 }}
                    />
                    <div>
                      No composition data available for this ingredient.
                    </div>
                  </EmptyState>
                )}
              </>
            )}

            {activeTab === "attributes" && (
              <AttributeGrid>
                <AttributeSection>
                  <SectionTitle>
                    <Icon name="calculator" size="sm" />
                    Physical Properties
                  </SectionTitle>
                  <DataTable>
                    {physicalProperties.map((item) => (
                      <DataRow key={item.label}>
                        <DataCell>{item.label}</DataCell>
                        <DataCell>{item.value}</DataCell>
                      </DataRow>
                    ))}
                  </DataTable>
                </AttributeSection>

                <AttributeSection>
                  <SectionTitle>
                    <Icon name="ingredient" size="sm" />
                    Sustainability
                  </SectionTitle>
                  <DataTable>
                    {sustainabilityInfo.map((item) => (
                      <DataRow key={item.label}>
                        <DataCell>{item.label}</DataCell>
                        <DataCell>{item.value}</DataCell>
                      </DataRow>
                    ))}
                  </DataTable>
                </AttributeSection>
              </AttributeGrid>
            )}

            {activeTab === "compliance" && (
              <AttributeSection>
                <SectionTitle>
                  <Icon name="warning" size="sm" />
                  Regulatory & Safety Information
                </SectionTitle>
                <DataTable>
                  {regulatoryInfo.map((item) => (
                    <DataRow key={item.label}>
                      <DataCell>{item.label}</DataCell>
                      <DataCell>{item.value}</DataCell>
                    </DataRow>
                  ))}
                </DataTable>

                {ingredient.compliance?.allergenImpact && (
                  <>
                    <SectionTitle style={{ marginTop: "32px" }}>
                      <Icon name="warning" size="sm" />
                      Allergen Impact Analysis
                    </SectionTitle>
                    <CompositionTable>
                      <CompositionHeader
                        style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                      >
                        <div>Component</div>
                        <div>Allergen Type</div>
                        <div>Concentration</div>
                        <div>Status</div>
                      </CompositionHeader>
                      {ingredient.compliance.allergenImpact.map((impact) => (
                        <CompositionRow
                          key={`${impact.component}-${impact.allergenType}`}
                          $type="Pure"
                        >
                          <div>{impact.component}</div>
                          <div>{impact.allergenType}</div>
                          <div>{impact.concentration.toFixed(2)}%</div>
                          <AllergenCell $risk={getRiskLevel(impact.status)}>
                            {impact.status}
                          </AllergenCell>
                        </CompositionRow>
                      ))}
                    </CompositionTable>
                  </>
                )}
              </AttributeSection>
            )}
          </TabContent>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default IngredientCompositionModal;
