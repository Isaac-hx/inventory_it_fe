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
import { deleteUserById } from "@/api/user.api";


type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username?: string;
};



export default function DeleteUserDialog({
  open,
  onOpenChange,
  userId,
  username,
}: DeleteUserDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteUserById(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User has been deleted sucessfully")

      onOpenChange(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create user:${errorMessage}`)
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {username ?? "this user"}
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