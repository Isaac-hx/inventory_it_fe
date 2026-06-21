"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AssignmentRequest } from "@/types/asset_assignment";
import { createAssignment } from "@/api/asset_assignment"; // ✅ Sesuaikan path API milikmu
import { getAllUsers } from "@/api/user.api";
import { getAllAssets, getAllAssetsWithQueryParams } from "@/api/asset.api"; // ✅ Digunakan untuk menarik daftar hardware gadget
import { FormatDate } from "@/components/shared/format-date";

export default function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch Data Users (Roster Karyawan Pemegang Aset)
  const { data: usersData, isPending: isUsersPending } = useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    enabled: open, // Hanya berjalan saat modal terbuka
  });

  // 2. Fetch Data Assets (Hanya tampilkan stok barang yang siap/available)
  const { data: assetsData, isPending: isAssetsPending } = useQuery({
    queryKey: ["assets", "available-dropdown"],
    queryFn: ()=>getAllAssetsWithQueryParams({status:"available"}), // 💡 Idealnya dikasih query param status=available di dalam fungsi API-mu
    enabled: open,
  });

  console.log(assetsData)

  // 3. Inisialisasi React Hook Form sesuai tipe AssignmentRequest
  // 3. Inisialisasi React Hook Form sesuai tipe AssignmentRequest
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentRequest>({
    defaultValues: {
      asset_id: "",
      user_id: "",
      status: "assigned", // Default awal penugasan baru pastinya langsung aktif ('assigned')
      notes: "",
      assigned_date: new Date().toISOString().split("T")[0], // Set default hari ini
    },
  });

  // 4. Mutation untuk Post Data ke Backend Go
  const mutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      toast.success("Asset assignment has been deployed successfully!");
      // Invalidation serentak agar list table asset & assignment utama ter-refresh otomatis
      queryClient.invalidateQueries({ queryKey: ["asset-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["asset-assingments"] });
      
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to assign asset: ${errorMessage}`);
    },
  });

  const onSubmit = (values: AssignmentRequest) => {
    values.assigned_date = FormatDate(values.assigned_date)
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Assign / Deploy Asset</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deploy New Asset Assignment</DialogTitle>
          <DialogDescription>
            Handover a warehouse hardware asset to an official company employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3">
            
            {/* 🖥️ Dropdown Pilihan Hardware Asset */}
            <div className="space-y-1">
              <Label>Target Asset Hardware</Label>
              <Controller
                name="asset_id"
                control={control}
                rules={{ required: "Target hardware asset is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending || isAssetsPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Available Device" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAssetsPending ? (
                        <div className="p-2 text-xs text-muted-foreground animate-pulse text-center">
                          Loading warehouse stocks...
                        </div>
                      ) : (
                        <SelectGroup>
                          <SelectLabel>Available Assets</SelectLabel>
                          {assetsData?.data
                            // Melakukan filter mandiri di client side jika backend-mu belum support filter query status available
                            ?.filter((asset: any) => String(asset.status || asset.Status).toLowerCase() === "available")
                            ?.map((asset: any) => (
                              <SelectItem
                                key={asset.id || asset.AssetId}
                                value={String(asset.id || asset.AssetId)}
                              >
                                {asset.name || asset.AssetName} — SN: {asset.serial_number || asset.SerialNumber}
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

            {/* 👤 Dropdown Pilihan User Custodian (Karyawan) */}
            <div className="space-y-1">
              <Label>Assigned Custodian (Employee)</Label>
              <Controller
                name="user_id"
                control={control}
                rules={{ required: "Recipient employee is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending || isUsersPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Corporate Recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {isUsersPending ? (
                        <div className="p-2 text-xs text-muted-foreground animate-pulse text-center">
                          Loading active employees...
                        </div>
                      ) : (
                        <SelectGroup>
                          <SelectLabel>Employees</SelectLabel>
                          {usersData?.data?.map((user: any) => (
                            <SelectItem
                              key={user.id || user.UserId}
                              value={String(user.id || user.UserId)}
                            >
                              {user.username || user.Username} ({user.email || user.Email || "No Email"})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.user_id && (
                <p className="text-xs font-medium text-red-500">{errors.user_id.message}</p>
              )}
            </div>

            {/* Grid 2 Kolom untuk Assigned Date & Status */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Handover Date */}
              <div className="space-y-1">
                <Label htmlFor="assigned_date">Handover Date</Label>
                <Input
                  id="assigned_date"
                  type="date"
                  disabled={mutation.isPending}
                  {...register("assigned_date", {
                    required: "Handover assigned date is required",
                  })}
                />
                {errors.assigned_date && (
                  <p className="text-xs font-medium text-red-500">{errors.assigned_date.message}</p>
                )}
              </div>

              {/* Deployment Status */}
              <div className="space-y-1">
                <Label>Initial Deployment Status</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Deployment status is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status Options</SelectLabel>
                          <SelectItem value="assigned">Assigned (Aktif Terpakai)</SelectItem>
                          <SelectItem value="damaged">Damaged (Rusak Awal)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-xs font-medium text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Handover Notes (Textarea) */}
            <div className="space-y-1">
              <Label htmlFor="notes">Handover Notes & Terms</Label>
              <Textarea
                id="notes"
                placeholder="Example: Includes charger box, physical body has scratch, or custom specs logging..."
                rows={3}
                disabled={mutation.isPending}
                {...register("notes")}
              />
            </div>

          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Executing Deployment..." : "Deploy Handover"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}