
import { DataTable } from "@/components/tables/data-table";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import CreateMaintenanceSheet from "./create-maintenance-dialog";
import { getAllMaintenancesData, getAllMaintenancesWithQueryParams } from "@/api/maintenance.api";
import { maintenanceColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/components/shared/convert-to-excel";
import { FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";


const maintenanceColumnDef = [
  {header:"Maintenance Id",key:"MaintenanceId",width:15},
  {header:"Description",key:"Description",width:15},
  {header:"Cost",key:"Cost",width:15},
  {header:"Status",key:"Status",width:15},
  {header:"Asset Name",key:"AssetName",width:15},
  {header:"Serial Number",key:"SerialNumber",width:15},
  {header:"Maintenance At",key:"MaintenanceAt",width:15},
  {header:"Completed At",key:"CompletedAt",width:15},
  {header:"Brand Name",key:"BrandName",width:15},
  {header:"Category Name",key:"CategoryName",width:15},


  {header:"Created At",key:"CreatedAt",width:15},

  {header:"Updated At",key:"UpdatedAt",width:15}

]
export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  const [status,setStatus] = useState("")
  // Debounce 1000ms (1 detik) setelah user berhenti mengetik
  const debouncedSearch = useDebounce(search, 500);
  console.log(status)
  const { data, isPending } = useQuery({
    // 👇 1. KUNCI UTAMA: Gunakan 'debouncedSearch' di sini, JANGAN 'search' murni
    queryKey: ["maintenances", page, limit, debouncedSearch, orderBy,status],
    queryFn: () =>
      getAllMaintenancesWithQueryParams({
        page,
        limit,
        search: debouncedSearch,
        order_by: orderBy,
        status:status,
      }),
    // 2. Mempertahankan data lama di layar saat transisi queryKey baru berjalan
    placeholderData: keepPreviousData,
  });
const menuItems = [
    { key: "completed", value: "Completed" },
    { key: "pending", value: "Pending" },
    { key: "in_progress", value: "In Progress" },
    {key:"cancelled",value:"Cancelled"}
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenances</h1>
          <p className="text-sm text-muted-foreground">Manage maintenances.</p>
        </div>
     <div className="space-x-2 flex">
          <Button 
          onClick={()=>{exportToExcel(maintenanceColumnDef,getAllMaintenancesData,"maintenances")}}
          variant="ghost" className={'border border-black bg-white'} >
            <FileSpreadsheet size={15}/>
            Export to excel</Button>
          <CreateMaintenanceSheet />
        </div>
      </div>

      {/* 👇 3. INDIKATOR LOADING HALUS (Opsional):
        Jika data benar-benar kosong (loading pertama kali aplikasi dibuka), 
        tampilkan skeleton/text loading biasa agar halaman tidak kosong melompong.
      */}
      <Card className="p-4">
      {isPending && !data ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading maintenance data...
          </p>
        </div>
      ) : (
        <DataTable
          columns={maintenanceColumns}
          data={data?.data ?? []}
          // 👇 4. Di prop ini tetap pakai 'search' murni supaya inputan ketikan di layar responsif
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1); // Reset ke halaman 1 setiap kali nyari data baru
          }}
          searchPlaceholder="Search assets..."
          filterValue={orderBy}
          onFilterChange={(value) => {
            setOrderBy(value as "asc" | "desc");
            setPage(1);
          }}
          filterOptions={[
            { label: "A-Z", value: "asc" },
            { label: "Z-A", value: "desc" },
          ]}

          menuValue={status}
          onChangeValueMenu={setStatus}
          defaultValueButton="Status"
          menuItem={menuItems}

          page={data?.meta?.Page ?? page}
          limit={data?.meta?.Limit ?? limit}
          totalData={data?.meta?.TotalData ?? 0}
          totalPage={data?.meta?.TotalPage ?? 1}
          onPageChange={setPage}
        />
      )}
    </Card>
    </div>
  );
}