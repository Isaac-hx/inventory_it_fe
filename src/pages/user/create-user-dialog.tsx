import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerApi } from "@/api/auth.api";
import { getAllDepartments } from "@/api/department.api";

type CreateUserForm = {
  username: string;
  email: string;
  password: string;
  role: "user" | "superuser" | "admin_it";
  department_id: string;
};

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Data Department
  const { data, isPending } = useQuery({
    queryKey: ["departments", "all"],
    queryFn: getAllDepartments,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "user",
      department_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User has been created successfully");
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Something went wrong.";
      toast.error(`Failed to create user: ${errorMessage}`);
    },
  });

  const onSubmit = (values: CreateUserForm) => {
    console.log(values)
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Create User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>Add new user data.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3">
            
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Example: cherryblossom2x"
                disabled={mutation.isPending}
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                disabled={mutation.isPending}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format!",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                disabled={mutation.isPending}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters!",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Department Select Field */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "Department is required!" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending || isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {isPending ? (
                        <div className="flex h-24 items-center justify-center p-2 text-sm text-muted-foreground animate-pulse">
                          Loading departments...
                        </div>
                      ) : (
                        <SelectGroup>
                          <SelectLabel>Departments</SelectLabel>
                          {data?.data?.map((department: any) => (
                            <SelectItem
                              key={department.id || department.DepartmentId}
                              value={String(department.DepartmentId)}
                            >
                              {department.name || department.DepartmentName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department_id && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.department_id.message}
                </p>
              )}
            </div>

            {/* Role Select Field */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required!" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin_it">Admin IT</SelectItem>
                        <SelectItem value="superuser">Superuser</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Saving..." : "Save User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}