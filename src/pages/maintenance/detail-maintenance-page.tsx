import { getAssetById } from "@/api/asset.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Package, Layers, Calendar,Info, Wrench } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StatusBadge } from "@/components/shared/asset-status";
  import { getMaintenanceById } from "@/api/maintenance.api";
import UpdateMaintenanceSheet from "./update-maintenance-slider";

export default function DetailPageMaintenance() {
  const { maintenance_id } = useParams();
  console.log(maintenance_id)
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["maintenance-detail", maintenance_id],
    queryFn: () => getMaintenanceById(maintenance_id || ""),
    enabled: !!maintenance_id,
  });

  const rawMaintenanceData = data?.data;
  const maintenance = Array.isArray(rawMaintenanceData) ? rawMaintenanceData[0] : rawMaintenanceData;
  console.log(maintenance)


  return (

    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Loading maintenance detail...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500">Owner history
          Failed to load maintenance detail.
        </p>
      )}

      {!isLoading && maintenance && (
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Navigation */}
          <div className="rounded-md border bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-100"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-4 space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">
                    <Package className="text-white" size={22} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold text-primary md:text-xl">
                      {maintenance.AssetName || maintenance.asset_name || "-"}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">
                         {maintenance.SerialNumber}
                      </span>
                    </div>
                    {<StatusBadge status={maintenance.Status}/>}
                  </div>
                </div>
              </div>

              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }} 
                variant={"secondary"}
                className="w-full gap-2 rounded-lg md:w-auto"
              >
                <Edit size={18} />
                Edit maintenance
              </Button>
            </div>
          </div>

          {/* Content Information */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            
            {/* Card 1: Core Specifications */}
            <Card className="rounded-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex  items-center gap-2 text-base font-bold md:text-md">
                  <Package className="text-primary" size={20} />
                  Asset Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="Asset Name" value={maintenance.AssetName || maintenance.asset_name || "-"} />
                  <InfoItem label="Serial Number" value={maintenance.SerialNumber || maintenance.serial_number || "-"} />
                  <InfoItem label="Status" value={maintenance.Status || maintenance.status || "-"} className="capitalize" />
                  <InfoItem label="Brand" value={maintenance.BrandName || maintenance.BrandName || "-"} className="capitalize" />
                  <InfoItem label="Category" value={maintenance.CategoryName || maintenance.CategoryName || "-"} className="capitalize" />
                </div>
                
              </CardContent>
               <CardFooter>
                <div className="flex items-center gap-4">
                  <Info size={20} className="text-primary"/>
                  <p>
                    {
                      maintenance.Notes
                    }
                  </p>
                </div>
               </CardFooter>
            </Card>

            {/* Card 2: Meta, Brand, and Category Info */}
            <div className="space-y-6">
              <Card className="rounded-md shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold md:text-sm">
                    <Layers className="text-primary" size={20} />
                    Problem Description
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="Description" value={maintenance.Description || maintenance.Description || "-"} />
  
                  </div>


                </CardContent>
              </Card>

              <Card className="rounded-md shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2  font-bold md:text-sm">
                    <Wrench className="text-primary" size={20} />
                    Maintenance Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="Maintenance ID" value={maintenance.MaintenanceId || maintenance.MaintenanceId || "-"} />
                    <InfoItem label="Maintenance At " value={maintenance.MaintenanceAt || maintenance.MaintenanceAt || "-"} />
                    <InfoItem label="Status" value={maintenance.Status || maintenance.status || "-"} />
                    <InfoItem label="Completed At" value={maintenance.CompletedAt || maintenance.CompletedAt || "-"} />

                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )}

      {/* Sheet untuk Update Slider */}
      <UpdateMaintenanceSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        maintenanceId={maintenance_id || ""}
      />

      {!isLoading && !maintenance && !isError && (
        <p className="text-center text-sm text-muted-foreground">
          No asset data available.
        </p>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="min-w-0  p-4">
      <p className="text-xs font-medium text-slate-500 md:text-sm">
        {label}
      </p>
      <p className={`mt-1 break-words font-semibold text-slate-900 text-xs ${className}`}>
        {value}
      </p>
    </div>
  );
}

// 