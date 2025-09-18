import React from "react";
import { Modal, SecondaryButton, DangerButton } from "../../common";

interface ReplaceFormulaModalProps {
  isOpen: boolean;
  formulaName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ReplaceFormulaModal: React.FC<ReplaceFormulaModalProps> = ({
  isOpen,
  formulaName,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Replace Active Formula?"
      size="medium"
      footer={
        <>
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <DangerButton onClick={onConfirm}>Replace Formula</DangerButton>
        </>
      }
    >
      <div style={{ padding: "8px 0" }}>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.5",
          }}
        >
          This will completely replace all ingredients in your active formula
          with those from{" "}
          <strong style={{ color: "#374151" }}>"{formulaName}"</strong>. This
          action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default ReplaceFormulaModal;
