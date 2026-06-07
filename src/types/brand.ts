export type Brand = {
    BrandId:string;
    BrandName:string;
    CreatedAt:string;
    UpdatedAt:string;
}

export type BrandRequest = {
    brand_name:string;

}
export type BrandQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
};


export type BrandResponse = {
    status:number;
    message:number;
    data:{
        brand:Brand[] | Brand;
    } 
    meta: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    }
}