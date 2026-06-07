import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBrandById } from "@/api/brand.api";

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
type DeleteBrandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
  brandName?: string;
};



export default function DeleteBrandDialog({
  open,
  onOpenChange,
  brandId,
  brandName,
}: DeleteBrandDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteBrandById(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
        toast.success("Brand has been deleted sucessfully")

      onOpenChange(false);
    },
    onError:(error:any)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create brand:${errorMessage}`)
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Brand?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {brandName ?? "this brand"}
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