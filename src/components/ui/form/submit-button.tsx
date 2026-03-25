import type { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  loading?: boolean;
  loadingLabel?: string;
}

export function SubmitButton({
  loading = false,
  loadingLabel = "Salvando...",
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading ? loadingLabel : children}
    </Button>
  );
}
