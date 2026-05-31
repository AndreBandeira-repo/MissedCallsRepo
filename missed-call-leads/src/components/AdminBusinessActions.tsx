"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminBusinessActions({
  businessId,
  isActive,
}: {
  businessId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/admin/businesses/${businessId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={toggleActive}
    >
      {isActive ? "Disable account" : "Enable account"}
    </Button>
  );
}
