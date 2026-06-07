//Define struktur tabel
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/asset-status";
import {ChevronsUpDown } from "lucide-react";

import AssetActionCell from "./action-cell";
import type { Asset } from "@/types/asset";



// Definisi struktur kolom data
// accessorKey adalah kunci dari data atau key
// header adalah heade pada column data
export const assetColumns: ColumnDef<Asset>[] = [
{
    accessorKey: "AssetName",
    header: ({column})=>{
            return(
                <div 
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
                >
                    Asset Name
                    <div className="space-y-0">

                        <ChevronsUpDown size={15}/>
                    </div>

                </div>
        )}  },
    {
      accessorKey: "Status", // atau "status" menyesuaikan key payload JSON backend kamu
      header: "Status",
      cell: ({ row }) => {
        // Mengambil nilai status dari baris data yang sedang aktif
        const statusValue = row.getValue("Status") as string;
        
        return <StatusBadge status={statusValue} />;
      }
    },
    {
      accessorKey: "SerialNumber", 
      header: "Serial Number",
      cell: ({ row }) => {
        const serialValue = row.getValue("SerialNumber") as string;
        
        // Memastikan nilai ada (tidak null/undefined) sebelum diubah ke uppercase
        return (
          <span className="font-mono text-sm uppercase">
            {serialValue ? serialValue.toUpperCase() : "-"}
          </span>
        );
      }
    },{
    accessorKey: "PurchasedDate",
    header: ({column})=>{
        return(
            <div 
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
             >
                Purchased Date
                <div className="space-y-0">

                    <ChevronsUpDown size={15}/>
                </div>

            </div>
        )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("PurchasedDate") as string;

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
      return <AssetActionCell asset={row.original}/> 
     
    },
  },
];