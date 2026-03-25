import { SelectField } from "@/components/ui/form/select-field";
import { TextField } from "@/components/ui/form/text-field";

interface DisplayFieldsProps {
  name: string;
  rotation: number;
  disabled?: boolean;
  nameHint?: string;
  rotationHint?: string;
  onNameChange: (value: string) => void;
  onRotationChange: (value: number) => void;
}

export function DisplayFields({
  name,
  rotation,
  disabled,
  nameHint,
  rotationHint,
  onNameChange,
  onRotationChange,
}: DisplayFieldsProps) {
  return (
    <div className="space-y-5">
      <TextField
        label="Nome do Display"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        disabled={disabled}
        required
        hint={nameHint}
      />

      <SelectField
        label="Rotação"
        value={rotation}
        onChange={(event) => onRotationChange(Number(event.target.value))}
        disabled={disabled}
        hint={rotationHint}
      >
        <option value={0}>0°</option>
        <option value={90}>90°</option>
        <option value={180}>180°</option>
        <option value={270}>270°</option>
      </SelectField>
    </div>
  );
}
