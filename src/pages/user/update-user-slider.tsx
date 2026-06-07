import {  useEffect } from "react";
import { getUserById, updateUserById } from "@/api/user.api"; 
import { getAllDepartments } from "@/api/department.api"; 
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"; // Menggunakan komponen Sheet shadcn
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

type UpdateUserSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

type FormValues = {
  username: string;
  email: string;
  role: "user" | "superuser" | "admin_it";
  department_id: string;
};

export default function UpdateUserSheet({
  open,
  onOpenChange,
  userId,
}: UpdateUserSheetProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      role: "user",
      department_id: "",
    },
  });

  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUserById(userId),
    enabled: open && !!userId,
  });

  const { data: departmentsData, isPending: isDeptPending } = useQuery({
    queryKey: ["departments", "all"],
    queryFn: getAllDepartments,
    enabled: open, 
  });

  const rawUserData = userData?.data;
  const user = Array.isArray(rawUserData) ? rawUserData[0] : rawUserData;

  useEffect(() => {
    if (user) {
      reset({
        username: user.Username || user.username || "",
        email: user.Email || user.email || "",
        role: user.Role || user.role || "user",
        department_id: String(user.DepartmentId || user.department_id || ""),
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateUserById(userId, {
        username: values.username,
        email: values.email,
        role: values.role,
        department_id: values.department_id,
      }),
    onSuccess: () => {
      toast.success("User has been updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] }); 
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      onOpenChange(false);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update user: ${errorMessage}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="flex flex-col max-h-screen"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit User Info</SheetTitle>
          <SheetDescription>
            Update user credentials, roles, or assigned department.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-2 my-4 space-y-4">
          {isUserLoading && (
            <p className="text-sm text-muted-foreground text-center py-4 animate-pulse">
              Loading user data...
            </p>
          )}

          {isUserError && (
            <p className="text-sm text-red-500 text-center py-4">
              Failed to load user detail.
            </p>
          )}

          {!isUserLoading && user && (
            <form id="update-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Username Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label htmlFor="username" className="text-xs font-medium uppercase text-muted-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  className="bg-white"
                  placeholder="Enter username"
                  disabled={mutation.isPending}
                  {...register("username", { required: "Username wajib diisi" })}
                />
                {errors.username && (
                  <p className="text-xs font-medium text-red-500">{errors.username.message}</p>
                )}
              </div>

              {/* Email Card */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-white"
                  placeholder="name@example.com"
                  disabled={mutation.isPending}
                  {...register("email", {
                    required: "Email wajib diisi",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format email tidak valid",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Department Card Select */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">
                  Department
                </Label>
                <Controller
                  name="department_id"
                  control={control}
                  rules={{ required: "Department wajib dipilih" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending || isDeptPending}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {isDeptPending ? (
                          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground animate-pulse">
                            Loading departments...
                          </div>
                        ) : (
                          <SelectGroup>
                            <SelectLabel>Departments</SelectLabel>
                            {departmentsData?.data?.map((dept) => (
                              <SelectItem
                                key={dept.id || dept.DepartmentId}
                                value={String(dept.id || dept.DepartmentId)}
                              >
                                {dept.name || dept.DepartmentName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department_id && (
                  <p className="text-xs font-medium text-red-500">{errors.department_id.message}</p>
                )}
              </div>

              {/* Role Card Select */}
              <div className="rounded-lg border bg-slate-50 p-4 space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">
                  Role Account
                </Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role wajib dipilih" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger className="w-full bg-white">
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
                  <p className="text-xs font-medium text-red-500">{errors.role.message}</p>
                )}
              </div>

            </form>
          )}

          {!isUserLoading && !user && !isUserError && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No user data available.
            </p>
          )}
        </div>

        {/* Footer terkunci di luar area scroll, dipasang relasi ke atribut form id */}
        {!isUserLoading && user && (
          <SheetFooter className="pt-2 border-t flex flex-row justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" form="update-user-form" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}