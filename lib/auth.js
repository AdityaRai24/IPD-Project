import NextAuth, { AuthError } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./db";
import { authConfig } from "./auth.config";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        emailId: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isRegistering: { label: "Is Registering", type: "boolean" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.emailId || !credentials.password ) {
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
});