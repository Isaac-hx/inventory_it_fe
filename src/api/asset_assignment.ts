import api from "@/api/axios";
import type { AssignmentQueryParams, AssignmentResponse,AssignmentRequest } from "@/types/asset_assignment";

export async function getAllAssignmentsWithQueryParams(params: AssignmentQueryParams) {
  const response = await api.get<AssignmentResponse>("/asset-assignments", {params});
  return response.data;
}

export async function getAssignmentById(assignmentId:string){
  const response = await api.get<AssignmentResponse>(`/asset-assignments/${assignmentId}`);
  return response.data;
}

export async function updateAssignmentById(assignmentId:string,payload:AssignmentRequest){
    const response = await api.put<AssignmentResponse>(`/asset-assignments/${assignmentId}`,payload)
    return response.data
}

export async function deleteAssignmentById(userId:string){
    const response = await api.delete<AssignmentResponse>(`/asset-assignments/${userId}`)
    return response.data
}

export async function getAllAssignments(){
    const response = await api.get<AssignmentResponse>(`/asset-assignments`)
    return response.data
}

export async function createAssignment(payload:AssignmentRequest){
    const response = await api.post<AssignmentResponse>("/asset-assignments",payload)
    return response.data

}
export async function getAllAssignmentsData(){
    const response = await api.get<AssignmentResponse>("/all-asset-assignments")
    return response.data
}