import type { Brand } from "./brand";
import type { Category } from "./category";
import type { Asset } from "./asset";


export type Maintenance = {
    MaintenanceId:string;
    Description:string;
    Cost:number;
    Status: "completed" | "pending" | "in_progress" | "cancelled";
    AssetId:string;
    MaintenanceAt:string;
    CompletedAt:string | null;
    Asset:Asset;
    Brand:Brand;
    Category:Category;
    CreatedAt: string;
    UpdatedAt: string;
}

export type MaintenanceRequest = {
    asset_id:string;
    description:string;
    status:"completed" | "pending" | "in_progress" | "cancelled";
    cost:number;
    maintenance_at:string;
}
export type MaintenanceQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
  status?:string;
};


export type MaintenanceResponse = {
    status:number;
    message:number;
    data:{
        maintenance:Asset[] | Asset;
    } 
       meta: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    } 
}