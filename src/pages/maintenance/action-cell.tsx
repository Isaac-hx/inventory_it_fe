// @/components/brand-action-cell.tsx (atau nama file komponen kamu)
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Trash, Play, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import DetailMaintenanceSheet from "./detail-maintenance-slider";
import type { Maintenance } from "@/types/maintenance";
import UpdateMaintenanceSheet from "./update-maintenance-slider";
import DeleteMaintenanceDialog from "./delete-maintenance-dialog";




export default function MaintenanceActionCell({ maintenance }: { maintenance: Maintenance }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const  [updateOpen,setUpdateOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
          onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setDetailOpen(true);
            }}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        <DropdownMenuSeparator/>
          <DropdownMenuItem           onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <Play className="mr-2 h-4 w-4"
            ></Play>
            Start
          </DropdownMenuItem>
          <DropdownMenuItem           
          onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <Check className="mr-2 h-4 w-4"
            ></Check>
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem           
          onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <X className="mr-2 h-4 w-4"
            ></X>
            Cancel
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem           onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <Pencil className="mr-2 h-4 w-4"
            ></Pencil>
            Edit
          </DropdownMenuItem>


        </DropdownMenuContent>
      </DropdownMenu>

      {/* PINDAHKAN DI SINI (Di luar DropdownMenu) */}
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