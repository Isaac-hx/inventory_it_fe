// @/components/brand-action-cell.tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Undo2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 

import type { AssetAssignment, AssignmentRequest } from "@/types/asset_assignment";
import DetailAssignmentSheet from "./detail-asset-slider";
import UpdateAssignmentSheet from "./update-assignment-slider";
import { Link } from "react-router";
import { updateAssignmentStatusById } from "@/api/asset_assignment";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssetReport from "@/components/shared/format-pdf";
import PrintAssetButton from "@/components/shared/print-asset-button";
const dummyData = {
  user: "John Doe",
  pt: "PT. Maju Mundur Sejahtera",
  processor: "Intel Core i7-13700H",
  ram: "16 GB DDR5",
  storage: "512 GB NVMe SSD",
};
export default function AssignmentActionCell({ assignment }: { assignment: AssetAssignment }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const queryClient = useQueryClient();

  // Mutation untuk mengubah status secara langsung dari dropdown
  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => {
      const payload: Partial<AssignmentRequest> = {
        status: newStatus,
      };
      return updateAssignmentStatusById(assignment.AssignmentId, payload as AssignmentRequest);
    },
    onSuccess: () => {
      toast.success("Assignment status updated successfully");
      
      // PERBAIKAN DI SINI: Pastikan queryKey ini sama dengan yang ada di useQuery halaman utama kamu
      // Jika di tabel utama kamu memakai ["asset-assignments"], ganti ke itu.
      queryClient.invalidateQueries({ queryKey: ["asset-assignments"] }); 
      
      // Perbaikan typo "assigment" -> "assignment"
      queryClient.invalidateQueries({ queryKey: ["assignment-status", assignment.AssignmentId] }); 
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update status: ${errorMessage}`);
    },
  });

  // Handler instan saat tombol status di-klik
  const handleStatusChange = (status: string) => {
    statusMutation.mutate(status);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* Menu View */}
          <DropdownMenuItem asChild>
            <Link
              to={`/asset-assignments/${assignment.AssignmentId}`}
              className="w-full flex items-center cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
             <PrintAssetButton data={dummyData} />  

          </DropdownMenuItem>
          {/* Menu Return */}
          <DropdownMenuItem  
            disabled={assignment.Status === "returned" || statusMutation.isPending} // Tambahkan loading check agar tidak double-click
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange("returned");
            }}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Return
          </DropdownMenuItem>

          {/* Menu Edit */}
          <DropdownMenuItem          
            onClick={(e) => {
              e.preventDefault(); 
              setUpdateOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Slider Sheets */}
      <DetailAssignmentSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        assignmentId={assignment.AssignmentId}
      />
      <UpdateAssignmentSheet
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        assignmentId={assignment.AssignmentId}
      />
    </>
  );
}