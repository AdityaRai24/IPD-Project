import NextAuth, { AuthError } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./db";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        emailId: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isRegistering: { label: "Is Registering", type: "boolean" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.emailId || !credentials.password) {
          return null;
        }

        const email = credentials.emailId;
        const password = credentials.password;
        const isRegistering = credentials.isRegistering === "true";

        let user = await db.user.findUnique({
          where: { email },
        });

        if (isRegistering) {
          if (user) {
            throw new AuthError({cause: "User Already Exists"});
          }
          const hashedPassword = await bcrypt.hash(password, 10);

          user = await db.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });
          return user;
        } else {
          if (!user) {
            throw new AuthError({cause : "User does not exist"});
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new AuthError({cause :"Incorrect Password"});
          }
          return user;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/authenticate",
    error: "/authenticate",
  },
});