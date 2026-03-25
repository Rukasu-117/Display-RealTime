"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ConfirmActionButtonProps
  extends Omit<ButtonProps, "onClick" | "variant"> {
  confirmMessage: string;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmActionButton({
  confirmMessage,
  onConfirm,
  children,
  disabled,
  ...props
}: ConfirmActionButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setLoading(true);

    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="danger"
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? "Processando..." : children}
    </Button>
  );
}
