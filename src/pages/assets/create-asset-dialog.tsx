import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import type { AssetRequest } from "@/types/asset";
import { createAsset } from "@/api/asset.api";
import { getAllBrands } from "@/api/brand.api";         // Pastikan path import ini benar
import { getAllCategories } from "@/api/category.api";   // Pastikan path import ini benar
import { Textarea } from "@/components/ui/textarea";

export default function CreateAssetDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch Data referensi untuk Dropdown (Brand & Category)
  const { data: brandsData, isPending: isBrandsPending } = useQuery({
    queryKey: ["brands", "all"],
    queryFn: getAllBrands,
    enabled: open, // Hanya fetch saat dialog terbuka
  });

  const { data: categoriesData, isPending: isCategoriesPending } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    enabled: open,
  });

  // 2. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetRequest>({
    defaultValues: {
      asset_name: "",
      brand_id: "",
      category_id: "",
      purchased_date: "",
      serial_number: "",
      description:"",
      status: "available",
    },
  });

  // 3. Mutation untuk Create Asset
  const mutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
      toast.success("Asset has been created successfully");
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Something went wrong.";
      toast.error(`Failed to create asset: ${errorMessage}`);
    },
  });

  const onSubmit = (values: AssetRequest) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>Create Asset</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Asset</DialogTitle>
          <DialogDescription>Add new asset data to IT Inventory.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3">
            
            {/* Asset Name */}
            <div className="space-y-1">
              <Label htmlFor="asset_name">Asset Name</Label>
              <Input
                id="asset_name"
                placeholder="Example: Asus X441UA / Monitor Dell"
                disabled={mutation.isPending}
                {...register("asset_name", {
                  required: "Asset name is required",
                })}
              />
              {errors.asset_name && (
                <p className="text-xs font-medium text-red-500">{errors.asset_name.message}</p>
              )}
            </div>

            {/* Serial Number */}
            <div className="space-y-1">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                placeholder="Example: SN-123456789X"
                disabled={mutation.isPending}
                {...register("serial_number", {
                  required: "Serial number is required",
                })}
              />
              {errors.serial_number && (
                <p className="text-xs font-medium text-red-500">{errors.serial_number.message}</p>
              )}
            </div>
                  {/* description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                disabled={mutation.isPending}
                {...register("description", {
                  required: "description  is required",
                })}
              />
              {errors.serial_number && (
                <p className="text-xs font-medium text-red-500">{errors.serial_number.message}</p>
              )}
            </div>
            {/* Grid 2 Kolom untuk Select Brand & Category */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Brand Select */}
              <div className="space-y-1">
                <Label>Brand</Label>
                <Controller
                  name="brand_id"
                  control={control}
                  rules={{ required: "Brand is required" }}
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
                          <div className="p-2 text-xs text-muted-foreground animate-pulse text-center">
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
                  rules={{ required: "Category is required" }}
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
                          <div className="p-2 text-xs text-muted-foreground animate-pulse text-center">
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

            {/* Purchased Date & Status */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Purchased Date */}
              <div className="space-y-1">
                <Label htmlFor="purchased_date">Purchased Date</Label>
                <Input
                  id="purchased_date"
                  type="date"
                  disabled={mutation.isPending}
                  {...register("purchased_date", {
                    required: "Purchased date is required",
                  })}
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
                  rules={{ required: "Status is required" }}
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

          {mutation.isError && (
            <p className="text-xs font-medium text-red-500">
              Failed to create asset. Please check your data.
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Saving..." : "Save Asset"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}