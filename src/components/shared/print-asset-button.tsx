import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button"; // Jika kamu pakai Shadcn UI
import AssetReport from "./format-pdf";

interface AssetData {
  user: string;
  pt: string;
  processor: string;
  ram: string;
  storage: string;
}

export default function PrintAssetButton({ data }: { data: AssetData }) {
  const [instance, updateInstance] = usePDF({
    document: <AssetReport data={data} />,
  });

  // Re-generate PDF jika data berubah
  useEffect(() => {
    updateInstance(<AssetReport data={data} />);
  }, [data]);

  const handlePrint = () => {
    if (!instance.url) return;

    // 1. Buka window baru (blank page)
    const printWindow = window.open(instance.url, "_blank");

    if (printWindow) {
      // 2. Fokus ke jendela baru tersebut
      printWindow.focus();
      
      // 3. Picu perintah print langsung setelah konten termuat
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      // Jika browser memblokir pop-up, arahkan ke download sebagai fallback aman
      alert("Pop-up diblokir oleh browser! Silakan izinkan pop-up untuk mencetak langsung.");
    }
  };

  return (
    <Button
      onClick={handlePrint}
      disabled={instance.loading}
        className="w-full justify-start rounded-none p-0 h-auto font-normal text-black hover:bg-slate-50 bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"    >
      <Printer className="mr-2 h-4 w-4" />
      {instance.loading ? "Printing " : "Print"}
    </Button>
  );
}