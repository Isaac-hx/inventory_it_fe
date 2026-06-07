import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { loginApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginSchema } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Auth } from "@/types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      setErrorMessage("");

      const response = await loginApi(values);
 
      const user:Auth = {
        UserId: response.data.user.UserId,
        Username: response.data.user.Username,
        Email: response.data.user.Email,
        Role: response.data.user.Role,
      };

   
      setAuth(response.data.token, user);
      
      navigate("/");
    }catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        "Login gagal. Silakan coba lagi.";

      setErrorMessage(message);
      return;
    }

    setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
  }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold text-lg">
            Login to Inventory System
          </CardTitle>
          <CardDescription>
            Enter your username or email below to login to your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="username_or_email">
                Username or Email
              </Label>
              <Input
                id="username_or_email"
                type="text"
                placeholder="Username or email"
                {...register("username_or_email")}
              />
              {errors.username_or_email && (
                <p className="text-sm text-red-500">
                  {errors.username_or_email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4 flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Forgot password? Contact the{" "}
              <a href="#" className="underline">
                Administrator
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}