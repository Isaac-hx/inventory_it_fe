//Define struktur tabel
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import type { Department } from "@/types/department";
import DepartmentActionCell from "./action-cell";
// Definisi struktur kolom data



// accessorKey adalah kunci dari data atau key
// header adalah heade pada column data
export const departmentColumns: ColumnDef<Department>[] = [

  {
    accessorKey: "DepartmentName",
    header: ({column})=>{
            return(
                <div 
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
                >
                    Department Name
                    <div className="space-y-0">

                        <ChevronsUpDown size={15}/>
                    </div>

                </div>
        )}  },

  {
    accessorKey: "CreatedAt",
    header: ({column})=>{
        return(
            <div 
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
             >
                Created At
                <div className="space-y-0">

                    <ChevronsUpDown size={15}/>
                </div>

            </div>
        )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("CreatedAt") as string;

      return (
        <span className="">
          {createdAt}

        </span>
      );
    },
  },

  {
    id: "actions",

    cell: ({ row }) => {
      return <DepartmentActionCell department={row.original}/> 
     
    },
  },
];