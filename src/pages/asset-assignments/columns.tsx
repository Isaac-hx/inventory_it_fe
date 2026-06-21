import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { StatusBadge } from "@/components/shared/asset-status"; // Memakai badge status yang sama
import type { AssetAssignment } from "@/types/asset_assignment"; // Import tipe data assignment kamu
import AssignmentActionCell from "./action-cell";
// Definisi struktur kolom data untuk Asset Assignment
export const assignmentColumns: ColumnDef<AssetAssignment>[] = [
  {
    accessorKey: "AssetName",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset Name
          <ChevronsUpDown size={15} />
        </div>
      );
    },
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("AssetName") || "-"}</span>;
    },
  },
  {
    accessorKey: "Username",
    header: "Custodian (Employee)",
    cell: ({ row }) => {
      return <span>{row.getValue("Username") || "-"}</span>;
    },
  },
  {
    accessorKey: "AssignedByUsername",
    header: "Authorized By",
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.getValue("AssignedByUsername") || "-"}</span>;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const statusValue = row.getValue("Status") as string;
      return <StatusBadge status={statusValue} />;
    },
  },
  {
    accessorKey: "AssignedDate",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigned Date
          <ChevronsUpDown size={15} />
        </div>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("AssignedDate") as string;
      if (!dateValue) return <span>-</span>;
      
      return (
        <span>
          {dateValue}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Melempar data row original (AssignmentResponse) ke action cell (untuk edit/detail)
      return <AssignmentActionCell assignment={row.original} />;
    },
  },
];