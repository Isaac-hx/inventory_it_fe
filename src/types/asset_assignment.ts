import type { Category } from "./category";
import type { Asset } from "./asset";
import type { User } from "./user";

export type AssetAssignment = {
    AssignmentId:string;
    UserId:string;
    AssetId:string;
    Notes:string;
    AssignedById:string;
    AssignedByUsername:string;
    Status: "assigned" | "returned" | "damaged" | "lost";
    AssignedDate:string;
    ReturnDate:string | null;
    Asset:Asset;
    User:User;
    Category:Category;
    CreatedAt: string;
    UpdatedAt: string;
}

export type AssignmentRequest = {
    asset_id:string;
    user_id:string;
    notes:string;
    status:"assigned" | "returned" | "damaged" | "lost";
    assigned_date:string;
    return_date:string | null;
}
export type AssignmentQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
  status?:string;
};


export type AssignmentResponse = {
    status:number;
    message:number;
    data:{
        assignment:AssetAssignment[] | AssetAssignment;
    } 
       meta: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    } 
}