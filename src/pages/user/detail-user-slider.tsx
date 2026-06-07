import { getUserById } from "@/api/user.api"; // Pastikan fungsi API ini sudah ada
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";

type DetailUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string; // Menggunakan userId yang dikirim dari baris tabel
};

export default function DetailUserDialog({
  open,
  onOpenChange,
  userId,
}: DetailUserDialogProps) {
  
  // 1. Ambil data user berdasarkan userId yang aktif
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-detail", userId], // Mengubah key menjadi user-detail
    queryFn: () => getUserById(userId),
    enabled: open && !!userId, // Hanya berjalan jika sheet terbuka dan userId valid
  });
  console.log(data)
  const rawUserData = data?.data;

  // 2. Type Narrowing untuk mengantisipasi data berupa array atau objek tunggal
  const user = Array.isArray(rawUserData) ? rawUserData[0] : rawUserData;

  // Fungsi pembantu memformat tanggal agar tidak crash jika nilainya null/undefined
  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Menyertakan properti anti-flicker Radix UI */}
      <SheetContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Detail User</SheetTitle>
          <SheetDescription>
            View selected user account and profile information.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              Loading user detail...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to load user detail.
            </p>
          )}

          {/* JIKA DATA USER BERHASIL DIDAPATKAN */}
          {!isLoading && user && (
            <>
              {/* Username Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Username
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {user.Username || user.username || "-"}
                </p>
              </div>

              {/* Email Info */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Email Address
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {user.Email || user.email || "-"}
                </p>
              </div>

              {/* Grid Dua Kolom untuk Role dan Department */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 capitalize">
                    {user.Role || user.role || "-"}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {/* Mengambil nama dari relasi object department atau field langsung */}
                    {user.DepartmentName || user.department_name || "-"}
                  </p>
                </div>
              </div>

              {/* Grid Dua Kolom untuk Waktu Pendaftaran */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {formatDate(user.CreatedAt || user.created_at)}
                  </p>
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {formatDate(user.UpdatedAt || user.updated_at)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Fallback jika loading selesai tapi object data kosong */}
          {!isLoading && !user && !isError && (
            <p className="text-sm text-muted-foreground text-center">
              No user data available.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}