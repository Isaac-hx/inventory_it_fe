export type Department = {
    DepartmentId:string;
    DepartmentName:string;
    CreatedAt:string;
    UpdatedAt:string;
}

export type DepartmentRequest = {
    department_name:string;

}
export type DepartmentQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
};

export type DepartmentResponse = {
    status:number;
    message:number;
    data:{
        department:Department[] | Department;
    } 
    meta?: {
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    }    
}