"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";

import { DataTable } from "@/components/tables/data-table";
import CreateAssignmentDialog from "./create-assignment-dialog"; // Dialog yang baru dibuat
import { getAllAssignmentsData, getAllAssignmentsWithQueryParams } from "@/api/asset_assignment"; // API Query Params Assignment
import { assignmentColumns } from "./columns";
import { FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/components/shared/convert-to-excel";
import { Button } from "@/components/ui/button";


const assignmentColumnDef = [
  {header:"Assignment ID",key:"AssignmentId",width:15},
  {header:"Asset Name",key:"AssetName",width:15},
  {header:"Serial Number",key:"SerialNumber",width:15},
  {header:"Purchased Date",key:"PurchasedDate",width:15},
  {header:"Notes",key:"Notes",width:15},
  {header:"Status",key:"Status",width:15},
  {header:"Assigned Date",key:"AssignedDate",width:15},
  {header:"Return Date",key:"ReturnDate",width:15},


  {header:"Assigned To Username",key:"AssignedToUsername",width:15},
  {header:"Assigned To Email",key:"AssignedToEmail",width:15},
  {header:"Assigned To Role",key:"AssignedToRole",width:15},
  {header:"Department Name",key:"DepartmentName",width:15},


  {header:"Assigned By Username",key:"AssignedByUsername",width:15},


  {header:"Brand Name",key:"BrandName",width:15},
  {header:"CategoryName",key:"CategoryName",width:15},
  {header:"Created At",key:"CreatedAt",width:15},
  {header:"Updated At",key:"UpdatedAt",width:15}

]


export default function AssignmentPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orderBy, setOrderBy] = useState<string>("created_at_desc");

  // Debounce search agar backend tidak terbebani setiap ketikan huruf
  const debouncedSearch = useDebounce(search, 1000);

  // Fetch data list asset assignments dengan parameter lengkap
  const { data, isPending } = useQuery({
    queryKey: ["asset-assignments", page, limit, debouncedSearch, statusFilter, orderBy],
    queryFn: () =>
      getAllAssignmentsWithQueryParams({
        page,
        limit,
        search: debouncedSearch,
        order_by: orderBy,
      }),
    placeholderData: keepPreviousData, // Menjaga tabel tidak kedip/blank saat mengetik
  });
    return (
    <div className="space-y-6">
      {/* Header Bagian Atas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asset Deployments</h1>
          <p className="text-sm text-muted-foreground">
          
            Track hardware assignments, employee custodians, and return logs.
          </p>
        </div>

 
     <div className="space-x-2 flex">
          <Button 
          onClick={()=>{exportToExcel(assignmentColumnDef,getAllAssignmentsData,"assignments")}}
          variant="ghost" className={'border border-black bg-white'} >
            <FileSpreadsheet size={15}/>
            Export to excel</Button>
          <CreateAssignmentDialog />
        </div>

      </div>

      {/* Indikator Loading Awal Skenario Pertama */}
      {isPending && !data ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading assignment logs...
          </p>
        </div>
      ) : (
        <DataTable
          columns={assignmentColumns}
          data={data?.data ?? []}
          
          // Pengendali Input Search (Responsif Langsung di Layar)
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1); // Reset halaman ke 1 saat mulai mencari teks baru
          }}
          searchPlaceholder="Search custodian or device name..."

          // Pengendali Filter Dropdown Status Transaksi (Assigned, Damaged, dll)
          filterValue={statusFilter}
          onFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1); // Reset halaman ke 1 saat filter diubah
          }}
          filterOptions={[
            { label: "All Statuses", value: "all" },
            { label: "Assigned (Active)", value: "assigned" },
            { label: "Returned", value: "returned" },
            { label: "Damaged", value: "damaged" },
            { label: "Lost", value: "lost" },
          ]}

          // Sinkronisasi Metadata Pagination dari Go Backend Backend (`meta` struct)
          page={data?.meta?.Page ?? page}
          limit={data?.meta?.Limit ?? limit}
          totalData={data?.meta?.TotalData ?? 0}
          totalPage={data?.meta?.TotalPage ?? 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}