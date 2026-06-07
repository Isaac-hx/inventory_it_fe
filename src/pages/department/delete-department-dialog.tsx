import { useMutation, useQueryClient } from "@tanstack/react-query";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {toast} from 'sonner'
import { deleteDepartmentById } from "@/api/department.api";
type DeleteDepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  departmentName?: string;
};



export default function DeleteDepartmentDialog({
  open,
  onOpenChange,
  departmentId,
  departmentName,
}: DeleteDepartmentDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteDepartmentById(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
        toast.success("Department has been deleted sucessfully")

      onOpenChange(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create department:${errorMessage}`)
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Department?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {departmentName ?? "this department"}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}