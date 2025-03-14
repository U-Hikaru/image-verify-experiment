 import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    phone: string;
    privateKey: string;
    // Add other custom fields as needed
  }

  interface Session {
    user: User;
    encryptedUser: any;
  }
}