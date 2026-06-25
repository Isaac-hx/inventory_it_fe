// @/components/brand-action-cell.tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Trash, Play, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import DetailMaintenanceSheet from "./detail-maintenance-slider";
import type { Maintenance, MaintenanceRequest } from "@/types/maintenance";
import UpdateMaintenanceSheet from "./update-maintenance-slider";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Tambahkan useQueryClient
import { updateStatusMaintenanceById } from "@/api/maintenance.api";
import { toast } from "sonner";
import { FormatDate } from "@/components/shared/format-date";

export default function MaintenanceActionCell({ maintenance }: { maintenance: Maintenance }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  
  const queryClient = useQueryClient(); // Initialize queryClient di sini

  // Mutation untuk mengubah status secara langsung dari dropdown (Start, Complete, Cancel)
  const statusMutation = useMutation({
    mutationFn: (newStatus:string) => {
      // Sesuaikan payload ini dengan kebutuhan struktur backend kamu
      const payload: Partial<MaintenanceRequest> = {
        status: newStatus,
        // Jika backend mengharuskan mengirim data lama, mapping dari prop `maintenance`
        completed_at: newStatus === "completed" ? FormatDate(new Date().toISOString()) : null,
      };
      return updateStatusMaintenanceById(maintenance.MaintenanceId, payload as MaintenanceRequest);
    }
    ,
    onSuccess: () => {
      toast.success("Maintenance status updated successfully");
      // Memvalidasi ulang cache agar data di UI ikut ter-refresh
      queryClient.invalidateQueries({ queryKey: ["maintenances"] }); 
      queryClient.invalidateQueries({ queryKey: ["maintenances-status", maintenance.MaintenanceId] }); 
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update status: ${errorMessage}`);
    },
  });

  // Handler instan saat tombol status di-klik
  const handleStatusChange = (status:string) => {
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
          {/* 1. VIEW DETIL VIA ROUTE */}
          <DropdownMenuItem asChild>
            <Link
              to={`/maintenances/${maintenance.MaintenanceId}`}
              className="w-full flex items-center cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Detail
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* 2. LIVE STATUS UPDATES */}
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange("in_progress");
            }}
            disabled={maintenance.Status == "in_progress" ? true:false}
          >
            <Play className="mr-2 h-4 w-4 text-blue-500" />
            Start
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange("completed");
            }}
            disabled={maintenance.Status == "completed" ? true:false}
          >
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Completed
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange("cancelled");
            }}
            disabled={maintenance.Status == "cancelled" ? true:false}
          >
            <X className="mr-2 h-4 w-4 text-red-500" />
            Cancel 
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          {/* 3. EDIT FORM VIA SHEET */}
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

      {/* Sheet Components */}
      <DetailMaintenanceSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        maintenanceId={maintenance.MaintenanceId}
      />
      
      <UpdateMaintenanceSheet
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        maintenanceId={maintenance.MaintenanceId}
      />
    </>
  );
}