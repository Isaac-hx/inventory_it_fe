
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { getAssignmentById, updateAssignmentById } from "@/api/asset_assignment"; // Pastikan path API benar
import { getAllUsers } from "@/api/user.api";

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
import { Textarea } from "@/components/ui/textarea"; // Menggunakan Textarea agar catatan lebih rapi
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

type UpdateAssignmentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
};

export default function UpdateAssignmentSheet({
  open,
  onOpenChange,
  assignmentId,
}: UpdateAssignmentSheetProps) {
  const queryClient = useQueryClient();

  // 1. Inisialisasi React Hook Form sesuai tipe data AssignmentRequest
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssignmentRequest>({
    defaultValues: {
      asset_id: "",
      user_id: "",
      status: "assigned",
      notes: "",
      return_date: "",
    },
  });

  // 2. Query mengambil data detail penugasan (Assignment) berdasarkan ID
  const { 
    data: assignmentData, 
    isLoading: isAssignmentLoading, 
    isError: isAssignmentError 
  } = useQuery({
    queryKey: ["assignment-detail", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    enabled: open && !!assignmentId,
  });

  // 3. Query mengambil daftar karyawan/user untuk pilihan pemegang aset
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    enabled: open,
  });

  // Ekstraksi data assignment dari wrapper standard API
  const assignmentRawData = assignmentData?.data;
  const assignment = Array.isArray(assignmentRawData) ? assignmentRawData[0] : assignmentRawData;

  // Helper pemformat tanggal agar klop dengan komponen <input type="date" />
  const formatInputDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // 4. Sinkronisasi data dari API ke dalam Form State saat Sheet terbuka
  useEffect(() => {
    if (!open || !assignment) return;

    reset({
      asset_id: assignment.asset_id || assignment.AssetId || "",
      user_id: String(assignment.user_id || assignment.UserId || ""),
      status: assignment.status || assignment.Status || "assigned",
      notes: assignment.notes || assignment.Notes || "",
      // Menggunakan penanganan pointer *time.Time dari sisi Go yang berubah jadi string di JSON
      return_date: formatInputDate(assignment.return_date || assignment.ReturnDate),
    });
  }, [open, assignment, reset]);

  // 5. Mutation untuk mengirimkan perubahan data penugasan ke Backend
  const mutation = useMutation({
    mutationFn: (values: AssignmentRequest) => updateAssignmentById(assignmentId, values),
    onSuccess: () => {
      toast.success("Asset assignment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["asset-assignments"] }); // Refresh list utama
      queryClient.invalidateQueries({ queryKey: ["assignment-detail", assignmentId] }); // Refresh data detail
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update assignment: ${errorMessage}`);
    },
  });

  const onSubmit = (values: AssignmentRequest) => {
    // Jika return_date bernilai string kosong, ubah jadi null agar Go Pointer (*time.Time) tidak error membaca string hampa
    const payload = {
      ...values,
      return_date: values.return_date === "" ? null : values.return_date,
    };
    console.log(values)
    mutation.mutate(payload as any);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="sm:max-w-md flex flex-col h-full p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle>Update Asset Assignment</SheetTitle>
          <SheetDescription>
            Modify tracking state, reassign custodian, or log return schedules for this asset.
          </SheetDescription>
        </SheetHeader>

        {/* State Loading */}
        {isAssignmentLoading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading assignment records...
            </p>
          </div>
        )}

        {/* State Error */}
        {isAssignmentError && (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p className="text-sm text-red-500 font-medium">
              Failed to load asset assignment history.
            </p>
          </div>
        )}

        {/* Konten Form Utama */}
        {!isAssignmentLoading && assignment && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            
            {/* Area Isi Form (Bisa Scroll Kebawah) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Tampilan Nama Asset (Read Only / Informasi Saja) */}
              <div className="bg-muted/50 p-3 rounded-lg border space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Target Hardware Asset
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {assignment.asset_name || assignment.AssetName || "Unknown Hardware Aset"}
                </p>
              </div>

              {/* Select User Pemegang / Custodian */}
              <div className="space-y-1">
                <Label>Assigned Custodian (User)</Label>
                <Controller
                  name="user_id"
                  control={control}
                  rules={{ required: "User pemegang aset wajib ditentukan" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending || isUsersLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Holder Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {isUsersLoading ? (
                          <div className="p-2 text-xs text-muted-foreground text-center animate-pulse">
                            Loading company roster...
                          </div>
                        ) : (
                          <SelectGroup>
                            <SelectLabel>Employees</SelectLabel>
                            {usersData?.data?.map((user: any) => (
                              <SelectItem
                                key={user.id || user.UserId}
                                value={String(user.id || user.UserId)}
                              >
                                {user.username || user.Username}
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

              {/* Grid Status & Return Date */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Assignment Status Select */}
                <div className="space-y-1">
                  <Label>Assignment Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status transaksi wajib dipilih" }}
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
                            <SelectItem value="assigned">Assigned (Aktif)</SelectItem>
                            <SelectItem value="damaged">Damaged (Rusak)</SelectItem>
                            <SelectItem value="returned">Returned (Dikembalikan)</SelectItem>
                            <SelectItem value="lost">Lost (Hilang)</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-xs font-medium text-red-500">{errors.status.message}</p>
                  )}
                </div>

                {/* Return Date Input (Koneksi ke logic Pointer Go di problem sebelumnya) */}
                <div className="space-y-1">
                  <Label htmlFor="return_date">Return Date</Label>
                  <Input
                    id="return_date"
                    type="date"
                    disabled={mutation.isPending}
                    {...register("return_date")}
                  />
                </div>
              </div>

              {/* Notes / Catatan Tambahan (Menggunakan Textarea) */}
              <div className="space-y-1">
                <Label htmlFor="notes">Notes / Operational Logs</Label>
                <Textarea
                  id="notes"
                  placeholder="Provide details about condition changes, repair needs, or handover descriptions..."
                  rows={4}
                  disabled={mutation.isPending}
                  {...register("notes")}
                />
              </div>

            </div>

            {/* Sticky Action Footer */}
            <SheetFooter className="p-6 border-t flex flex-row justify-end gap-2 shrink-0 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating Logs..." : "Save Log Changes"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}