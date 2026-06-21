import api from "@/api/axios";
import type { UserRequest ,UserResponse,UserQueryParams } from "@/types/user";

export async function getAllUsersWithQueryParams(params: UserQueryParams) {
  const response = await api.get<UserResponse>("/users", {params});
  return response.data;
}

export async function getUserById(userId:string){
  const response = await api.get<UserResponse>(`/users/${userId}`);
  return response.data;
}

export async function updateUserById(userId:string,payload:UserRequest){
    const response = await api.put<UserResponse>(`/users/${userId}`,payload)
    return response.data
}

export async function deleteUserById(userId:string){
    const response = await api.delete<UserResponse>(`/users/${userId}`)
    return response.data
}

export async function getAllUsers(){
  const response = await api.get<UserResponse>(`/users`)
  return response.data
}

export async function getAllUsersData(){
  const response = await api.get<UserResponse>(`/all-users`)
  return response.data
}