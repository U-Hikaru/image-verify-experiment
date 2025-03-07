import Image from "next/image";
import { Button } from "@/components/ui/button";

import { UploadImage } from "@/components/upload-image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center w-full">
          <h1 className="text-5xl">Upload Image</h1>
        </div>
        <UploadImage />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Button variant="link">Log out</Button>
      </footer>
    </div>
  );
}
