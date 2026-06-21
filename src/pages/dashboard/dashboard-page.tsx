import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOverviewAssets } from "@/api/asset.api"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Laptop, Activity, ChartPie } from "lucide-react";
import ChartPieSimple from "@/components/shared/charts";

type ItemInfoCardProps = {
  TitleItem: string;
  ContentItem: string | number;
  IconItem: React.ReactNode;
  ThemeColor: string;
};

type CardContenctWithInfoGraphic = {
  TitleCard: string;
  LinkCard?: string | null;
  IconCard: React.ReactNode;
  children: React.ReactNode;
};

// Reusable Component 1: Card dengan Grafik/Konten Kustom
function CardContentWithInfoGraphic({
  TitleCard,
  IconCard,
  children,
}: CardContenctWithInfoGraphic) {
  return (
    <Card className="rounded-md border-none shadow-sm bg-white p-4">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {IconCard}
                  <CardTitle className="text-md font-medium text-slate-800">{TitleCardz}</CardTitle>
        </div>
        <Button variant="link" className="text-slate-500 hover:text-slate-800 text-sm p-0 h-auto font-medium">
          View All
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[200px] pt-4">
        {children}
      </CardContent>
    </Card>
  );
}

// Reusable Component 2: Stat info singkat di bagian atas
function ItemInfoCard({ TitleItem, IconItem, ContentItem, ThemeColor }: ItemInfoCardProps) {
  return (
    <Card className="rounded-md border-none shadow-sm p-2 bg-white relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500">{TitleItem}</CardTitle>
        <div className={`p-2 bg-slate-50 rounded-xl ${ThemeColor}`}>
          {IconItem}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className={`text-3xl sm:text-4xl font-bold ${ThemeColor}`}>{ContentItem}</div>
        <button className="text-xs text-slate-400 font-medium hover:text-slate-600 mt-4 flex items-center justify-start gap-1 transition-colors">
          View all {TitleItem} <span className="text-[10px]">➔</span>
        </button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["asset-overview"],
    queryFn: getOverviewAssets, 
    placeholderData: keepPreviousData,
  });
  
  const { dataGraphics, isPending, isError } = useQuery({
    queryKey: ["asset-graphic"],
    queryFn: getOverviewAssets, 
    placeholderData: keepPreviousData,
  });
  
  const dashboardData = data?.data;

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Welcome back! Here's your asset IT overview.</p>
        </div>
      </div>

      {/* LOADING & ERROR STATES */}
      {isPending && !data ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading dashboard overview...
          </p>
        </div>
      ) : isError ? (
        <div className="flex h-48 items-center justify-center rounded-sm border bg-white">
          <p className="text-sm text-red-500">
            Error while fetching information...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* STATS CARDS SECTION (Grid 1 -> 2 -> 4 Kolom) */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ItemInfoCard
              TitleItem="Total Assets" 
              ContentItem={dashboardData?.total_asset ?? "0"}
              ThemeColor="text-blue-500"
              IconItem={<Laptop size={20} />}
            />

            <ItemInfoCard
              TitleItem="Available Assets"
              ContentItem={dashboardData?.total_asset_available ?? "0"}
              ThemeColor="text-green-500"
              IconItem={<Laptop size={20} />}
            />

            <ItemInfoCard
              TitleItem="Assigned Assets"
              ContentItem={dashboardData?.total_asset_assigned ?? "0"}
              ThemeColor="text-purple-500"
              IconItem={<Laptop size={20} />}
            />

            <ItemInfoCard
              TitleItem="Retired / Damaged"
              ContentItem={dashboardData?.total_asset_retired ?? "0"}
              ThemeColor="text-red-500"
              IconItem={<Laptop size={20} />}
            />
          </div>

          {/* LOWER GRAPHICS SECTION */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            
            {/* Kolom Kiri: Asset Status Chart */}
            <Card className="rounded-md border-none shadow-sm bg-white p-4">
              <CardHeader className="flex flex-row items-center justify-between p-0 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ChartPie className="text-blue-500" size={20} />
                  <CardTitle className="text-md font-medium text-slate-800">Asset Distribution by Category</CardTitle>
                </div>

              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[250px] pt-4">
                <ChartPieSimple />
              </CardContent>
            </Card>

            {/* Kolom Kanan: Log Aktivitas atau Info Tambahan */}
            <CardContentWithInfoGraphic 
              IconCard={<Activity className="text-purple-500" size={20} />} 
              TitleCard="Recent Activity"
            >
              <div className="text-center space-y-1">
                <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm font-medium text-slate-600">No recent activities</p>
                <p className="text-xs text-slate-400">Updates regarding deployment and maintenance will appear here.</p>
              </div>
            </CardContentWithInfoGraphic>
                
          </div>          
        </div>
      )}
    </div>
  );
}