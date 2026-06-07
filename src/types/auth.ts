
export type Auth = {
    UserId:string;
    Username:string;
    Email:string;
    Role:"superuser" | "admin_it" | "user";
}

export type LoginRequest ={
    username_or_email:string;
    password:string;
}

export type LoginResponseUser = {
    status : number;
    message :string;
    data :{
        token:string;
        user:{
            totalPage:number;
            limit:number;
            TotalData:number;
            TotalPage:number;
        };
    }
}

export type RegisterRequest ={
    username:string;
    email:string;
    password:string;
    department_id:string;
    role:"superuser" | "admin_it" | "user";
}


export type RegisterResponse = {
    status:number;
    message:string;
    data:{
        user:Auth;
    }

}


