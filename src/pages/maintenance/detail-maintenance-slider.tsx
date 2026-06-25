import { getMaintenanceById } from "@/api/maintenance.api"; // Hubungkan ke API Maintenance
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";

type DetailMaintenanceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string; // Perbaikan typo dari maintenaceId
};

export default function DetailMaintenanceSheet({
  open,
  onOpenChange,
  maintenanceId,
}: DetailMaintenanceSheetProps) {
  
  // 1. Fetch data detail maintenance berdasarkan maintenanceId
  const { data, isLoading, isError } = useQuery({
    queryKey: ["maintenance-detail", maintenanceId],
    queryFn: () => getMaintenanceById(maintenanceId),
    enabled: open && !!maintenanceId,
  });

  const rawMaintenanceData = data?.data;

  // 2. Type Narrowing untuk mengantisipasi data berupa array atau objek tunggal
  const maintenance = Array.isArray(rawMaintenanceData) ? rawMaintenanceData[0] : rawMaintenanceData;

  // Fungsi pembantu memformat tanggal agar aman dari crash
  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Fungsi helper untuk memformat currency Rupiah pada cost
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col max-h-screen"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Detail Maintenance Log</SheetTitle>
          <SheetDescription>
            View repair costs, progress status, and issue logs for this maintenance record.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-2 my-4 space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center animate-pulse py-4">
              Loading maintenance detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500 text-center py-4">
              Failed to load maintenance detail.
            </p>
          )}

          {!isLoading && maintenance && (
            <>
              {/* Asset Info Card (Menampilkan aset yang terkait) */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Linked Asset Name
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {/* Mengantisipasi jika ada join object Asset dari backend */}
                  {maintenance.Asset?.AssetName || maintenance.AssetName }
                </p>
                {/* Menampilkan Serial Number jika disertakan dalam relasi */}
                {(maintenance.Asset?.serial_number || maintenance.serial_number) && (
                  <p className="mt-1 text-xs font-mono text-muted-foreground">
                    SN: {maintenance.Asset?.serial_number || maintenance.serial_number}
                  </p>
                )}
              </div>

              {/* Grid 2 Kolom untuk Cost & Status */}
              <div className="grid grid-cols-2 gap-2">
                {/* Maintenance Cost Info */}
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Maintenance Cost
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    {formatCurrency(maintenance.cost || maintenance.Cost)}
                  </p>
                </div>

                {/* Progress Status Info */}
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Progress Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 capitalize">
                    {maintenance.status || maintenance.Status || "-"}
                  </p>
                </div>
              </div>

              {/* Grid 2 Kolom untuk Schedule Date & Completed Date */}
              <div className="grid grid-cols-2 gap-2">
                {/* Maintenance At Info */}
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Schedule Repair Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {maintenance.maintenance_at || maintenance.MaintenanceAt || "-"}
                  </p>
                </div>

                {/* Completed At Info */}
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Completed At
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {maintenance.completed_at || maintenance.CompletedAt
                      ? (maintenance.completed_at || maintenance.CompletedAt)
                      : "-"
                    }
                  </p>
                </div>
              </div>

              {/* Description / Repair Logs Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Issue & Repair Description
                </p>
                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {maintenance.description || maintenance.Description || "-"}
                </p>
              </div>

              {/* Grid 2 Kolom untuk System Record Log */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Log Created At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {formatDate(maintenance.created_at || maintenance.CreatedAt)}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Log Updated At
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {formatDate(maintenance.updated_at || maintenance.UpdatedAt)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Fallback jika loading selesai tapi data kosong */}
          {!isLoading && !maintenance && !isError && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No maintenance data available.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}