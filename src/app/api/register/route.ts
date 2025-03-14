import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateKeypair } from "@/lib/node-rsa-utils";

export async function POST(req: Request) {
  try {
    const { phone, idNumber, password } = await req.json();

    if (!phone || !idNumber || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate RSA Key Pair
    // const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    // const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    // const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);

    const { publicKey, privateKey } = generateKeypair();

    // Store user with keys
    const newUser = await prisma.user.create({
      data: { phone, idNumber, password: hashedPassword, publicKey, privateKey },
    });

    return NextResponse.json({ message: "User registered", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
