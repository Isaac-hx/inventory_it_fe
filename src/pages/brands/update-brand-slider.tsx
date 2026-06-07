import { useEffect } from "react";
import { getBranById, updateBrandById } from "@/api/brand.api"; 
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


type DetailBrandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
};

// State form di frontend tetap camelCase biar rapi
type FormValues = {
  brandName: string;
};

export default function UpdateBranddialog({
  open,
  onOpenChange,
  brandId,
}: DetailBrandDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      brandName:  "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["brand-detail", brandId],
    queryFn: () => getBranById(brandId),
    enabled: open && !!brandId,
  });

  const rawBrandData = data?.data;
  const brand = Array.isArray(rawBrandData) ? rawBrandData[0] : rawBrandData;

  useEffect(() => {
    if (brand?.BrandName) {
      reset({
        brandName: brand.BrandName,
      });
    }
  }, [brand, reset]);


  // =============== PERUBAHAN DI SINI ===============
  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      // Ubah payload menjadi 'brand_name' sesuai kebutuhan JSON API backend
      updateBrandById(brandId, { brand_name: values.brandName }),
    onSuccess: () => {
      toast.success("Brand has been created sucessfully")
  
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand-detail", brandId] });
      onOpenChange(false);
    },
    onError: (error) => {
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to update brand:${errorMessage}`)    },
  });
  // =================================================

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 

      >
        <SheetHeader>
          <SheetTitle>Edit Brand</SheetTitle>
          <SheetDescription>
            Change the selected brand name here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading brand detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load brand detail.
            </p>
          )}

          {brand && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Brand ID
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {brand.BrandId}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground">
                  Brand Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter brand name"
                  disabled={mutation.isPending}
                  {...register("brandName", {
                    required: "Brand name tidak boleh kosong",
                    minLength: {
                      value: 3,
                      message: "Minimal harus 3 karakter",
                    },
                  })}
                />
                {errors.brandName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.brandName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {new Date(brand.CreatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {new Date(brand.UpdatedAt).toLocaleDateString()}
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