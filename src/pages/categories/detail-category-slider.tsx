import { getCategoryById } from "@/api/category.api";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useQuery } from "@tanstack/react-query";

type DetailCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
};

export default  function DetailCategoryDialog({
  open,
  onOpenChange,
  categoryId,
}: DetailCategoryDialogProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["category-detail", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: open && !!categoryId,
  });

    const rawCategoryData = data?.data;

  // 2. Lakukan Type Narrowing: Jika array, ambil indeks ke-0. Jika bukan, ambil langsung objeknya.
  const category = Array.isArray(rawCategoryData) ? rawCategoryData[0] : rawCategoryData;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail Category</SheetTitle>
          <SheetDescription>
            View selected category information.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading category detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load category detail.
            </p>
          )}

          {category && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Category ID
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {category.CategoryId}
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Category Name
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {category.CategoryName}
                </p>
              </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {new Date(category.CreatedAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {new Date(category.UpdatedAt).toLocaleDateString()}
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