import { getBranById } from "@/api/brand.api";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useQuery } from "@tanstack/react-query";

type DetailBrandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
};

export default  function DetailBrandDialog({
  open,
  onOpenChange,
  brandId,
}: DetailBrandDialogProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brand-detail", brandId],
    queryFn: () => getBranById(brandId),
    enabled: open && !!brandId,
  });

    const rawBrandData = data?.data;

  // 2. Lakukan Type Narrowing: Jika array, ambil indeks ke-0. Jika bukan, ambil langsung objeknya.
  const brand = Array.isArray(rawBrandData) ? rawBrandData[0] : rawBrandData;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail Brand</SheetTitle>
          <SheetDescription>
            View selected brand information.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading brand detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load brand detail.
            </p>
          )}

          {brand && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Brand ID
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {brand.BrandId}
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Brand Name
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {brand.BrandName}
                </p>
              </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {new Date(brand.CreatedAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {new Date(brand.UpdatedAt).toLocaleDateString()}
                    </p>
                </div>
                </div>

            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}