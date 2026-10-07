"use client";

import { useState } from "react";
import { deleteVehicle } from "@/app/admin/vehicles/actions";

type DeleteVehicleButtonProps = {
  vehicleId: string;
};

export default function DeleteVehicleButton({
  vehicleId,
}: DeleteVehicleButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6B7280]">Delete?</span>

        <form action={deleteVehicle}>
          <input type="hidden" name="id" value={vehicleId} />

          <button
            type="submit"
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Yes
          </button>
        </form>

        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm font-semibold text-red-600 hover:text-red-700"
    >
      Delete
    </button>
  );
}