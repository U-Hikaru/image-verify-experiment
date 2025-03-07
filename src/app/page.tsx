import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { UploadImage } from "@/components/upload-image";
import { Footer } from "@/components/footer";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center w-full">
          <h1 className="text-5xl">Upload Image</h1>
        </div>
        <UploadImage session={session} />
      </main>
      <Footer />
    </div>
  );
}
