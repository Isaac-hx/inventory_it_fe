//Define struktur tabel
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical,Pencil,Eye,Trash,ChevronsUpDown } from "lucide-react";
import UserActionCell from "./action-cell";

// Definisi struktur kolom data
// accessorKey adalah kunci dari data atau key
// header adalah heade pada column data
export const userColumns: ColumnDef<User>[] = [
{
    accessorKey: "Username",
    header: ({column})=>{
            return(
                <div 
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
                >
                    Username
                    <div className="space-y-0">

                        <ChevronsUpDown size={15}/>
                    </div>

                </div>
        )}  },
{
    accessorKey: "Email",
    header: ({column})=>{
            return(
                <div 
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
                >
                    Email
                    <div className="space-y-0">

                        <ChevronsUpDown size={15}/>
                    </div>

                </div>
        )}  },

  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("Role") as string;

      return (
        <Badge variant="outline">
          {role}
        </Badge>
      );
    },
  },

  {
    accessorKey: "DepartmentName",
    header: "Department",
  },

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
          {new Date(createdAt).toLocaleDateString()}

        </span>
      );
    },
  },
{
    id: "actions",

    cell: ({ row }) => {
      return <UserActionCell user={row.original}/> 
     
    },
  },
];