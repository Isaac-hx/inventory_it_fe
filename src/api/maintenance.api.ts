import api from "@/api/axios";
import type { MaintenanceQueryParams,MaintenanceRequest,MaintenanceResponse} from "@/types/maintenance";

export async function getAllMaintenancesWithQueryParams(params: MaintenanceQueryParams) {
  const response = await api.get<MaintenanceResponse>("/maintenances", {params});
  return response.data;
}

export async function getMaintenanceById(maintenanceId:string){
  const response = await api.get<MaintenanceResponse>(`/maintenances/${maintenanceId}`);
  return response.data;
}

export async function updateMaintenanceById(maintenanceId:string,payload:MaintenanceRequest){
    const response = await api.put<MaintenanceResponse>(`/maintenances/${maintenanceId}`,payload)
    return response.data
}

export async function deleteMaintenanceById(maintenanceId:string){
    const response = await api.delete<MaintenanceResponse>(`/maintenances/${maintenanceId}`)
    return response.data
}

export async function getAllMaintenances(){
    const response = await api.get<MaintenanceResponse>(`/maintenances`)
    return response.data
}

export async function createMaintenance(payload:MaintenanceRequest){
    const response = await api.post<MaintenanceResponse>("/maintenances",payload)
    return response.data

}