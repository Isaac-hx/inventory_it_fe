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
import { ArrowLeft, Edit, Package, Layers, Calendar,Info } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StatusBadge } from "@/components/shared/asset-status";
import { getAssignmentById } from "@/api/asset_assignment";
import UpdateAssignmentSheet from "./update-assignment-slider";
import PrintAssetButton from "@/components/shared/print-asset-button";

const dummyData = {
  user: "John Doe",
  pt: "PT. Maju Mundur Sejahtera",
  processor: "Intel Core i7-13700H",
  ram: "16 GB DDR5",
  storage: "512 GB NVMe SSD",
};

export default function DetailPageAssignment() {
  const { assignment_id } = useParams();
  console.log(assignment_id)
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignment-detail", assignment_id],
    queryFn: () => getAssignmentById(assignment_id || ""),
    enabled: !!assignment_id,
  });

  const rawAssignmentData = data?.data;
  const assignment = Array.isArray(rawAssignmentData) ? rawAssignmentData[0] : rawAssignmentData;
  console.log(assignment)


  return (

    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Loading assignment detail...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500">Owner history
          Failed to load assignment detail.
        </p>
      )}

      {!isLoading && assignment && (
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
                      {assignment.AssetName || assignment.asset_name || "-"}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">
                         {assignment.CategoryName } • {assignment.BrandName}
                      </span>
                    </div>
                    {<StatusBadge status={assignment.Status}/>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }} 
                variant={"secondary"}
                className="w-full gap-2 rounded-lg md:w-auto"
              >
                <Edit size={18} />
                Edit Assignment
              </Button>

                <PrintAssetButton  data={dummyData}/>

              </div>

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
                  <InfoItem label="Asset ID" value={assignment.AssetId || assignment.asset_id ||   "-"} />
                  <InfoItem label="Asset Name" value={assignment.AssetName || assignment.asset_name || "-"} />
                  <InfoItem label="Asset Name" value={assignment.Processor || assignment.processor || "-"} />
                  <InfoItem label="Asset Name" value={assignment.Ram || assignment.ram || "-"} />
                  <InfoItem label="Asset Name" value={assignment.Storage || assignment.storage || "-"} />
                  <InfoItem label="Serial Number" value={assignment.SerialNumber || assignment.serial_number || "-"} />
                  <InfoItem label="Quantity Stock" value={String(assignment.QuantityStock ?? assignment.quantity_stock ?? "0")} />
                  <InfoItem label="Status" value={assignment.Status || assignment.status || "-"} className="capitalize" />
                  <InfoItem label="Brand" value={assignment.BrandName || assignment.BrandName || "-"} className="capitalize" />
                  <InfoItem label="Category" value={assignment.CategoryName || assignment.CategoryName || "-"} className="capitalize" />
                </div>
                
              </CardContent>
               <CardFooter>
                <div className="flex items-center gap-4">
                  <Info size={20} className="text-primary"/>
                  <p>
                    {
                      assignment.Notes
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
                    User Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="User ID" value={assignment.AssignedToId || assignment.AssignedToId || "-"} />
                    <InfoItem label="Username" value={assignment.AssignedToUsername || assignment.AssignedToUsername || "-"} />
                    <InfoItem label="Email" value={assignment.AssignedToEmail || assignment.AssignedToEmail || "-"} />
                    <InfoItem label="Department Name" value={assignment.DepartmentName || assignment.AssignedToEmail || "-"} />

  
                  </div>


                </CardContent>
              </Card>

              <Card className="rounded-md shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2  font-bold md:text-sm">
                    <Calendar className="text-primary" size={20} />
                    History & Tracking
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem label="Purchased Date" value={assignment.PurchasedDate || assignment.purchased_date || "-"} />
                    <InfoItem label="Returned Date" value={assignment.ReturnDate || assignment.ReturnDate || "-"} />
                    <InfoItem label="Registered At" value={assignment.CreatedAt || assignment.created_at || "-"} />
                    <InfoItem label="Last Updated Data" value={assignment.UpdatedAt || assignment.updated_at || "-"} />

                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )}

      {/* Sheet untuk Update Slider */}
      <UpdateAssignmentSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        assignmentId={assignment_id || ""}
      />

      {!isLoading && !assignment && !isError && (
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