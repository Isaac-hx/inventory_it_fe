import api from "@/api/axios";
import type { AssetQueryParams, AssetRequest,AssetResponse, ResponseAssetCategoryDistribution, ResponseAssetOverview } from "@/types/asset";

export async function getAllAssetsWithQueryParams(params: AssetQueryParams) {
  const response = await api.get<AssetResponse>("/assets", {params});
  return response.data;
}

export async function getAssetById(assetId:string){
  const response = await api.get<AssetResponse>(`/assets/${assetId}`);
  return response.data;
}

export async function updateAssetById(assetId:string,payload:AssetRequest){
    const response = await api.put<AssetResponse>(`/assets/${assetId}`,payload)
    return response.data
}

export async function deleteAssetById(assetId:string){
    const response = await api.delete<AssetResponse>(`/assets/${assetId}`)
    return response.data
}

export async function getAllAssets(){
    const response = await api.get<AssetResponse>(`/assets`)
    return response.data
}

export async function createAsset(payload:AssetRequest){
    const response = await api.post<AssetResponse>("/assets",payload)
    return response.data

}

export async function getAllAssetsData(){
    const response = await api.get<AssetResponse>("/all-assets")
    return response.data
}

export async function getAnalyticsOverviewAsset(){
    const response = await api.get<ResponseAssetOverview>("/assets/analytics")
    return response.data
}
export async function getAnalyticsAssetDistributionCategory(){
    const response = await api.get<ResponseAssetCategoryDistribution>("/assets/analytics/category-distribution")
    return response.data
}