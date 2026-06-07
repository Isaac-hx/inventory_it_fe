import api from "@/api/axios";
import type { BrandRequest,BrandResponse,BrandQueryParams } from "@/types/brand";

export async function createBrand(payload: BrandRequest) {
  const response = await api.post<BrandResponse>("/brands", payload);
  return response.data;
}

export async function getAllBrandsWithQueryParams(params:BrandQueryParams ) {
  const response = await api.get<BrandResponse>(`/brands`,{params});
  return response.data;
}

export async function getBranById(brandId:string){
    const response = await api.get<BrandResponse>(`/brands/${brandId}`)
    return response.data
}

export async function updateBrandById(brandId:string,payload:BrandRequest){
    const response = await api.put<BrandResponse>(`/brands/${brandId}`,payload)
    return response.data


}

export async function deleteBrandById(brandId:string){
    const response = await api.delete<BrandResponse>(`/brands/${brandId}`)
    return response.data
    

}

export async function getAllBrands(){
    const response = await api.get<BrandResponse>("/brands")
    return response.data
}
