import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { getAllAssets } from "@/api/asset.api";        
import { createMaintenance } from "@/api/maintenance.api";
import type { MaintenanceRequest } from "@/types/maintenance";

export default function CreateMaintenanceSheet() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch data assets untuk pilihan dropdown pencatatan maintenance
  const { data: assetsData, isPending: isAssetPending } = useQuery({
    queryKey: ["assets", "all"],
    queryFn: getAllAssets,
    enabled: open,
  });

  // 2. Inisialisasi React Hook Form sesuai tipe MaintenanceRequest
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

  // 3. Mutation untuk Create Maintenance Record
  const mutation = useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenances"],
      });
      toast.success("Maintenance log has been created successfully");
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to create maintenance: ${errorMessage}`);
    },
  });

  const onSubmit = (values: MaintenanceRequest) => {
    // Memastikan nilai cost dikirim sebagai tipe data Number, bukan String dari input
    const payload = {
      ...values,
      cost: Number(values.cost),
    };
    mutation.mutate(payload);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Menggunakan button trigger global */}
      <Button onClick={() => setOpen(true)}>Create Maintenance</Button>

      <SheetContent 
        className="flex flex-col max-h-screen"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Create Maintenance</SheetTitle>
          <SheetDescription>
            Record new repair, servicing, or hardware checking for IT assets.
          </SheetDescription>
        </SheetHeader>

        {/* AREA FORM SCROLLABLE DENGAN CARD STYLE */}
        <div className="flex-1 overflow-y-auto p-2 my-4 space-y-4">
          <form id="create-maintenance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Asset Selection Card */}
            <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">
                Select Asset
              </Label>
              <Controller
                name="asset_id"
                control={control}
                rules={{ required: "Asset must be selected" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending || isAssetPending}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose hardware asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isAssetPending ? (
                        <div className="p-2 text-xs text-muted-foreground text-center animate-pulse">
                          Loading assets list...
                        </div>
                      ) : (
                        <SelectGroup>
                          <SelectLabel>Available Assets</SelectLabel>
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

            {/* Grid 2 Kolom untuk Cost & Maintenance Date */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Maintenance Cost Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label htmlFor="cost" className="text-xs font-medium uppercase text-muted-foreground">
                  Est. Cost (IDR)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  className="bg-white"
                  placeholder="0"
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

              {/* Maintenance Date Card */}
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
                Maintenance Status
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
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                Issue Description
              </Label>
              <Textarea
                id="description"
                className="bg-white resize-none"
                rows={4}
                placeholder="Describe the issue or reason for maintenance (e.g. LCD flickering, RAM upgrade)..."
                disabled={mutation.isPending}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
              )}
            </div>

          </form>
        </div>

        {/* STICKY FOOTER */}
        <SheetFooter className="pt-2 border-t flex flex-row justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setOpen(false);
            }}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-maintenance-form" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Save Log"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}