"use client";

import { useEffect, useState } from "react";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Modal from "../../ui/Modal";

import { Beneficiary } from "../types";

interface BeneficiaryModalProps {
  open: boolean;
  beneficiary?: Beneficiary | null;
  onClose: () => void;
  onSave: (beneficiary: Beneficiary) => void;
}

const relationshipOptions = [
  { label: "Cônjuge", value: "Cônjuge" },
  { label: "Filho(a)", value: "Filho(a)" },
  { label: "Pai", value: "Pai" },
  { label: "Mãe", value: "Mãe" },
  { label: "Irmão(ã)", value: "Irmão(ã)" },
  { label: "Outro", value: "Outro" },
];

export default function BeneficiaryModal({
  open,
  beneficiary,
  onClose,
  onSave,
}: BeneficiaryModalProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [percentage, setPercentage] = useState("");

  useEffect(() => {
    if (beneficiary) {
      setName(beneficiary.name);
      setRelationship(beneficiary.relationship);
      setPercentage(beneficiary.percentage);
    } else {
      setName("");
      setRelationship("");
      setPercentage("");
    }
  }, [beneficiary, open]);

  function handleSave() {
    if (
      !name.trim() ||
      !relationship ||
      !percentage.trim()
    ) {
      return;
    }

    const value = Number(percentage);

    if (value <= 0 || value > 100) {
      return;
    }

    onSave({
      id:
        beneficiary?.id ??
        crypto.randomUUID(),
      name,
      relationship,
      percentage,
    });

    onClose();
  }

  return (
    <Modal
      open={open}
      title="Beneficiário"
      onClose={onClose}
    >
      <div className="space-y-5">
        <Input
          label="Nome completo"
          required
          value={name}
          onChange={setName}
        />

        <Select
          label="Parentesco"
          value={relationship}
          options={relationshipOptions}
          onChange={setRelationship}
        />

        <Input
          label="Percentual (%)"
          value={percentage}
          placeholder="Ex.: 50"
          required
          onChange={(value) =>
            setPercentage(
              value.replace(/\D/g, "")
            )
          }
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}