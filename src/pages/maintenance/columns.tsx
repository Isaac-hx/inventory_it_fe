//Define struktur tabel
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import type { Maintenance } from "@/types/maintenance";
import MaintenanceActionCell from "./action-cell";



// Definisi struktur kolom data
// accessorKey adalah kunci dari data atau key
// header adalah heade pada column data
export const maintenanceColumns: ColumnDef<Maintenance>[] = [
{
    accessorKey: "MaintenanceId",
    header:  "Maintenance ID"
  },
  {
    accessorKey: "AssetName",
    header:  ({column})=>{
        return(
            <div 
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
             >
                Asset Name
                <div className="space-y-0">

                    <ChevronsUpDown size={15}/>
                </div>

            </div>)      
    }
  },
{
  accessorKey: "Cost", // Menyesuaikan key payload JSON backend untuk data biaya
  header: "Cost",      // Mengubah label judul kolom menjadi Cost/Biaya
  cell: ({ row }) => {
    // 1. Ambil nilai nominal cost dari baris data aktif
    const amount = parseFloat(row.getValue("Cost"));
    
    // 2. Format nominal angka tersebut menjadi mata uang Rupiah (IDR)
    const formattedRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0, // Menghilangkan 2 digit nol (,00) di belakang koma
    }).format(amount);

    return (
      <span className="font-medium text-emerald-600">
        {isNaN(amount) ? "Rp 0" : formattedRupiah}
      </span>
    );
  }
},
    {
      accessorKey: "Status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("Status") as string;
        // Memastikan nilai ada (tidak null/undefined) sebelum diubah ke uppercase
        return (
          <span className={`${status === "pending" || status ==="cancelled" ? "text-red-500":"text-green-500"}`}>{status}</span>
        );
      }
    },{
    accessorKey: "MaintenanceAt",
    header: ({column})=>{
        return(
            <div 
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}           
             >
                Maintenance date
                <div className="space-y-0">

                    <ChevronsUpDown size={15}/>
                </div>

            </div>
        )
    },
    cell: ({ row }) => {
      const mainteanceAt = row.getValue("MaintenanceAt") as string;

      return (
        <span className="">
          {new Date(mainteanceAt).toLocaleDateString()}

        </span>
      );
    },
  },
{
    id: "actions",

    cell: ({ row }) => {
      return <MaintenanceActionCell maintenance={row.original}/> 
     
    },
  },
];