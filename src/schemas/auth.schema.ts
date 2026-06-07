import {z} from "zod"


export const loginSchema = z.object({
    username_or_email: z.string().min(1, "Username or email can't be blank"),
    password: z.string().min(1, "Password can't be blank"),
})

export type LoginSchema = z.infer<typeof loginSchema>