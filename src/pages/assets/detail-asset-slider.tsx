import { getAssetById } from "@/api/asset.api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";

type DetailAssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
};

export default function DetailAssetDialog({
  open,
  onOpenChange,
  assetId,
}: DetailAssetDialogProps) {
  
  // 1. Fetch data detail asset berdasarkan assetId
  const { data, isLoading, isError } = useQuery({
    queryKey: ["asset-detail", assetId],
    queryFn: () => getAssetById(assetId),
    enabled: open && !!assetId,
  });

  const rawAssetData = data?.data;

  // 2. Type Narrowing untuk mengantisipasi data berupa array atau objek tunggal
  const asset = Array.isArray(rawAssetData) ? rawAssetData[0] : rawAssetData;

  // Fungsi pembantu memformat tanggal agar aman dari crash
  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  return (
    <Sheet  open={open} onOpenChange={onOpenChange}>
      <SheetContent
      className={"flex flex-col max-h-screen  "}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Detail Asset</SheetTitle>
          <SheetDescription>
            View technical specifications and deployment logs for the selected asset.
          </SheetDescription>
        </SheetHeader>

    <div className="flex-1 overflow-y-auto p-2 my-4 space-y-4">
            {isLoading && (
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              Loading asset detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to load asset detail.
            </p>
          )}

          {!isLoading && asset && (
            <>
              {/* Asset Name Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Asset Name
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {asset.asset_name || asset.AssetName || "-"}
                </p>
              </div>

              {/* Serial Number Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Serial Number
                </p>
                <p className="mt-1 text-sm font-mono font-semibold text-slate-800">
                  {asset.serial_number || asset.SerialNumber || "-"}
                </p>
              </div>
              {/* Description Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Description
                </p>
                <p className="mt-1 text-sm font-mono font-semibold text-slate-800">
                  {asset.Description  || "-"}
                </p>
              </div>

              {/* Grid 2 Kolom untuk Brand & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Brand
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {/* Mengakomodasi jika berelasi object (asset.Brand.BrandName) atau langsung string */}
                    {asset.Brand?.BrandName || asset.brand_name || "-"}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {asset.Category?.CategoryName || asset.category_name || "-"}
                  </p>
                </div>
              </div>

              {/* Grid 2 Kolom untuk Purchased Date & Status */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Purchased Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(asset.purchased_date || asset.PurchasedDate)}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 capitalize">
                    {asset.Status || "-"}
                  </p>
                </div>
              </div>

              {/* Grid 2 Kolom untuk Record Log System */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {formatDate(asset.created_at || asset.CreatedAt)}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {formatDate(asset.updated_at || asset.UpdatedAt)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Fallback jika loading selesai tapi object kosong */}
          {!isLoading && !asset && !isError && (
            <p className="text-sm text-muted-foreground text-center">
              No asset data available.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}