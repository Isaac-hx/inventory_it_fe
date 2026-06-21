"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignmentById } from "@/api/asset_assignment"; 

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DetailAssignmentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
};

export default function DetailAssignmentSheet({
  open,
  onOpenChange,
  assignmentId,
}: DetailAssignmentSheetProps) {
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignment-detail", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    enabled: open && !!assignmentId,
  });

  const rawAssignmentData = data?.data;
  const assignment = Array.isArray(rawAssignmentData) ? rawAssignmentData[0] : rawAssignmentData;

  const formatDateTime = (dateString: any) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? "-" 
      : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        // 🟢 FIX: Menggunakan overflow-y-auto di level SheetContent agar seluruh komponen nge-scroll ke bawah jika penuh
        // Menggunakan w-full sm:max-w-xl untuk memastikan responsivitas lebar sheet
        className="w-full sm:max-w-xl h-full p-0 overflow-y-auto overflow-x-hidden"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle>Asset Assignment Detail</SheetTitle>
          <SheetDescription>
            Comprehensive tracking details and custodian logs for this deployment.
          </SheetDescription>
        </SheetHeader>

        {/* 🚀 KONTEN UTAMA: Tanpa flex-1 h-full agar tidak mengunci tinggi layar, langsung mengalir ke bawah */}
        <div className="p-6 space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center animate-pulse my-4">
              Loading assignment logs...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500 text-center my-4 font-medium">
              Failed to load assignment log details.
            </p>
          )}

          {!isLoading && assignment && (
            <>
              {/* 1. Target Hardware Asset Info */}
              <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Hardware Asset
                </p>
                <p className="text-sm font-bold text-slate-800 break-words">
                  {assignment.Asset?.AssetName || assignment.asset_name || "-"}
                </p>
              </div>

              {/* 2. Grid Employee Custodian & Responsible Admin */}
              {/* 🟢 FIX: Menggunakan grid-cols-1 dan sm:grid-cols-2 agar di HP otomatis numpuk ke bawah (tidak kolaps) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Custodian Card */}
                <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Held By (Custodian)
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-words">
                    {assignment.username || assignment.Username || "-"}
                  </p>
                  {/* 🟢 FIX: break-all digunakan agar ID UUID panjang tidak merusak/menembus batas border x */}
                  <p className="text-[11px] text-muted-foreground font-mono break-all">
                    ID: {assignment.user_id || assignment.UserId || "-"}
                  </p>
                </div>

                {/* Admin Card */}
                <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Authorized By
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-words">
                    {assignment.assigned_by_username || assignment.AssignedByUsername || "-"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono break-all">
                    ID: {assignment.assigned_by_id || assignment.AssignedById || "-"}
                  </p>
                </div>
              </div>

              {/* 3. Grid Status & Handover Date */}
              {/* 🟢 FIX: Menggunakan grid-cols-1 dan sm:grid-cols-2 agar aman di view mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Deployment Status
                  </p>
                  <div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                      String(assignment.status || assignment.Status).toLowerCase() === "assigned" ? "bg-green-100 text-green-700" :
                      String(assignment.status || assignment.Status).toLowerCase() === "damaged" ? "bg-amber-100 text-amber-700" :
                      String(assignment.status || assignment.Status).toLowerCase() === "returned" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {assignment.status || assignment.Status || "-"}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assigned Date
                  </p>
                  <p className="text-sm font-semibold text-slate-700 break-words">
                    {formatDateTime(assignment.assigned_date || assignment.AssignedDate)}
                  </p>
                </div>
              </div>

              {/* 4. Handover Notes Section */}
              <div className="rounded-lg border bg-slate-50/50 p-4 space-y-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Operational Handover Notes
                </p>
                <p className="text-sm text-slate-700 bg-white border rounded p-2 italic min-h-[60px] whitespace-pre-wrap break-words">
                  {assignment.notes || assignment.Notes || "No custom deployment notes provided for this transaction."}
                </p>
              </div>

              {/* 5. Log System Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3 text-[11px] min-w-0">
                <div className="break-words">
                  <span className="text-muted-foreground block font-medium">Record Created At:</span>
                  <span className="font-semibold text-slate-500">
                    {formatDateTime(assignment.created_at || assignment.CreatedAt)}
                  </span>
                </div>
                <div className="break-words">
                  <span className="text-muted-foreground block font-medium">Last Modified At:</span>
                  <span className="font-semibold text-slate-500">
                    {formatDateTime(assignment.updated_at || assignment.UpdatedAt)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Fallback Jika Objek Kosong */}
          {!isLoading && !assignment && !isError && (
            <p className="text-sm text-muted-foreground text-center my-4">
              No active assignment log matches this record.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}