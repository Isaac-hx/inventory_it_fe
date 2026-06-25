export type User = {
    UserId: string;
    Username: string;
    Email: string;
    Role: "superuser" | "admin_it" | "user";
    DepartmentId: string;
    DepartmentName: string;
    CreatedAt: string;
    UpdatedAt:string
}

export type UserQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  order_by?: string;
  role?:string;
};

export type UserRequest = {
    username:string;
    email:string;
    role: "superuser" | "admin_it" | "user";
    department_id: string;

}

export type UserResponse = {
    status:number;
    message:string;
    data:{
        user:User[] | User;
    }
    meta:{
        Page:number,
        Limit:number,
        TotalData:number,
        TotalPage:number,
    }
}