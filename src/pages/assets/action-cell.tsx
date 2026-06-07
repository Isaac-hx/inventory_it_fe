// @/components/brand-action-cell.tsx (atau nama file komponen kamu)
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/types/asset";
import DetailAssetDialog from "./detail-asset-slider";
import DeleteAssetDialog from "./delete-asset-dialog";
import UpdateAssetSheet from "./update-asset-slider";




export default function AssetActionCell({ asset }: { asset: Asset }) {
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
      <DetailAssetDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        assetId={asset.AssetId}
      />
      <UpdateAssetSheet
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        assetId={asset.AssetId}
      />

      <DeleteAssetDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        assetId={asset.AssetId}
        assetName={asset.AssetName}
      />
    </>
  );
}