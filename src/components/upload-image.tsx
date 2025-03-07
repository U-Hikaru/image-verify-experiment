"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";

interface ChildProps {
  session: any; // You can type this more strictly if you have a defined type
}

export function UploadImage({ session }: ChildProps) {
  const [image, setImage] = useState<string | null>(null);

  console.log(session);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    //   <div className="flex flex-col md:flex-row gap-8 p-4 space-4">
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
      <div className="flex flex-col gap-4">
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Button>Upload</Button>
      </div>

      {image ? (
        <div className="relative w-full max-w-sm">
          <Image
            src={image}
            alt="Uploaded preview"
            layout="responsive"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      ) : (
        <div className="w-full max-w-sm h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
    </div>
  );
}
