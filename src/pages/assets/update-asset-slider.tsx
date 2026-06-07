import {  useEffect } from "react";
import { getAssetById, updateAssetById } from "@/api/asset.api"; 
import { getAllBrands } from "@/api/brand.api"; 
import { getAllCategories } from "@/api/category.api"; 
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"; // Menggunakan Sheet shadcn
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import type { AssetRequest } from "@/types/asset";

type UpdateAssetSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
};

export default function UpdateAssetSheet({
  open,
  onOpenChange,
  assetId,
}: UpdateAssetSheetProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetRequest>({
    defaultValues: {
      asset_name: "",
      brand_id: "",
      category_id: "",
      purchased_date: "",
      serial_number: "",
      description: "",
      status: "available",
    },
  });

  const { data: assetData, isLoading: isAssetLoading, isError: isAssetError } = useQuery({
    queryKey: ["asset-detail", assetId],
    queryFn: () => getAssetById(assetId),
    enabled: open && !!assetId,
  });

  const { data: brandsData, isPending: isBrandsPending } = useQuery({
    queryKey: ["brands", "all"],
    queryFn: getAllBrands,
    enabled: open,
  });

  const { data: categoriesData, isPending: isCategoriesPending } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    enabled: open,
  });

  const rawAssetData = assetData?.data;
  const asset = Array.isArray(rawAssetData) ? rawAssetData[0] : rawAssetData;

  const formatInputDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!open || !asset) return;

    reset({
      asset_name: asset.asset_name || asset.AssetName || "",
      brand_id: String(
        asset.brand_id ||
        asset.BrandId ||
        asset.brand?.brand_id ||
        asset.brand?.BrandId ||
        asset.Brand?.BrandId ||
        ""
      ),
      category_id: String(
        asset.category_id ||
        asset.CategoryId ||
        asset.category?.category_id ||
        asset.category?.CategoryId ||
        asset.Category?.CategoryId ||
        ""
      ),
      purchased_date: formatInputDate(
        asset.purchased_date || asset.PurchasedDate
      ),
      serial_number: asset.serial_number || asset.SerialNumber || "",
      description: asset.description || asset.Description || "",
      status: asset.status || asset.Status || "available",
    });
  }, [open, asset, reset]);

  const mutation = useMutation({
    mutationFn: (values: AssetRequest) => updateAssetById(assetId, values),
    onSuccess: () => {
      toast.success("Asset has been updated successfully");
      queryClient.invalidateQueries({ queryKey: ["assets"] }); 
      queryClient.invalidateQueries({ queryKey: ["asset-detail", assetId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to update asset: ${errorMessage}`);
    },
  });

  const onSubmit = (values: AssetRequest) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* max-h-screen dan flex flex-col untuk mengaktifkan kendali layout vertikal */}
      <SheetContent 
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-2">
          <SheetTitle>Edit Asset Info</SheetTitle>
          <SheetDescription>
            Modify details, tracking status, or specifications for this hardware asset.
          </SheetDescription>
        </SheetHeader>

        {isAssetLoading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading asset data...
            </p>
          </div>
        )}

        {isAssetError && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-red-500">
              Failed to load asset detail.
            </p>
          </div>
        )}

        {/* Form dipisahkan strukturnya agar area input bisa scroll terpisah dari header/footer */}
        {!isAssetLoading && asset && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            
            {/* AREA FORM SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-4  space-y-4">
              
              {/* Asset Name Field */}
              <div className="space-y-1">
                <Label htmlFor="asset_name">Asset Name</Label>
                <Input
                  id="asset_name"
                  placeholder="Example: Asus X441UA"
                  disabled={mutation.isPending}
                  {...register("asset_name", { required: "Asset name is required" })}
                />
                {errors.asset_name && (
                  <p className="text-xs font-medium text-red-500">{errors.asset_name.message}</p>
                )}
              </div>

              {/* Serial Number Field */}
              <div className="space-y-1">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  placeholder="Example: SN-82391X"
                  disabled={mutation.isPending}
                  {...register("serial_number", { required: "Serial is required" })}
                />
                {errors.serial_number && (
                  <p className="text-xs font-medium text-red-500">{errors.serial_number.message}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description"
                  disabled={mutation.isPending}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Grid 2 Kolom untuk Select Brand & Category */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Brand Select */}
                <div className="space-y-1">
                  <Label>Brand</Label>
                  <Controller
                    name="brand_id"
                    control={control}
                    rules={{ required: "Brand wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={mutation.isPending || isBrandsPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {isBrandsPending ? (
                            <div className="p-2 text-xs text-muted-foreground text-center animate-pulse">
                              Loading brands...
                            </div>
                          ) : (
                            <SelectGroup>
                              <SelectLabel>Brands</SelectLabel>
                              {brandsData?.data?.map((brand: any) => (
                                <SelectItem
                                  key={brand.id || brand.BrandId}
                                  value={String(brand.id || brand.BrandId)}
                                >
                                  {brand.name || brand.BrandName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand_id && (
                    <p className="text-xs font-medium text-red-500">{errors.brand_id.message}</p>
                  )}
                </div>

                {/* Category Select */}
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Controller
                    name="category_id"
                    control={control}
                    rules={{ required: "Category wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={mutation.isPending || isCategoriesPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {isCategoriesPending ? (
                            <div className="p-2 text-xs text-muted-foreground text-center animate-pulse">
                              Loading categories...
                            </div>
                          ) : (
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {categoriesData?.data?.map((cat: any) => (
                                <SelectItem
                                  key={cat.id || cat.CategoryId}
                                  value={String(cat.id || cat.CategoryId)}
                                >
                                  {cat.name || cat.CategoryName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-xs font-medium text-red-500">{errors.category_id.message}</p>
                  )}
                </div>
              </div>

              {/* Grid 2 Kolom untuk Purchased Date & Status */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Purchased Date */}
                <div className="space-y-1">
                  <Label htmlFor="purchased_date">Purchased Date</Label>
                  <Input
                    id="purchased_date"
                    type="date"
                    disabled={mutation.isPending}
                    {...register("purchased_date", { required: "Tanggal beli wajib diisi" })}
                  />
                  {errors.purchased_date && (
                    <p className="text-xs font-medium text-red-500">{errors.purchased_date.message}</p>
                  )}
                </div>

                {/* Status Select */}
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={mutation.isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status Options</SelectLabel>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-xs font-medium text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>

            </div>

            {/* STICKY FOOTER ACTION BUTTONS */}
            <SheetFooter className="mt-auto pt-4 border-t flex flex-row justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}