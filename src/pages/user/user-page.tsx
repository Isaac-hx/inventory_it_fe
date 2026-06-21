"use client";

import { DataTable } from "@/components/tables/data-table";
import { userColumns } from "./columns";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import CreateUserDialog from "./create-user-dialog";
import { getAllUsersData, getAllUsersWithQueryParams } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/components/shared/convert-to-excel";


const userColumnDef = [
  {header:"User Id",key:"UserId",width:15},
  {header:"Username",key:"Username",width:15},
  {header:"Email",key:"Email",width:15},
  {header:"Role",key:"Role",width:15},
  {header:"Department Name",key:"DepartmentName",width:15},
  {header:"Created At",key:"CreatedAt",width:15},
  {header:"Updated At",key:"UpdatedAt",width:15}

]

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  
  // Debounce 1000ms (1 detik) setelah user berhenti mengetik
  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending } = useQuery({
    // 👇 1. KUNCI UTAMA: Gunakan 'debouncedSearch' di sini, JANGAN 'search' murni
    queryKey: ["users", page, limit, debouncedSearch, orderBy],
    queryFn: () =>
      getAllUsersWithQueryParams({
        page,
        limit,
        search: debouncedSearch,
        order_by: orderBy,
      }),
    // 2. Mempertahankan data lama di layar saat transisi queryKey baru berjalan
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage users.</p>
        </div>

     <div className="space-x-2 flex">
          <Button 
          onClick={()=>{exportToExcel(userColumnDef,getAllUsersData,"users")}}
          variant="ghost" className={'border border-black bg-white'} >
            <FileSpreadsheet size={15}/>
            Export to excel</Button>
          <CreateUserDialog />
        </div>

      </div>

      {/* 👇 3. INDIKATOR LOADING HALUS (Opsional):
        Jika data benar-benar kosong (loading pertama kali aplikasi dibuka), 
        tampilkan skeleton/text loading biasa agar halaman tidak kosong melompong.
      */}
      {isPending && !data ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading users data...
          </p>
        </div>
      ) : (
        <DataTable
          columns={userColumns}
          data={data?.data ?? []}
          // 👇 4. Di prop ini tetap pakai 'search' murni supaya inputan ketikan di layar responsif
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1); // Reset ke halaman 1 setiap kali nyari data baru
          }}
          searchPlaceholder="Search user..."
          filterValue={orderBy}
          onFilterChange={(value) => {
            setOrderBy(value as "asc" | "desc");
            setPage(1);
          }}
          filterOptions={[
            { label: "A-Z", value: "asc" },
            { label: "Z-A", value: "desc" },
          ]}
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