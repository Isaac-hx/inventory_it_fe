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
    QuantityStock:number;
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
    quantity_stock:number;
    status:string;
    brand_id:string;
    category_id:string;
}
export type AssetQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
  status?:string;
};


export type AssetResponse = {
    status:number;
    message:string;
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



export type ResponseAssetOverview  ={
    status:number;
    message:string;
    data :{
        total_asset:number,
        total_asset_assigned:number,
        total_asset_available:number,
        total_asset_retired:number,
    }
}

export type ResponseAssetCategoryDistribution={
    status:number;
    message:string;
    data:{
        category_name:string;
        total_asset:number;
    }
}