import api from "@/api/axios";
import type { LoginRequest, LoginResponseUser ,RegisterRequest,RegisterResponse} from "@/types/auth";

export async function loginApi(payload: LoginRequest) {
  const response = await api.post<LoginResponseUser>("/login", payload);
  return response.data;
}

export async function registerApi(payload:RegisterRequest){
    const response = await api.post<RegisterResponse>("/register",payload)
    return response.data
}