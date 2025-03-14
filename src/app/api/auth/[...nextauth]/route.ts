import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"
import { encryptSessionData } from "@/lib/session-utils";


export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
        CredentialsProvider({
        
      name: "Credentials",
      credentials: {
        phone: {label: "Phone Number", type: "text"},
        password: {label: "Password", type: "password"},
      },
        async authorize(credentials, req) {
            if (!credentials?.phone || !credentials?.password) {
                throw new Error('Phone number and password are required.')
            }
            
            const user = await prisma.user.findUnique({ where: { phone: credentials.phone } });
            if (!user) {
                throw new Error('Invalid phone number or password.')
            }
            
            const passwordMatch = await bcrypt.compare(credentials?.password || "", user.password);
            
            if (!passwordMatch) {
                throw new Error('Invalid email or password.')
            }
            return user
      },
    }),
  ], 
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
          token.user = {
            id: user.id,
            phone: user.phone,
            privateKey: await encryptSessionData(user.privateKey)
          };
          
        }
        return token;
        },
      async session({ session, token }: { session: any, token: any }) {
        if (token && token.user) {
            session.user = {
                id : token.user.id,
                phone: token.user.phone,
                privateKey: token.user.privateKey
            }
        }
            return session;
        },
        
    },
    session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };