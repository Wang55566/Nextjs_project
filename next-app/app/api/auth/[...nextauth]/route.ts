import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers:[
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: 'email', placeholder: 'Eamil'},
        password: { label: "Password", type: 'password', placeholder: 'Password'}
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword!);

        return passwordMatch ? user : null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })

  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET!,
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
