import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { createCategory } from "@/api/category.api";

type CreateCategoryForm = {
  category_name: string;
};

export default function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryForm>({
    defaultValues: {
      category_name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category has been created sucessfully")
      reset();
      setOpen(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create category:${errorMessage}`)
    }
  });

  const onSubmit = (values: CreateCategoryForm) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Create Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Categories</DialogTitle>
          <DialogDescription>
            Add new asset category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              placeholder="Example: Laptop"
              {...register("category_name", {
                required: "Category name is required",
              })}
            />

            {errors.category_name && (
              <p className="text-sm text-red-500">
                {errors.category_name.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Failed to create Category.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting || mutation.isPending ? "Saving..." : "Save Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}