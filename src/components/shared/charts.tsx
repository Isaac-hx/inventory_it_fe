import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Tipe data untuk item di dalam array chartData
export type PieChartDataItem = {
  name: string;      // Nama kategori (e.g., "Smartphone", "Laptop")
  value: number;     // Jumlah aset / data terkait
  fill: string;      // Menggunakan variabel CSS warna (e.g., "var(--color-smartphone)")
};

interface ChartPieSimpleProps {
  chartData: PieChartDataItem[];
  chartConfig: ChartConfig;
  dataKey?: string;  // Fallback default: "value"
  nameKey?: string;  // Fallback default: "name"
}

export default function ChartPieSimple({
  chartData,
  chartConfig,
  dataKey = "value",
  nameKey = "name",
}: ChartPieSimpleProps) {
  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie 
            data={chartData} 
            dataKey={dataKey} 
            nameKey={nameKey} 
          />
          <ChartLegend
            content={<ChartLegendContent nameKey={nameKey} />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-xs"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}