import api from "@/api/axios";
import type { AssetQueryParams, AssetRequest,AssetResponse } from "@/types/asset";

export async function getAllAssetsWithQueryParams(params: AssetQueryParams) {
  const response = await api.get<AssetResponse>("/assets", {params});
  return response.data;
}

export async function getAssetById(userId:string){
  const response = await api.get<AssetResponse>(`/assets/${userId}`);
  return response.data;
}

export async function updateAssetById(userId:string,payload:AssetRequest){
    const response = await api.put<AssetResponse>(`/assets/${userId}`,payload)
    return response.data
}

export async function deleteAssetById(userId:string){
    const response = await api.delete<AssetResponse>(`/assets/${userId}`)
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