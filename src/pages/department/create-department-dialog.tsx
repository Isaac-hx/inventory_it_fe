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
import { createDepartment } from "@/api/department.api";

type CreateDepartmentForm = {
  department_name: string;
};

export default function CreateDepartmentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDepartmentForm>({
    defaultValues: {
      department_name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
      toast.success("Department has been created sucessfully")
      reset();
      setOpen(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create brand:${errorMessage}`)
    }
  });

  const onSubmit = (values: CreateDepartmentForm) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Create Department</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create department</DialogTitle>
          <DialogDescription>
            Add new user department data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="department_name">Department Name</Label>
            <Input
              id="department_name"
              placeholder="Example: IT"
              {...register("department_name", {
                required: "Department Name is required",
              })}
            />

            {errors.department_name && (
              <p className="text-sm text-red-500">
                {errors.department_name.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Failed to create department.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting || mutation.isPending ? "Saving..." : "Save Department"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}