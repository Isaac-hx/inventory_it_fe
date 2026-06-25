import { getDepartmentById } from "@/api/department.api";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useQuery } from "@tanstack/react-query";

type DetailDepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
};

export default  function DetailDepartmentDialog({
  open,
  onOpenChange,
  departmentId,
}: DetailDepartmentDialogProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brand-detail", departmentId],
    queryFn: () => getDepartmentById(departmentId),
    enabled: open && !!departmentId,
  });

    const rawDepartmentData = data?.data;

  // 2. Lakukan Type Narrowing: Jika array, ambil indeks ke-0. Jika bukan, ambil langsung objeknya.
  const department = Array.isArray(rawDepartmentData) ? rawDepartmentData[0] : rawDepartmentData;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail dpartment</SheetTitle>
          <SheetDescription>
            View selected Department information.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading Department detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load Department detail.
            </p>
          )}

          {department && (
            <>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Department ID
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {department.DepartmentId}
                </p>
              </div>

              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Department Name
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {department.DepartmentName}
                </p>
              </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {department.CreatedAt}
                    </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                    {department.UpdatedAt}
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