"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/spinner";

import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setIsLoading(true);
      const response: any = await signIn("credentials", {
        phone: form.phone,
        password: form.password,
        redirect: false,
      });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Login Failed:", error);
      setMessage("Phone number or password incorrect");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            {message && (
              <p className="mt-3 text-center text-red-500">{message}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button type="submit" className="w-full">
                {isLoading ? (
                  <>
                    <span>Logging in</span>
                    <Spinner />
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
