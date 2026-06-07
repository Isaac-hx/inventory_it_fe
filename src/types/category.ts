export type Category = {
    CategoryId:string;
    CategoryName:string;
    CreatedAt:string;
    UpdatedAt:string;
}

export type CategoryRequest = {
    category_name:string;

}


export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
};



export type CategoryResponse = {
    status:number;
    message:number;
    data:{
        category:Category[] | Category;
    } 
    meta: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    }}