"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/spinner";

import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({ phone: "", idNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setIsSuccess(true);
      setMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        router.push("/login"); // Redirect after 3 seconds
      }, 3000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create New Account</CardTitle>
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
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
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
            <div className="mt-6">
              <Button type="submit" className="w-full">
                {isLoading ? (
                  <>
                    <span>Registering</span>
                    <Spinner />
                  </>
                ) : (
                  <span>Register</span>
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={isSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful</AlertDialogTitle>
            <AlertDialogDescription>
              Now you can use your account to login to the system. Redirecting
              to login page in 3 seconds...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => router.push("/login")}>
            Go to Login
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
