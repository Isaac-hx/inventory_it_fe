import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";

import { Search,  } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import SelectFilter, { MenuFilter } from "../shared/filter";

type FilterOption = {
  label: string;
  value: string;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;

  roleValue?:string;
  onRoleChange?:(value:string)=>void

  //filter
  defaultValueButton:string;
  menuValue:string;
  onChangeValueMenu:(value:string)=>void
  menuItem:{key:string,value:string}[]
  

  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  onPageChange: (page: number) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data = [],

  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  roleValue="",
  onRoleChange,

  //filter
  defaultValueButton="select",
  menuValue="",
  onChangeValueMenu,
  menuItem,

  page,
  totalData,
  totalPage,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  //hook useReacttable
  const [sorting,setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPage,
    onSortingChange:setSorting,
    getFilteredRowModel:getFilteredRowModel(),
    getSortedRowModel:getSortedRowModel(),
    state:{
      sorting,
    }
  });

  //hoo


  return (
    <div className="space-y-4">
      <div className="flex gap-3 md:flex-row md:items-center md:justify-between ">
        <div className="w-full justify-between  flex flex-col gap-3 sm:flex-row sm:items-center ">
          {onSearchChange && (
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="bg-white pl-9"
              />
            </div>
          )}
          <div>
            {
              onChangeValueMenu &&            
              <MenuFilter
              menuValue={menuValue}
              defaultValueButton={defaultValueButton}
              onChangeMenuValue={onChangeValueMenu}
              menuItem={menuItem}
            />
            }

            {/* <SelectFilter onFilterChange={onRoleChange} selectedFilter={filterValue} selectName={filterValue} dataFilter={d}/> */}
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-none  bg-white">
        <Table>
          <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-medium text-primary "
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row,index) => (
                <TableRow className={`font-normal text-xs   ${index%2 == 0 ? "hover:bg-white/10":" hover:bg-slate-50/10"}`} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} of {totalData} data
        </p>

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPage}
          </p>

          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPage}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}