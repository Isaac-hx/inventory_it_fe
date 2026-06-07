import type { Brand } from "./brand";
import type { Category } from "./category";

export type Asset = {
    AssetId:string;
    AssetName:string;
    SerialNumber:string;
    Description:string;
    PurchasedDate:string;
    Status:string;
    BrandId:string;
    CategoryId:string;
    Brand:Brand;
    Category:Category
    CategoryName:string;
    CreatedAt:string;
    UpdatedAt:string;
}

export type AssetRequest = {
    asset_name:string;
    serial_number:string;
    purchased_date:string;
    description:string;
    status:string;
    brand_id:string;
    category_id:string;
}
export type AssetQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
};


export type AssetResponse = {
    status:number;
    message:number;
    data:{
        asset:Asset[] | Asset;
    } 
       meta: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    } 
}