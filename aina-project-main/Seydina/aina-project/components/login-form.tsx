"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = z.object({
    email: z.string().email({ message: "Must be an email" }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("http://localhost:9001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: values.email,
          motpasse: values.password,
        }),
      });
  
      if (!res.ok) {
        const text = await res.text();
        setErrorMessage("Échec de la connexion : " + text);
        return;
      }
  
      const data = await res.json();
      const token = data.token || data.accessToken;
  
      if (!token || !data.user) {
        setErrorMessage("Données manquantes dans la réponse");
        return;
      }
  
      // ✅ Stocker le token et le user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      // ✅ Redirection
      router.push("/");
    } catch (err) {
      setErrorMessage("Erreur réseau ou serveur injoignable");
      console.error(err);
    }
  }
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-2">
            Welcome to AINA
          </CardTitle>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <p role="alert" className="text-red-700">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {errorMessage && (
                <p className="text-red-600 text-center text-sm mt-2">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/create-account" className="underline underline-offset-4">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
