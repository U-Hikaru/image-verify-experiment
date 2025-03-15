"use client";
import { useState } from "react";
import Image from "next/image";
import crypto from "crypto";
import { toast } from "sonner";

import { encryptWithPrivateKey } from "@/lib/node-rsa-utils";
import { decryptSessionData } from "@/lib/session-utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "./spinner";

interface ChildProps {
  session: any; // You can type this more strictly if you have a defined type
}

export function UploadImage({ session }: ChildProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!imagePreview) {
      toast.warning("Please upload the image for verification!");
      return;
    }

    try {
      setIsLoading(true);
      const hash = crypto
        .createHash("sha256")
        .update(imagePreview)
        .digest("hex");

      const key = await decryptSessionData(session.user.privateKey);

      const encryptedData = encryptWithPrivateKey(hash, key);

      const res = await fetch("/api/image-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures session cookies are sent
        body: JSON.stringify({ hash: hash, signature: encryptedData }),
      });

      if (!res) throw new Error("Something went wrong!");

      if (res.status === 200) toast.success("Image verification successful");
      else toast.error("Image verification fail!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
      <div className="flex flex-col gap-4">
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button onClick={handleFileUpload}>
          {isLoading ? (
            <>
              <span>Uploading</span>
              <Spinner />
            </>
          ) : (
            <span>Upload</span>
          )}
        </Button>
      </div>

      {imagePreview ? (
        <div className="relative w-full max-w-sm">
          <Image
            src={imagePreview}
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
