import { useEffect } from "react";
import { getDepartmentById, updateDepartmentById } from "@/api/department.api"; 
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {toast} from "sonner"


type DetailDepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
};

// State form di frontend tetap camelCase biar rapi
type FormValues = {
  departmentName: string;
};

export default function UpdateDepartmentDialog({
  open,
  onOpenChange,
  departmentId,
}: DetailDepartmentDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      departmentName:  "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["department-detail", departmentId],
    queryFn: () => getDepartmentById(departmentId),
    enabled: open && !!departmentId,
  });

  const rawDepartmentData = data?.data;
  const department = Array.isArray(rawDepartmentData) ? rawDepartmentData[0] : rawDepartmentData;

  useEffect(() => {
    if (department?.DepartmentName) {
      reset({
        departmentName: department.DepartmentName,
      });
    }
  }, [department, reset]);


  // =============== PERUBAHAN DI SINI ===============
  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      // Ubah payload menjadi 'department_name' sesuai kebutuhan JSON API backend
      updateDepartmentById(departmentId, { department_name: values.departmentName }),
    onSuccess: () => {
      toast.success("Department has been created sucessfully")
  
      queryClient.invalidateQueries({ queryKey: ["departments"] },);
      queryClient.invalidateQueries({ queryKey: ["department-detail", departmentId] });
      onOpenChange(false);
    },
    onError: (error) => {
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to update department:${errorMessage}`)    },
  });
  // =================================================

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit Deparment</SheetTitle>
          <SheetDescription>
            Change the selected department name here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading deparment detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load deparment detail.
            </p>
          )}

          {department && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  deparment ID
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {departmentId}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground">
                  Department Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter department name"
                  disabled={mutation.isPending}
                  {...register("departmentName", {
                    required: "Department name tidak boleh kosong",
                    minLength: {
                      value: 3,
                      message: "Minimal harus 3 karakter",
                    },
                  })}
                />
                {errors.departmentName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.departmentName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {department.CreatedAt}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {department.UpdatedAt}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}