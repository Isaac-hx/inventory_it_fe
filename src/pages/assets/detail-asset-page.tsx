import { getAssetById } from "@/api/asset.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Package, Layers, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import UpdateAssetSheet from "./update-asset-slider";
import { StatusBadge } from "@/components/shared/asset-status";

export default function DetailPageAsset() {
  const { asset_id } = useParams();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["asset-detail", asset_id],
    queryFn: () => getAssetById(asset_id || ""),
    enabled: !!asset_id,
  });

  const rawAssetData = data?.data;
  const asset = Array.isArray(rawAssetData) ? rawAssetData[0] : rawAssetData;



  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Loading asset detail...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500">
          Failed to load asset detail.
        </p>
      )}

      {!isLoading && asset && (
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Navigation */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-100"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">
                    <Package className="text-white" size={22} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold text-slate-900 md:text-xl">
                      {asset.AssetName || asset.asset_name || "-"}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">
                        {asset.SerialNumber || asset.serial_number || "-"}
                      </span>
                        <StatusBadge status={asset.Status || asset.status}/>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }} 
                className="w-full gap-2 rounded-lg md:w-auto"
              >
                <Edit size={18} />
                Edit Asset
              </Button>
            </div>
          </div>

          {/* Content Information */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            
            {/* Card 1: Core Specifications */}
            <Card className="rounded-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold md:text-md">
                  <Package className="text-gray-700" size={20} />
                  Asset Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="Asset ID" value={asset.AssetId || asset.asset_id || asset_id || "-"} />
                  <InfoItem label="Asset Name" value={asset.AssetName || asset.asset_name || "-"} />
                  <InfoItem label="Serial Number" value={asset.SerialNumber || asset.serial_number || "-"} />
                  <InfoItem label="Quantity Stock" value={String(asset.QuantityStock ?? asset.quantity_stock ?? "0")} />
                  <InfoItem label="Status" value={asset.Status || asset.status || "-"} className="capitalize" />
                  <InfoItem label="Description" value={asset.Description || asset.description || "-"} />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Meta, Brand, and Category Info */}
            <div className="space-y-6">
              <Card className="rounded-md shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold md:text-sm">
                    <Layers className="text-gray-700" size={20} />
                    Classification
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="Brand Name" value={asset.BrandName || asset.brand_name || "-"} />
                    <InfoItem label="Category Name" value={asset.CategoryName || asset.category_name || "-"} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-md shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold md:text-sm">
                    <Calendar className="text-gray-700" size={20} />
                    History & Tracking
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="Purchased Date" value={asset.PurchasedDate || asset.purchased_date || "-"} />
                    <InfoItem label="Registered At" value={asset.CreatedAt || asset.created_at || "-"} />
                    <InfoItem label="Last Updated Data" value={asset.UpdatedAt || asset.updated_at || "-"} />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )}

      {/* Sheet untuk Update Slider */}
      <UpdateAssetSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        assetId={asset_id || ""}
      />

      {!isLoading && !asset && !isError && (
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