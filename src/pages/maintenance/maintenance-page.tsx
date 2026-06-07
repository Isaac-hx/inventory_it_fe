
import { DataTable } from "@/components/tables/data-table";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import CreateMaintenanceSheet from "./create-maintenance-dialog";
import { getAllMaintenancesWithQueryParams } from "@/api/maintenance.api";
import { maintenanceColumns } from "./columns";


export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  
  // Debounce 1000ms (1 detik) setelah user berhenti mengetik
  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending } = useQuery({
    // 👇 1. KUNCI UTAMA: Gunakan 'debouncedSearch' di sini, JANGAN 'search' murni
    queryKey: ["maintenances", page, limit, debouncedSearch, orderBy],
    queryFn: () =>
      getAllMaintenancesWithQueryParams({
        page,
        limit,
        search: debouncedSearch,
        order_by: orderBy,
      }),
    // 2. Mempertahankan data lama di layar saat transisi queryKey baru berjalan
    placeholderData: keepPreviousData,
  });
  console.log(data)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenances</h1>
          <p className="text-sm text-muted-foreground">Manage maintenances.</p>
        </div>

        <CreateMaintenanceSheet />
      </div>

      {/* 👇 3. INDIKATOR LOADING HALUS (Opsional):
        Jika data benar-benar kosong (loading pertama kali aplikasi dibuka), 
        tampilkan skeleton/text loading biasa agar halaman tidak kosong melompong.
      */}
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