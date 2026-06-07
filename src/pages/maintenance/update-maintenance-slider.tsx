import { useEffect } from "react";
import { getAllAssets } from "@/api/asset.api"; 
import { getMaintenanceById, updateMaintenanceById } from "@/api/maintenance.api"; // Pastikan API updateMaintenance sudah sesuai
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import type { MaintenanceRequest } from "@/types/maintenance";

type UpdateMaintenanceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string;
};

export default function UpdateMaintenanceSheet({
  open,
  onOpenChange,
  maintenanceId,
}: UpdateMaintenanceSheetProps) {
  const queryClient = useQueryClient();

  // 1. Inisialisasi react-hook-form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MaintenanceRequest>({
    defaultValues: {
      asset_id: "",
      cost: 0,
      description: "",
      maintenance_at: "",
      status: "pending",
    },
  });

  // 2. Fetch Detail Data Maintenance berdasarkan maintenanceId
  const { 
    data: maintenanceData, 
    isLoading: isMaintenanceLoading, 
    isError: isMaintenanceError 
  } = useQuery({
    queryKey: ["maintenance-detail", maintenanceId],
    queryFn: () => getMaintenanceById(maintenanceId),
    enabled: open && !!maintenanceId,
  });

  // 3. Fetch Opsi List Assets untuk dropdown select
  const { data: assetsData, isPending: isAssetsPending } = useQuery({
    queryKey: ["assets", "all"],
    queryFn: getAllAssets,
    enabled: open,
  });

  const rawMaintenanceData = maintenanceData?.data;
  const maintenance = Array.isArray(rawMaintenanceData) ? rawMaintenanceData[0] : rawMaintenanceData;

  // Helper format tanggal agar aman masuk ke tag <input type="date">
  const formatInputDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // 4. Sinkronisasi data dari backend ke form fields
  useEffect(() => {
    if (!open || !maintenance) return;

    reset({
      asset_id: String(maintenance.asset_id || maintenance.AssetId || ""),
      cost: Number(maintenance.cost || maintenance.Cost || 0),
      description: maintenance.description || maintenance.Description || "",
      maintenance_at: formatInputDate(maintenance.maintenance_at || maintenance.MaintenanceAt),
      status: maintenance.status || maintenance.Status || "pending",
    });
  }, [open, maintenance, reset]);

  // 5. Mutation untuk hit API Update Maintenance (Usecase gabungan backend)
  const mutation = useMutation({
    mutationFn: (values: MaintenanceRequest) => 
      updateMaintenanceById(maintenanceId, {
        ...values,
        cost: Number(values.cost) // pastikan bertipe number sebelum dikirim
      }),
    onSuccess: () => {
      toast.success("Maintenance log has been updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenances"] }); 
      queryClient.invalidateQueries({ queryKey: ["maintenance-detail", maintenanceId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update maintenance: ${errorMessage}`);
    },
  });

  const onSubmit = (values: MaintenanceRequest) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="flex flex-col max-h-screen"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit Maintenance Info</SheetTitle>
          <SheetDescription>
            Modify cost, descriptions, schedule, or current progress state for this maintenance log.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-2 my-4 space-y-4">
          {isMaintenanceLoading && (
            <p className="text-sm text-muted-foreground text-center py-4 animate-pulse">
              Loading maintenance data...
            </p>
          )}

          {isMaintenanceError && (
            <p className="text-sm text-red-500 text-center py-4">
              Failed to load maintenance detail.
            </p>
          )}

          {!isMaintenanceLoading && maintenance && (
            <form id="update-maintenance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Asset Selection Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">
                  Linked Hardware Asset
                </Label>
                <Controller
                  name="asset_id"
                  control={control}
                  rules={{ required: "Asset is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending || isAssetsPending}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select hardware asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {isAssetsPending ? (
                          <div className="p-2 text-xs text-muted-foreground text-center animate-pulse">
                            Loading assets list...
                          </div>
                        ) : (
                          <SelectGroup>
                            <SelectLabel>Assets</SelectLabel>
                            {assetsData?.data?.map((asset: any) => (
                              <SelectItem
                                key={asset.asset_id || asset.AssetId}
                                value={String(asset.asset_id || asset.AssetId)}
                              >
                                {asset.asset_name || asset.AssetName} ({asset.serial_number || asset.SerialNumber})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.asset_id && (
                  <p className="text-xs font-medium text-red-500">{errors.asset_id.message}</p>
                )}
              </div>

              {/* Grid 2 Kolom untuk Cost & Date */}
              <div className="grid grid-cols-2 gap-2">
                
                {/* Cost Card */}
                <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                  <Label htmlFor="cost" className="text-xs font-medium uppercase text-muted-foreground">
                    Cost (IDR)
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    className="bg-white"
                    disabled={mutation.isPending}
                    {...register("cost", { 
                      required: "Cost is required",
                      min: { value: 0, message: "Cost cannot be negative" }
                    })}
                  />
                  {errors.cost && (
                    <p className="text-xs font-medium text-red-500">{errors.cost.message}</p>
                  )}
                </div>

                {/* Schedule Date Card */}
                <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                  <Label htmlFor="maintenance_at" className="text-xs font-medium uppercase text-muted-foreground">
                    Schedule Date
                  </Label>
                  <Input
                    id="maintenance_at"
                    type="date"
                    className="bg-white"
                    disabled={mutation.isPending}
                    {...register("maintenance_at", { required: "Date is required" })}
                  />
                  {errors.maintenance_at && (
                    <p className="text-xs font-medium text-red-500">{errors.maintenance_at.message}</p>
                  )}
                </div>
              </div>

              {/* Maintenance Status Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">
                  Progress Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status Options</SelectLabel>
                          <SelectItem value="pending">Pending (Scheduled)</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-xs font-medium text-red-500">{errors.status.message}</p>
                )}
              </div>

              {/* Description Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label htmlFor="description" className="text-xs font-medium uppercase text-muted-foreground">
                  Issue / Repair Logs
                </Label>
                <Textarea
                  id="description"
                  className="bg-white resize-none"
                  rows={4}
                  disabled={mutation.isPending}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
                )}
              </div>

            </form>
          )}

          {!isMaintenanceLoading && !maintenance && !isMaintenanceError && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No maintenance data available.
            </p>
          )}
        </div>

        {/* STICKY FOOTER ACTION BUTTONS */}
        {!isMaintenanceLoading && maintenance && (
          <SheetFooter className="pt-2 border-t flex flex-row justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" form="update-maintenance-form" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}