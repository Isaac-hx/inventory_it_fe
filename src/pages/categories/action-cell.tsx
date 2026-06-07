// @/components/brand-action-cell.tsx (atau nama file komponen kamu)
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Category } from "@/types/category";
import DetailCategoryDialog from "./detail-category-slider";
import UpdateCategoryDialog from "./update-category-slider";
import DeleteCategoryDialog from "./delete-category-dialog";



export default function CategoryActionCell({ category }: { category: Category }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const  [updateOpen,setUpdateOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* Sifat bawaan Radix UI akan menutup DropdownMenu saat item diklik */}
          <DropdownMenuItem
          onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setDetailOpen(true);
            }}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem           onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <Pencil className="mr-2 h-4 w-4"
            ></Pencil>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:bg-red-50 focus:text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* PINDAHKAN DI SINI (Di luar DropdownMenu) */}
      <DetailCategoryDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        categoryId={category.CategoryId}
      />
      <UpdateCategoryDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        categoryId={category.CategoryId}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        categoryId={category.CategoryId}
        categoryName={category.CategoryName}
      />
    </>
  );
}