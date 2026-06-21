import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "../ui/breadcrumb";

interface NavigatorBreadCrumbsProps {
    pathname: string; // Contoh: "/users/123"
}

export default function NavigatorBreadcrumbs({ pathname }: NavigatorBreadCrumbsProps) {
    // 1. Pecah path berdasarkan "/" dan hapus string kosong
    const pathSegments = pathname.split("/").filter(Boolean);

    const primarySegment = pathSegments[0] || "";
    const currentSegment = pathSegments[pathSegments.length - 1] || "";

    // 2. Logika untuk mengubah ID menjadi teks "Detail"
    // Kita cek: Jika ini adalah halaman setelah "/users" dan memiliki segmen terakhir (ID)
    const isUserDetailPage = primarySegment === "users" && pathSegments.length > 1;
    
    // Jika benar halaman detail, tampilkan "Detail", jika bukan tampilkan segmen aslinya
    const displayName = isUserDetailPage ? "Detail" : currentSegment;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Home / Dashboard */}
                <BreadcrumbItem>
                    <BreadcrumbLink className="text-xs" href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                
                {/* Menu Utama (Contoh: Users) */}
                {pathSegments.length > 1 && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-xs capitalize" href={`/${primarySegment}`}>
                                {primarySegment}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}

                {/* Halaman Aktif (Sekarang tampil "Detail", bukan "123") */}
                {currentSegment && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs capitalize">
                                {displayName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}