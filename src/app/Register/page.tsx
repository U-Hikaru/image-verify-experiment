import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export default async function Page() {
  const session = await getServerSession();

  console.log("session, ", session);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
