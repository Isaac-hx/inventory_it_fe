import api from "@/api/axios";

import type { DepartmentRequest,DepartmentResponse,DepartmentQueryParams } from "@/types/department";

export async function getAllDepartmentsWithQueryParams(params:DepartmentQueryParams){
    const response = await api.get<DepartmentResponse>("/departments",{params})
    return response.data
}

export async function getDepartmentById(departmentId:string){
    const response = await api.get<DepartmentResponse>(`/departments/${departmentId}`)
    return response.data
}

export async function createDepartment(payload:DepartmentRequest){
    const response = await api.post<DepartmentResponse>("/departments",payload)
    return response.data

}

export async function updateDepartmentById(departmentId:string,payload:DepartmentRequest){
    const response = await api.put<DepartmentResponse>(`/departments/${departmentId}`,payload)
    return response.data
}

export async function deleteDepartmentById(departmentId:string){
    const response = await api.delete<DepartmentResponse>(`/departments/${departmentId}`)
    return response.data
}

export async function getAllDepartments(){
    const response = await api.get<DepartmentResponse>("/departments")
    return response.data
}