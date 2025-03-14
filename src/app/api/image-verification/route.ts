import { NextResponse } from "next/server";
import { getServerSession, AuthOptions } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route"

import prisma from "@/lib/prisma";
import { decryptWithPublicKey } from "@/lib/node-rsa-utils";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as AuthOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { hash, signature } = await req.json();

    if (!hash || !signature) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const userId = session.user.id 

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found')
    }   
    const publicKeyPem = user.publicKey
    
    const descrptedData = decryptWithPublicKey(signature, publicKeyPem);
    
    if (descrptedData != hash) {
      return NextResponse.json({ message: "Image verification failure"}, { status: 422 });
    }
    return NextResponse.json({ message: "Image verification successful"}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
