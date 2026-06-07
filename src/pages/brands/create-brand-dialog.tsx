import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { createBrand } from "@/api/brand.api";

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

type CreateBrandForm = {
  brand_name: string;
};

export default function CreateBrandDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBrandForm>({
    defaultValues: {
      brand_name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
      toast.success("Brand has been created sucessfully")
      reset();
      setOpen(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create brand:${errorMessage}`)
    }
  });

  const onSubmit = (values: CreateBrandForm) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Create Brand</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Brand</DialogTitle>
          <DialogDescription>
            Add new asset brand data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input
              id="brand_name"
              placeholder="Example: Dell"
              {...register("brand_name", {
                required: "Brand name is required",
              })}
            />

            {errors.brand_name && (
              <p className="text-sm text-red-500">
                {errors.brand_name.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Failed to create brand.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting || mutation.isPending ? "Saving..." : "Save Brand"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}