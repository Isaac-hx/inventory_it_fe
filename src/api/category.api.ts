import api from "@/api/axios";

import type { CategoryResponse,CategoryRequest,CategoryQueryParams } from "@/types/category";

export async function getAllCategoriesWithQueryParams(params:CategoryQueryParams){
    const response = await api.get<CategoryResponse>("/categories",{params})
    return response.data
}

export async function getCategoryById(categoryId:string){
    const response = await api.get<CategoryResponse>(`/categories/${categoryId}`)
    return response.data
}

export async function createCategory(payload:CategoryRequest){
    const response = await api.post<CategoryResponse>("/categories",payload)
    return response.data

}

export async function updateCategoryById(categoryId:string,payload:CategoryRequest){
    const response = await api.put<CategoryResponse>(`/categories/${categoryId}`,payload)
    return response.data
}

export async function deleteCategoryById(categoryId:string){
    const response = await api.delete<CategoryResponse>(`/categories/${categoryId}`)
    return response.data
}

export async function getAllCategories(){
    const response = await api.get<CategoryResponse>("/categories")
    return response.data
}
