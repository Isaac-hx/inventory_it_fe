
import { DataTable } from "@/components/tables/data-table";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import { getAllCategoriesWithQueryParams,getAllCategories } from "@/api/category.api";
import CreateCategoryDialog from "./create-category-dialog";
import { categoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/components/shared/convert-to-excel";


const categoryColumnDef = [
  {header:"Category ID",key:"CategoryId",width:15},
  {header:"Category Name",key:"CategoryName",width:15},
  {header:"Created At",key:"CreatedAt",width:15},
  {header:"Updated At",key:"UpdatedAt",width:15}

]

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  
  // Debounce 1000ms (1 detik) setelah user berhenti mengetik
  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending } = useQuery({
    // 👇 1. KUNCI UTAMA: Gunakan 'debouncedSearch' di sini, JANGAN 'search' murni
    queryKey: ["categories", page, limit, debouncedSearch, orderBy],
    queryFn: () =>
      getAllCategoriesWithQueryParams({
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
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage categories.</p>
        </div>
        <div className="space-x-2 flex">
          <Button 
          onClick={()=>{exportToExcel(categoryColumnDef,getAllCategories,"categories")}}
          variant="ghost" className={'border border-black bg-white'} >
            <FileSpreadsheet size={15}/>
            Export to excel</Button>
          <CreateCategoryDialog />
        </div>
  
      </div>

      {/* 👇 3. INDIKATOR LOADING HALUS (Opsional):
        Jika data benar-benar kosong (loading pertama kali aplikasi dibuka), 
        tampilkan skeleton/text loading biasa agar halaman tidak kosong melompong.
      */}
      {isPending && !data ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading categories data...
          </p>
        </div>
      ) : (
        <DataTable
          columns={categoryColumn}
          data={data?.data ?? []}
          // 👇 4. Di prop ini tetap pakai 'search' murni supaya inputan ketikan di layar responsif
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1); // Reset ke halaman 1 setiap kali nyari data baru
          }}
          searchPlaceholder="Search category..."
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