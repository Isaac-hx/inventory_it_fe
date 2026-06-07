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
import { deleteAssetById } from "@/api/asset.api";


type DeleteMaintenanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string;
  maintenanceName?: string;
};



export default function DeleteMaintenanceDialog({
  open,
  onOpenChange,
  maintenanceId,
  maintenanceName,
}: DeleteMaintenanceDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteAssetById(maintenanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
        toast.success("Asset has been deleted sucessfully")

      onOpenChange(false);
    },
    onError:(error)=>{
        const errorMessage = error?.response?.data?.error || "Something went wrong."
        toast.error(`Failed to create asset:${errorMessage}`)
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Maintenance?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {maintenanceName ?? "this asset"}
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