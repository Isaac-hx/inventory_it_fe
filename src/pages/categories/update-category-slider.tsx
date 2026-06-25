import { useEffect } from "react";
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
import { getCategoryById, updateCategoryById } from "@/api/category.api";


type DetailCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
};

// State form di frontend tetap camelCase biar rapi
type FormValues = {
  categoryName: string;
};

export default function UpdateCategoryDialog({
  open,
  onOpenChange,
  categoryId,
}: DetailCategoryDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      categoryName:  "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["category-detail", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: open && !!categoryId,
  });

  const rawCategoryData = data?.data;
  const category = Array.isArray(rawCategoryData) ? rawCategoryData[0] : rawCategoryData;

  useEffect(() => {
    if (category?.CategoryName) {
      reset({
        categoryName: category.CategoryName,
      });
    }
  }, [category, reset]);


  // =============== PERUBAHAN DI SINI ===============
  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      // Ubah payload menjadi 'brand_name' sesuai kebutuhan JSON API backend
      updateCategoryById(categoryId, { category_name: values.categoryName }),
    onSuccess: () => {
      toast.success("Category has been created sucessfully")
  
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-detail", categoryId] });
      onOpenChange(false);
    },
    onError: (error) => {
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to update Category:${errorMessage}`)    },
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
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Change the selected Category name here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading Category detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load Category detail.
            </p>
          )}

          {category && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Category ID
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {category.CategoryId}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-muted-foreground">
                  Category Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter category name"
                  disabled={mutation.isPending}
                  {...register("categoryName", {
                    required: "Category name tidak boleh kosong",
                    minLength: {
                      value: 3,
                      message: "Minimal harus 3 karakter",
                    },
                  })}
                />
                {errors.categoryName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.categoryName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {category.CreatedAt}  
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {category.UpdatedAt}
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