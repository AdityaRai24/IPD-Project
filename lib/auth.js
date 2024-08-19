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
        const isRegistering = credentials.isRegistering;

        let user = await db.user.findUnique({
          where: {
            email : email,
          },
        });
        console.log(user,"outside ")

        if (isRegistering === "true") {
          if (user) {
            throw new Error("User already exists");
          }
          const hashedPassword = await bcrypt.hash(password, 10);

          user = await db.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });

          console.log("great")
          return user;
        }

        // if (!user) {
        //   throw new Error("User does not exists");
        // } else {
        //   const isMatch = bcrypt.compare(hashedPassword, user.password);
        //   if (!isMatch) {
        //     throw new Error("Incorrect password");
        //   }
        // }
        // return user;
      },
    }),

  ],
});
